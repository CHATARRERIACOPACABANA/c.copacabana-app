const { google } = require('googleapis');

const SPREADSHEET_ID = '1XHuSE9XuK-lOJ7AWIxvHa3MLj0f-4xliHDXxHACMb78';
const FOLDER_COPACABANA = '1K_tvmOqIQCHaPf8uwUNU57IRy6Jf8JNr';
const FOLDER_ECOL = '1iuHoFmGYEdweiEcoQ4zdfTyiGo1NF987';

const SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "copacabana-app",
  "private_key_id": "369d92a7aceae4dcbaa2c77034a9596d3965f75a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCnD/9YLBRmuTjn\n0lt0iip5m2OkxCJJXPoDK0bFiCoRZsEau8/a7tZq0kZgACWBaP0V1flRe111GgMR\nKR0AdJMqjVRA9Py5THbVrAh+lWzyzQXm+zSeijWsilVbC3Tpg74d0cxRBRTYXEiN\nWruGsEMbR3OL1yY6PnUgTtdYK7UReKu43PlnVLDLIeesuqoI21Ar8VA70cckE6B4\n2SisNto8C338v1WCepmifWmecrVbpfPI/ArxNeBVhskSxOtZESuzIZzqM49QLQoV\nP1uL/pZDzjDKDb1R4GLcyQTXuZHnkKHW/Phim1pLUZeAcID03TSZNphpZK912YnJ\na4LBOQv7AgMBAAECggEABkBygUWxA8EVsJMuKffLrB5VBcLzN4SbtIenj9fPHzSV\nsF7r4dkDPB8fVBNdU/DuW6VUvahcsHenOrqro6s5IKQGTaH9XR/P6KIV9Uq5N4LV\noDWxW+d3J7xLgms01lJASJRjzXpfs9MMQgHtt5YcBMbRO5/zBcX1kx5wL5P/JCas\n3Ufm17wNl4F9Odj+J5Qn51yuoZh4aOVIDuGH3Ht/xF/7fTMKYTKnByMyJiqhIsr1\nY7C+5thG+9WFVPNBPc3CfkEEXtMAZrdCT3A+KmAsu5GlBupJHPV0YVl/jdknmuy6\nktC9kD/QN8x/ce8gdTPIfTD12KFFCP5i1/yUGoTJyQKBgQDenJ6jGq4PJUAGMkKp\nflvpOpQrveP1WmOXghJwtciJZKcI7a4afaRvsuWaW4Z7oYew6PvTrRIMcathEo8U\nB9f713IWEg5HXUoZCLT2XzISASP+75oMz2I6Q+dUD1NW87D17amGBSERW3MNW0WL\nxyMg1XY5QKH6qRpGWrV/UVSVCQKBgQDAHoMc39ea9heqiaI5lDmfrFuGepP/QsCV\np9pr+GBoIcqppii1YibhdrGdVBCSTepCY8VIKrQ1KeXTx5LGPpdB6j79EzAPqdqJ\nOB113SvOqQaDAU1TX9Sa0BzwKNPjyMffUMoJ7kUoQNkjcGuvyBWnUCb6AJz0V3sQ\n3z6Jjzf94wKBgFmH+C11L4gb3TIgyLrOfTzCOJGXH7WwEtn+kFgQZIUNnDh1D07M\nNXRPKRT5to7GmoJGUfICa33hwaGbCzxtIyrArbu+q0t8c66517427zZaixWfW//G\n8KSqZsFiIIyaGhPu7/1c1r3aX92BVekvwCsWbyP7oKnllRGyrch092WxAoGANTY+\nSnkVVq5iz7FfZWNQspEiqJS6+TCb9teO/+jDixQQ9fw3ukV9T2V4vILUNDGweML5\nmYt6bl80cPwOAyrC6lbfK2ltHmmFRgxs3IBt6ceXLiHmMPmSAW8zFLG6PpUWBxxx\nWV7NeOC9Q7uXmBBrLvRcV1JkJqk0RPAQejlY4NECgYAeoVao5e5W/YD8eXmjrtxb\nj3n93rKNM7Q1gpQWVKOn9mzgZI78nTTw47pNkOUVXKl5gyJwjMikn18fMPr+ga2q\nsXubxt0aCFKEa+ohUO0gI5CkOOyctW8hRhQBLSRX6ZRKBgOBgJFYg4lo6hgJIkJO\nim2jRX7H7/dGLfvhGx1ZqQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "copacabana-app@copacabana-app.iam.gserviceaccount.com",
  "client_id": "112264735345297021412",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
};

async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive'
    ]
  });
  return auth.getClient();
}

async function uploadFileToDrive(auth, b64, mime, nombre, folderId) {
  if (!b64 || b64.length < 10) return '';
  try {
    const drive = google.drive({ version: 'v3', auth });
    const buffer = Buffer.from(b64, 'base64');
    const { Readable } = require('stream');
    const stream = Readable.from(buffer);
    const res = await drive.files.create({
      requestBody: { name: nombre, parents: [folderId] },
      media: { mimeType: mime || 'image/jpeg', body: stream },
      fields: 'id,webViewLink'
    });
    await drive.permissions.create({
      fileId: res.data.id,
      requestBody: { role: 'reader', type: 'anyone' }
    });
    return res.data.webViewLink || '';
  } catch (e) {
    console.error('Drive upload error:', e.message);
    return 'Error: ' + e.message;
  }
}

