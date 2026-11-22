import {NextResponse} from "next/server";
import {z} from "zod";
import {createSupabaseServerClient} from "@/lib/supabase/server";
const schema=z.object({email:z.string().email().max(254),password:z.string().min(8).max(128)});
export async function POST(req:Request){const p=schema.safeParse(await req.json().catch(()=>null));if(!p.success)return NextResponse.json({error:"Email atau password tidak valid."},{status:400});const sb=await createSupabaseServerClient();const {error}=await sb.auth.signInWithPassword(p.data);if(error)return NextResponse.json({error:"Email atau password salah."},{status:401});return NextResponse.json({ok:true});}
