import "server-only";
import {createHmac} from "node:crypto";
import {isIP} from "node:net";
import {prisma} from "@/lib/prisma";

const WINDOW_MINUTES=15;
const IP_MAX_ATTEMPTS=30;
const EMAIL_MAX_ATTEMPTS=10;

type BucketResult={blocked_until:Date|null};

function digest(value:string){
 const secret=process.env.LOGIN_RATE_LIMIT_SECRET??process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!secret)throw new Error("LOGIN_RATE_LIMIT_SECRET is required");
 return createHmac("sha256",secret).update(value).digest("hex");
}

function clientIp(request:Request){
 const forwarded=request.headers.get("x-forwarded-for");
 if(!forwarded)return null;
 // The platform proxy appends the connecting address; use the last hop, not a client-supplied prefix.
 const candidate=forwarded.split(",").map(part=>part.trim()).filter(Boolean).at(-1);
 return candidate&&isIP(candidate)?candidate:null;
}

async function incrementBucket(key:string,maxAttempts:number){
 const rows=await prisma.$queryRaw<BucketResult[]> `
  INSERT INTO public.login_rate_limits (bucket_hash,attempts,window_started_at,blocked_until,updated_at)
  VALUES (${key},1,now(),NULL,now())
  ON CONFLICT (bucket_hash) DO UPDATE SET
   attempts=CASE
    WHEN login_rate_limits.window_started_at <= now()-interval '${WINDOW_MINUTES} minutes' THEN 1
    ELSE login_rate_limits.attempts+1
   END,
   window_started_at=CASE
    WHEN login_rate_limits.window_started_at <= now()-interval '${WINDOW_MINUTES} minutes' THEN now()
    ELSE login_rate_limits.window_started_at
   END,
   blocked_until=CASE
    WHEN login_rate_limits.window_started_at <= now()-interval '${WINDOW_MINUTES} minutes' THEN NULL
    WHEN login_rate_limits.blocked_until > now() THEN login_rate_limits.blocked_until
    WHEN login_rate_limits.attempts+1 > ${maxAttempts} THEN now()+interval '${WINDOW_MINUTES} minutes'
    ELSE NULL
   END,
   updated_at=now()
  RETURNING blocked_until
 `;
 return rows[0]?.blocked_until??null;
}

export async function checkLoginRateLimit(request:Request,email:string){
 const normalizedEmail=email.trim().toLowerCase();
 const ip=clientIp(request);
 const keys=[{key:digest("email:"+normalizedEmail),limit:EMAIL_MAX_ATTEMPTS}];
 if(ip)keys.push({key:digest("ip:"+ip),limit:IP_MAX_ATTEMPTS});
 const blocked=await Promise.all(keys.map(item=>incrementBucket(item.key,item.limit)));
 const until=blocked.filter((value):value is Date=>value instanceof Date).reduce<Date|null>((latest,value)=>!latest||value>latest?value:latest,null);
 // Keep the small limiter table bounded even if clients rotate identifiers.
 await prisma.$executeRaw`DELETE FROM public.login_rate_limits WHERE updated_at < now()-interval '48 hours'`;
 if(!until)return {allowed:true,retryAfterSeconds:0};
 return {allowed:false,retryAfterSeconds:Math.max(1,Math.ceil((until.getTime()-Date.now())/1000))};
}
