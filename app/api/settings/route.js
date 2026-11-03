import { getDb } from '@/lib/mongodb';
import { SITE } from '@/lib/siteData';

function normalizePaymentQrUrl(paymentQrUrl) {
  if (typeof paymentQrUrl !== 'string') return '';
  const trimmed = paymentQrUrl.trim();
  if (!trimmed) return '';

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    return '';
  }

  return '';
}

async function ensureDefaultSettings(db) {
  const collection = db.collection('settings');
  const fallbackPrice = Number(SITE.seatLockFee ?? 20);

  let settings = await collection.findOne({ name: 'registration_payment' });

  if (!settings) {
    settings = {
      name: 'registration_payment',
      registrationPrice: fallbackPrice,
      paymentQrUrl: '',
      status: 'active',
      updatedAt: new Date(),
      lastUpdatedAt: new Date(),
    };

    await collection.insertOne(settings);
  }

  const normalizedPrice = Number(settings.registrationPrice ?? fallbackPrice);
  const normalizedQrUrl = normalizePaymentQrUrl(settings.paymentQrUrl);

  if (settings.paymentQrUrl !== normalizedQrUrl || Number(settings.registrationPrice ?? fallbackPrice) !== normalizedPrice) {
    await collection.updateOne(
      { name: 'registration_payment' },
      { $set: { registrationPrice: normalizedPrice, paymentQrUrl: normalizedQrUrl, updatedAt: new Date(), lastUpdatedAt: new Date(), status: settings.status || 'active' } },
      { upsert: true }
    );
    settings = await collection.findOne({ name: 'registration_payment' });
  }

  return settings;
}

export async function GET() {
  try {
    const db = await getDb();
    const settings = await ensureDefaultSettings(db);
    const registrationPrice = Number(settings.registrationPrice ?? SITE.seatLockFee ?? 20);
    const paymentQrUrl = normalizePaymentQrUrl(settings.paymentQrUrl);

    return Response.json(
      {
        registrationPrice,
        paymentQrUrl,
        status: settings.status || 'active',
        updatedAt: settings.updatedAt || settings.lastUpdatedAt || new Date().toISOString(),
        lastUpdatedAt: settings.lastUpdatedAt || settings.updatedAt || new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('Settings fetch error:', error);
    return Response.json(
      {
        registrationPrice: Number(SITE.seatLockFee ?? 20),
        paymentQrUrl: '',
        status: 'active',
        updatedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  }
}
