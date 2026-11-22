"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
export default function Actions({id,status,role}:{id:string;status:string;role:string}){
 const r=useRouter();const[notes,setNotes]=useState("");const[number,setNumber]=useState("");const[file,setFile]=useState<File|null>(null);const[docFile,setDocFile]=useState<File|null>(null);const[docType,setDocType]=useState("");const[busy,setBusy]=useState(false);const[message,setMessage]=useState("");
 const staff=["OFFICER","APPROVER","ADMIN"].includes(role),approver=["APPROVER","ADMIN"].includes(role),applicant=!staff;
 async function act(action:string){
  setBusy(true);setMessage("");
  try{
   const body:Record<string,string>={action};
   if(action==="request_revision"||action==="reject"||action==="approve")body.notes=notes;
   if(action==="issue"){
    if(!file||file.type!=="application/pdf")throw new Error("Pilih PDF surat final.");
    if(!number.trim())throw new Error("Nomor surat wajib diisi.");
    const form=new FormData();form.set("file",file);form.set("documentType","Surat final");
    const up=await fetch(`/api/applications/${id}`,{method:"POST",body:form});const uploaded=await up.json();
    if(!up.ok)throw new Error(uploaded.error||"Upload PDF gagal.");
    body.documentNumber=number;body.storagePath=uploaded.data.storagePath;
   }
   const res=await fetch(`/api/applications/${id}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const data=await res.json();
   if(!res.ok)throw new Error(data.error||"Aksi gagal.");
   setMessage("Perubahan berhasil disimpan.");r.refresh();
  }catch(e){setMessage(e instanceof Error?e.message:"Terjadi kesalahan.");}
  finally{setBusy(false);}
 }
 async function uploadDocument(){
  if(!docFile||!docType.trim())return;
  setBusy(true);setMessage("");
  try{const form=new FormData();form.set("file",docFile);form.set("documentType",docType.trim());const res=await fetch(`/api/applications/${id}`,{method:"POST",body:form});const data=await res.json();if(!res.ok)throw new Error(data.error||"Unggah gagal.");setDocFile(null);setDocType("");setMessage("Dokumen berhasil diunggah.");r.refresh();}
  catch(e){setMessage(e instanceof Error?e.message:"Unggah gagal.");}finally{setBusy(false);}
 }
 if(!staff&&status!=="DRAFT"&&status!=="NEEDS_REVISION")return null;
 return <section className="mt-7 border-t pt-5"><h2 className="font-semibold">Tindakan</h2>
 {applicant&&<div className="mt-3 space-y-3 rounded-lg bg-slate-50 p-4"><p className="text-sm font-medium">Tambah dokumen</p><label className="block text-sm">Jenis dokumen<input value={docType} onChange={e=>setDocType(e.target.value)} maxLength={100} className="mt-1 w-full rounded-lg border bg-white p-3 text-base" placeholder="Contoh: Dokumen pendukung"/></label><input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={e=>setDocFile(e.target.files?.[0]||null)} className="block w-full text-sm"/><button disabled={busy||!docFile||!docType.trim()} onClick={uploadDocument} className="rounded-lg border px-4 py-3 text-sm font-semibold disabled:opacity-50">Unggah dokumen</button></div>}
 {applicant&&(status==="DRAFT"||status==="NEEDS_REVISION")&&<button disabled={busy} onClick={()=>act("submit")} className="mt-3 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">Kirim pengajuan</button>}
 {staff&&status==="SUBMITTED"&&<button disabled={busy} onClick={()=>act("start_review")} className="mt-3 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white">Mulai pemeriksaan</button>}
 {staff&&status==="UNDER_REVIEW"&&role==="OFFICER"&&<div className="mt-4 space-y-3"><textarea value={notes} onChange={e=>setNotes(e.target.value)} maxLength={3000} rows={3} placeholder="Catatan hasil verifikasi" className="w-full rounded-lg border p-3 text-sm"/><button disabled={busy||notes.trim().length<3} onClick={()=>act("verify")} className="rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">Tandai terverifikasi</button></div>}
 {staff&&["SUBMITTED","UNDER_REVIEW"].includes(status)&&role!=="APPROVER"&&<div className="mt-4 space-y-3"><textarea value={notes} onChange={e=>setNotes(e.target.value)} maxLength={3000} rows={3} placeholder="Catatan pemeriksaan/perbaikan" className="w-full rounded-lg border p-3 text-sm"/><button disabled={busy||notes.trim().length<3} onClick={()=>act("request_revision")} className="rounded-lg border px-4 py-3 text-sm font-semibold disabled:opacity-50">Minta perbaikan</button></div>}
 {approver&&status==="UNDER_REVIEW"&&<div className="mt-4 space-y-3"><textarea value={notes} onChange={e=>setNotes(e.target.value)} maxLength={3000} rows={3} placeholder="Catatan keputusan (wajib jika menolak)" className="w-full rounded-lg border p-3 text-sm"/><div className="flex flex-wrap gap-2"><button disabled={busy} onClick={()=>act("approve")} className="rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white">Setujui</button><button disabled={busy||notes.trim().length<3} onClick={()=>act("reject")} className="rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-700 disabled:opacity-50">Tolak</button></div></div>}
 {approver&&status==="APPROVED"&&<div className="mt-4 space-y-3"><label className="block text-sm font-medium">Nomor surat<input value={number} onChange={e=>setNumber(e.target.value)} maxLength={120} className="mt-2 w-full rounded-lg border p-3 text-base"/></label><label className="block text-sm font-medium">PDF surat final<input type="file" accept="application/pdf,.pdf" onChange={e=>setFile(e.target.files?.[0]||null)} className="mt-2 block w-full text-sm"/></label><button disabled={busy||!file||!number.trim()} onClick={()=>act("issue")} className="rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">Terbitkan surat</button></div>}
 {message&&<p role="status" className="mt-3 text-sm text-slate-700">{message}</p>}</section>
}
