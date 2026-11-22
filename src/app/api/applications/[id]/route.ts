import {NextResponse} from "next/server";
import {z} from "zod";
import {randomUUID} from "node:crypto";
import {prisma} from "@/lib/prisma";
import {session,audit,storageAdmin,BUCKET,MAX_BYTES} from "@/lib/security";
type C={params:Promise<{id:string}>};
const actionSchema=z.discriminatedUnion("action",[
 z.object({action:z.literal("submit")}),z.object({action:z.literal("start_review")}),
 z.object({action:z.literal("request_revision"),notes:z.string().min(3).max(3000)}),
 z.object({action:z.literal("approve"),notes:z.string().max(3000).optional()}),
 z.object({action:z.literal("reject"),notes:z.string().min(3).max(3000)}),
 z.object({action:z.literal("issue"),documentNumber:z.string().min(3).max(120),storagePath:z.string().min(5).max(500)})
]);
export async function POST(req:Request,ctx:C){
 let uploaded:string|undefined;
 try{
 const {user,profile}=await session(); const {id}=await ctx.params;
 const app=await prisma.application.findUnique({where:{id},include:{institution:{include:{members:true}},documents:true}});
 if(!app)return NextResponse.json({error:"Pengajuan tidak ditemukan."},{status:404});
 const isMember=app.institution.members.some(m=>m.userProfileId===profile.id);
 const staff=["OFFICER","APPROVER","ADMIN"].includes(profile.role);
 const content=req.headers.get("content-type")||"";
 if(content.includes("multipart/form-data")){
  if(!isMember&&!staff)return NextResponse.json({error:"Akses ditolak."},{status:403});
  if(!["DRAFT","NEEDS_REVISION","APPROVED"].includes(app.status))return NextResponse.json({error:"Dokumen tidak dapat diubah pada status ini."},{status:409});
  const f=await req.formData(), file=f.get("file"), kind=String(f.get("documentType")||"").trim();
  if(!(file instanceof File)||!kind||kind.length>100||file.size<1||file.size>MAX_BYTES||!["application/pdf","image/jpeg","image/png"].includes(file.type))return NextResponse.json({error:"Pilih PDF/JPG/PNG maksimal 10 MB dan jenis dokumen."},{status:400});
  const ext=file.type==="application/pdf"?"pdf":file.type==="image/png"?"png":"jpg";
  uploaded=`${app.institutionId}/${id}/${randomUUID()}.${ext}`;
  const {error}=await storageAdmin().storage.from(BUCKET).upload(uploaded,file,{contentType:file.type,upsert:false});
  if(error)throw new Error("UPLOAD_FAILED");
  const doc=await prisma.applicationDocument.create({data:{applicationId:id,documentType:kind,storagePath:uploaded,originalName:file.name.replace(/[\\/\\0]/g,"").slice(0,255)||"dokumen",mimeType:file.type,sizeBytes:BigInt(file.size)}});
  await audit(user.id,"DOCUMENT_UPLOADED","ApplicationDocument",doc.id,{applicationId:id});
  return NextResponse.json({data:{id:doc.id,documentType:doc.documentType}},{status:201});
 }
 const p=actionSchema.safeParse(await req.json().catch(()=>null)); if(!p.success)return NextResponse.json({error:"Aksi tidak valid."},{status:400});
 const a=p.data.action; let next=app.status;
 if(a==="submit"){if(!isMember||!["DRAFT","NEEDS_REVISION"].includes(app.status)||app.documents.length===0)return NextResponse.json({error:"Pastikan Anda anggota lembaga dan dokumen sudah diunggah."},{status:409});next="SUBMITTED";}
 else if(a==="start_review"||a==="request_revision"){if(!staff||profile.role==="APPROVER"||!["SUBMITTED","UNDER_REVIEW"].includes(app.status))return NextResponse.json({error:"Akses atau status tidak sesuai."},{status:403});next=a==="start_review"?"UNDER_REVIEW":"NEEDS_REVISION";}
 else if(a==="approve"||a==="reject"){if(!["APPROVER","ADMIN"].includes(profile.role)||app.status!=="UNDER_REVIEW")return NextResponse.json({error:"Hanya pejabat berwenang dapat memutuskan."},{status:403});next=a==="approve"?"APPROVED":"REJECTED";}
 else {if(!["APPROVER","ADMIN"].includes(profile.role)||app.status!=="APPROVED"||!p.data.storagePath.startsWith(`${app.institutionId}/${id}/`))return NextResponse.json({error:"Status atau lokasi berkas tidak sesuai."},{status:409});}
 await prisma.$transaction(async tx=>{
  if(a==="issue"){await tx.issuedDocument.create({data:{applicationId:id,issuerId:profile.id,documentNumber:p.data.documentNumber,storagePath:p.data.storagePath}});await tx.application.update({where:{id,status:"APPROVED"},data:{status:"ISSUED"}});}
  else {await tx.application.update({where:{id,status:app.status},data:{status:next,...(a==="submit"?{submittedAt:new Date()}:{})}});}
  if(a==="start_review"||a==="request_revision")await tx.verification.create({data:{applicationId:id,officerId:profile.id,result:a==="start_review"?"IN_REVIEW":"REVISION_REQUIRED",notes:a==="request_revision"?p.data.notes:null}});
  if(a==="approve"||a==="reject")await tx.decision.create({data:{applicationId:id,approverId:profile.id,result:a==="approve"?"APPROVED":"REJECTED",notes:p.data.notes}});
  await tx.auditLog.create({data:{actorAuthId:user.id,action:`APPLICATION_${a.toUpperCase()}`,entityType:"Application",entityId:id,metadata:{from:app.status,to:a==="issue"?"ISSUED":next}}});
 });
 return NextResponse.json({ok:true,status:a==="issue"?"ISSUED":next});
 }catch(e){if(uploaded){try{await storageAdmin().storage.from(BUCKET).remove([uploaded]);}catch{}}const m=e instanceof Error?e.message:"";return NextResponse.json({error:m==="UNAUTHENTICATED"?"Silakan login.":"Aksi gagal. Periksa konfigurasi, lalu muat ulang."},{status:m==="UNAUTHENTICATED"?401:500});}
}