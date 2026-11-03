export function buildUpiPaymentUrl({ amount, upiId, upiName }) {
  const normalizedAmount = Number(amount ?? 0);
  const safeAmount = Number.isFinite(normalizedAmount) && normalizedAmount > 0 ? normalizedAmount : 0;

  return `upi://pay?pa=${encodeURIComponent(upiId || 'mrh408520@upi')}&pn=${encodeURIComponent(upiName || 'MRH Studio')}&am=${safeAmount}&cu=INR&tn=${encodeURIComponent('MRH Seat Lock')}`;
}

export function buildPaymentQrUrl({ amount, upiId, upiName }) {
  const upiUrl = buildUpiPaymentUrl({ amount, upiId, upiName });
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=6&data=${encodeURIComponent(upiUrl)}`;
}
