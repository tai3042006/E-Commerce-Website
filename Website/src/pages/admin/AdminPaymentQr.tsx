import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getToken } from "@/context/AuthContext.hooks";

const endpoint = "/api/admin/payment-qr";
const headers = () => ({ "x-auth-token": getToken() ?? "" });

export default function AdminPaymentQr() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch(endpoint, { headers: headers() }).then(async response => {
      if (!response.ok) throw new Error();
      setUrl((await response.json()).url ?? "");
    }).catch(() => setMessage("Could not load the saved QR image.")).finally(() => setBusy(false));
  }, []);

  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setMessage("Choose an image up to 2 MB."); return; }
    setBusy(true);
    setMessage("");
    const body = new FormData();
    body.append("image", file);
    try {
      const response = await fetch(endpoint, { method: "PUT", headers: headers(), body });
      if (!response.ok) throw new Error();
      setUrl((await response.json()).url);
      setMessage("QR image saved.");
    } catch {
      setMessage("Upload failed. Choose a PNG, JPEG or WebP image and try again.");
    } finally { setBusy(false); }
  }

  return <AdminLayout title="Payment QR">
    <div className="space-y-4">
      {url && <img src={url} alt="Saved store payment QR" className="h-56 w-56 object-contain" />}
      <label className="block text-sm font-medium">Upload store QR image (PNG, JPEG or WebP, up to 2 MB)
        <input type="file" disabled={busy} accept="image/png,image/jpeg,image/webp" className="mt-2 block"
          onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; void upload(file); }} />
      </label>
      <p role="status">{message}</p>
    </div>
  </AdminLayout>;
}
