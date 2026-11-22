import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {session,storageAdmin,BUCKET} from "@/lib/security";
type C={params:Promise<{id:string}>};
export async function GET(_req:Request,ctx:C){
 try{const {profile}=await session();const{id}=await ctx.params;const issued=await prisma.issuedDocument.findUnique({where:{id},include:{application:{include:{institution:{include:{members:true}}}}}});
 if(!issued)return NextResponse.json({error:"Surat tidak ditemukan."},{status:404});
 const member=issued.application.institution.members.some(m=>m.userProfileId===profile.id),staff=["OFFICER","APPROVER","ADMIN"].includes(profile.role);
 if(!member&&!staff)return NextResponse.json({error:"Akses ditolak."},{status:403});
 const {data,error}=await storageAdmin().storage.from(BUCKET).createSignedUrl(issued.storagePath,60,{download:true});
 if(error||!data?.signedUrl)return NextResponse.json({error:"Surat belum tersedia."},{status:502});
 return NextResponse.redirect(data.signedUrl);
 }catch{return NextResponse.json({error:"Sesi tidak valid."},{status:401});}
}