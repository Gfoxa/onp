export function buildWhatsAppUrl(number: string | undefined, message: string): string | null {
  if (!number || !/^\d{8,15}$/.test(number) || !message.trim()) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message.trim())}`;
}
