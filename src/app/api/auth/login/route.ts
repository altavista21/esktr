import {NextResponse} from "next/server";
import {z} from "zod";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {prisma} from "@/lib/prisma";
const schema=z.object({email:z.string().email().max(254),password:z.string().min(8).max(128)});
export async function POST(req:Request){
 const p=schema.safeParse(await req.json().catch(()=>null));
 if(!p.success)return NextResponse.json({error:"Email atau password tidak valid."},{status:400});
 const sb=await createSupabaseServerClient();
 const {data,error}=await sb.auth.signInWithPassword(p.data);
 if(error||!data.user)return NextResponse.json({error:"Email atau password salah."},{status:401});
 try{await prisma.userProfile.upsert({where:{authUserId:data.user.id},create:{authUserId:data.user.id,fullName:typeof data.user.user_metadata?.full_name==="string"?data.user.user_metadata.full_name.slice(0,160):null},update:{}});}
 catch{return NextResponse.json({error:"Login berhasil, tetapi profil aplikasi belum dapat disiapkan. Hubungi administrator."},{status:503});}
 return NextResponse.json({ok:true});
}
