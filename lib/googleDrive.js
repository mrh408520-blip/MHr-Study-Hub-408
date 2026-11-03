import { google } from 'googleapis';
import { Readable } from 'stream';

export function getDriveCredentials() {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1z77hsjj_H8pF72mbbn9bwiApzXNxnRSS';

  return { clientId, clientSecret, refreshToken, folderId };
}

export async function uploadToGoogleDrive(file, folderId) {
  const { clientId, clientSecret, refreshToken } = getDriveCredentials();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Google Drive credentials are missing. Add GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, and GOOGLE_DRIVE_REFRESH_TOKEN to the environment.'
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const buffer = Buffer.from(await file.arrayBuffer());

  const fileMeta = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    parents: folderId ? [folderId] : undefined,
  };

  try {
    const response = await drive.files.create({
      requestBody: fileMeta,
      media: {
        mimeType: file.type || 'application/octet-stream',
        body: Readable.from(buffer),
      },
      fields: 'id,name,mimeType,size,webViewLink,webContentLink,createdTime',
    });

    return response.data;
  } catch (error) {
    const message = error?.message || 'Unknown Google Drive upload error';
    if (message.toLowerCase().includes('invalid_grant') || message.toLowerCase().includes('refresh token')) {
      throw new Error(
        'Google Drive refresh token is invalid or expired. Re-authorize the Google Drive app and update GOOGLE_DRIVE_REFRESH_TOKEN.'
      );
    }
    throw new Error(`Google Drive upload failed: ${message}`);
  }
}

export function buildUpiPaymentUrl({ amount, upiId, upiName }) {
  const normalizedAmount = Number(amount ?? 0);
  const safeAmount = Number.isFinite(normalizedAmount) && normalizedAmount > 0 ? normalizedAmount : 0;

  return `upi://pay?pa=${encodeURIComponent(upiId || 'mrh408520@upi')}&pn=${encodeURIComponent(upiName || 'MRH Studio')}&am=${safeAmount}&cu=INR&tn=${encodeURIComponent('MRH Seat Lock')}`;
}

export function buildPaymentQrUrl({ amount, upiId, upiName }) {
  const upiUrl = buildUpiPaymentUrl({ amount, upiId, upiName });
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=6&data=${encodeURIComponent(upiUrl)}`;
}
