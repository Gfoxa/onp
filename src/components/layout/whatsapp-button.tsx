import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getPublicSettings } from "@/server/cms/public-content";

export async function WhatsAppButton() {
  const settings = await getPublicSettings();
  const href = buildWhatsAppUrl(settings.whatsapp, "Halo, saya ingin mendapatkan informasi mengenai program outdoor.");
  if (!href) return null;

  return <a className="whatsapp-float" href={href} target="_blank" rel="noreferrer" aria-label="Hubungi Ruang Rimba melalui WhatsApp, membuka tab baru">
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.75 11.75 0 0 0 2 17.68L.6 23l5.46-1.43A11.75 11.75 0 1 0 20.5 3.5Zm-8.75 17.1a9.64 9.64 0 0 1-4.9-1.34l-.35-.2-3.24.85.87-3.16-.23-.36a9.66 9.66 0 1 1 7.85 4.21Zm5.3-7.24c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.15-.19.29-.74.93-.91 1.12-.17.2-.34.22-.63.08-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.54c-.2 0-.52.08-.79.37-.27.29-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.2 3.06.15.2 2.08 3.17 5.03 4.44.7.3 1.24.49 1.66.63.7.22 1.34.19 1.84.12.56-.08 1.7-.7 1.94-1.38.24-.68.24-1.27.17-1.39-.08-.12-.27-.2-.56-.34Z" /></svg>
    <span>Chat WhatsApp</span>
  </a>;
}
