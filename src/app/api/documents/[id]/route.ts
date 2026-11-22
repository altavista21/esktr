import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {session,storageAdmin,BUCKET} from "@/lib/security";
type C={params:Promise<{id:string}>};
export async function GET(_req:Request,ctx:C){
 try{const {profile}=await session();const {id}=await ctx.params;
 const doc=await prisma.applicationDocument.findUnique({where:{id},include:{application:{include:{institution:{include:{members:true}}}}}});
 if(!doc)return NextResponse.json({error:"Dokumen tidak ditemukan."},{status:404});
 const member=doc.application.institution.members.some(m=>m.userProfileId===profile.id),staff=["OFFICER","APPROVER","ADMIN"].includes(profile.role);
 if(!member&&!staff)return NextResponse.json({error:"Akses ditolak."},{status:403});
 const {data,error}=await storageAdmin().storage.from(BUCKET).createSignedUrl(doc.storagePath,60);
 if(error||!data?.signedUrl)return NextResponse.json({error:"Dokumen tidak tersedia."},{status:502});
 return NextResponse.redirect(data.signedUrl);
 }catch{return NextResponse.json({error:"Sesi tidak valid."},{status:401});}
}