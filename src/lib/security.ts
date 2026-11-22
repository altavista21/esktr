import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
export async function session() {
 const sb=await createSupabaseServerClient(); const {data,error}=await sb.auth.getUser();
 if(error||!data.user) throw new Error("UNAUTHENTICATED");
 const profile=await prisma.userProfile.findUnique({where:{authUserId:data.user.id}});
 if(!profile) throw new Error("PROFILE_MISSING");
 return {user:data.user,profile};
}
export function storageAdmin() {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key) throw new Error("STORAGE_NOT_CONFIGURED");
 return createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
}
export async function audit(actorAuthId:string,action:string,entityType:string,entityId:string,metadata?:Record<string,string|number|boolean|null>) {
 await prisma.auditLog.create({data:{actorAuthId,action,entityType,entityId,metadata:metadata??undefined}});
}
export const BUCKET="esktr-documents";
export const MAX_BYTES=10*1024*1024;