async function getFolderForCliente(auth, empresa, cliente) {
  const drive = google.drive({ version: 'v3', auth });
  const rootId = empresa === 'CHATARRERÍA COPACABANA' ? FOLDER_COPACABANA : FOLDER_ECOL;
  try {
    const res = await drive.files.list({
      q: `name='${cliente}' and '${rootId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id,name)'
    });
    if (res.data.files && res.data.files.length > 0) return res.data.files[0].id;
    const folder = await drive.files.create({
      requestBody: { name: cliente, mimeType: 'application/vnd.google-apps.folder', parents: [rootId] },
      fields: 'id'
    });
    return folder.data.id;
  } catch (e) {
    return rootId;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const datos = req.body;
    const auth = await getAuth();

    const now = new Date();
    const fecha = now.toLocaleDateString('es-CO', { timeZone: 'America/Bogota', day: '2-digit', month: '2-digit', year: 'numeric' });
    const hora = now.toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' });

    const empresa = (datos.empresa || '').trim();
    const cliente = (datos.cliente || '').trim();
    const esClienteNuevo = datos.clienteEsNuevo || false;

    const folderId = await getFolderForCliente(auth, empresa, cliente);
    const nombreBase = fecha.replace(/\//g, '-') + ' - ' + datos.conductor + ' - ' + cliente;

    const fotoTiqueteUrl = await uploadFileToDrive(auth, datos.fotoBase64, datos.fotoMime, nombreBase + ' - TIQUETE.jpg', folderId);
    const fotoNovedadUrl = await uploadFileToDrive(auth, datos.fotoNovedadBase64, datos.fotoNovedadMime, nombreBase + ' - NOVEDAD.jpg', folderId);

    const sheets = google.sheets({ version: 'v4', auth });

    const headerCheck = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'ENTREGAS!A1:O1'
    });

    if (!headerCheck.data.values || !headerCheck.data.values[0] || headerCheck.data.values[0][0] !== 'FECHA') {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'ENTREGAS!A1:O1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [['FECHA','HORA','CONDUCTOR','EMPRESA','CLIENTE','MATERIAL','PESO TOTAL (KG)','FOTO TIQUETE','FOTO NOVEDAD','UBICACIÓN','OBSERVACIONES','NOVEDAD - QUÉ PASÓ','NOVEDAD - DÓNDE','ESTADO','NÚMERO FACTURA']]
        }
      });
    }

    const materiales = datos.materiales || [];
    const totales = {};
    materiales.forEach(mat => {
      const p = parseFloat(mat.peso) || 0;
      totales[mat.nombre] = (totales[mat.nombre] || 0) + p;
    });

    if (datos.manualTexto && datos.manualTexto.trim()) {
      totales['[MANUAL] ' + datos.manualTexto.trim()] = 0;
    }

    const rows = [];
    let first = true;
    Object.keys(totales).forEach(matNombre => {
      rows.push([
        fecha, hora, datos.conductor, empresa, cliente,
        matNombre, totales[matNombre] || '',
        first ? fotoTiqueteUrl : '',
        first ? fotoNovedadUrl : '',
        first ? (datos.ubicacion || '') : '',
        first ? (datos.obs || '') : '',
        first ? (datos.novedadQue || '') : '',
        first ? (datos.novedadDonde || '') : '',
        'PENDIENTE', ''
      ]);
      first = false;
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'ENTREGAS!A:O',
      valueInputOption: 'RAW',
      requestBody: { values: rows }
    });

    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'ENTREGAS!A:A'
    });
    const lastRow = sheetData.data.values ? sheetData.data.values.length : 2;
    const startRow = lastRow - rows.length + 1;

    const requests = [];
    rows.forEach((_, i) => {
      const rowIdx = startRow + i - 1;
      requests.push({
        repeatCell: {
          range: { sheetId: 0, startRowIndex: rowIdx, endRowIndex: rowIdx + 1, startColumnIndex: 13, endColumnIndex: 14 },
          cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 0.8, blue: 0.8 }, textFormat: { bold: true, foregroundColor: { red: 0.78, green: 0.16, blue: 0.16 } } } },
          fields: 'userEnteredFormat(backgroundColor,textFormat)'
        }
      });
      if (esClienteNuevo) {
        requests.push({
          repeatCell: {
            range: { sheetId: 0, startRowIndex: rowIdx, endRowIndex: rowIdx + 1, startColumnIndex: 0, endColumnIndex: 6 },
            cell: { userEnteredFormat: { backgroundColor: { red: 1, green: 0.976, blue: 0.769 } } },
            fields: 'userEnteredFormat(backgroundColor)'
          }
        });
      }
    });

    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { requests }
      });
    }

    const conteo = {};
    materiales.forEach(mat => { conteo[mat.nombre] = (conteo[mat.nombre] || 0) + 1; });
    const detalleRows = materiales.filter(mat => conteo[mat.nombre] > 1).map(mat => [fecha, hora, datos.conductor, empresa, cliente, mat.nombre, mat.peso]);

    if (detalleRows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'DETALLE PESOS!A:G',
        valueInputOption: 'RAW',
        requestBody: { values: detalleRows }
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(200).json({ ok: false, error: error.message });
  }
};
