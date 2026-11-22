import {NextResponse} from "next/server";
import {z} from "zod";
import {prisma} from "@/lib/prisma";
import {session,audit,hasValidRequestOrigin} from "@/lib/security";
const schema=z.object({institutionId:z.string().uuid(),serviceType:z.string().trim().min(3).max(80),applicantNote:z.string().max(3000).optional()});
export async function GET(){
 try { const {profile}=await session(); const staff=["OFFICER","APPROVER","ADMIN"].includes(profile.role);
 const rows=await prisma.application.findMany({where:staff?{}:{institution:{members:{some:{userProfileId:profile.id}}}},include:{institution:true,documents:{select:{id:true,documentType:true,originalName:true,mimeType:true,sizeBytes:true}}},orderBy:{updatedAt:"desc"},take:100});
 return NextResponse.json({data:rows.map(a=>({...a,documents:a.documents.map(d=>({...d,sizeBytes:d.sizeBytes.toString()}))}))});
 } catch {return NextResponse.json({error:"Sesi tidak valid atau profil belum disiapkan."},{status:401});}
}
export async function POST(req:Request){
 if(!hasValidRequestOrigin(req))return NextResponse.json({error:"Asal permintaan tidak valid."},{status:403});
 try {const {user,profile}=await session(); const p=schema.safeParse(await req.json().catch(()=>null)); if(!p.success)return NextResponse.json({error:"Data pengajuan tidak valid."},{status:400});
 const member=await prisma.institutionMember.findFirst({where:{institutionId:p.data.institutionId,userProfileId:profile.id}});
 if(!member)return NextResponse.json({error:"Akses lembaga ditolak."},{status:403});
 const app=await prisma.application.create({data:{institutionId:p.data.institutionId,serviceType:p.data.serviceType,applicantNote:p.data.applicantNote}});
 await audit(user.id,"APPLICATION_CREATED","Application",app.id);
 return NextResponse.json({data:{id:app.id,status:app.status}},{status:201});
 }catch(e){const m=e instanceof Error?e.message:"";return NextResponse.json({error:m==="UNAUTHENTICATED"?"Silakan login.":"Profil atau database belum siap."},{status:m==="UNAUTHENTICATED"?401:500});}
}