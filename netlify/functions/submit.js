const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyiXJgoVRx6uwah1OOBZYQK8A3ftK1pZifp00ga1rJ08v2SLM0QTJByBh9a1wYWevrP/exec';

  return new Promise((resolve) => {
    const postData = event.body;
    const url = new URL(SCRIPT_URL);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(postData)
      },
      followAllRedirects: true
    };

    let responseData = '';
    
    const req = https.request(options, (res) => {
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        // Follow redirect if needed
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location);
          const redirOptions = {
            hostname: redirectUrl.hostname,
            path: redirectUrl.pathname + redirectUrl.search,
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
              'Content-Length': Buffer.byteLength(postData)
            }
          };
          let redirData = '';
          const redirReq = https.request(redirOptions, (redirRes) => {
            redirRes.on('data', (c) => { redirData += c; });
            redirRes.on('end', () => {
              resolve({
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: redirData || '{"ok":true}'
              });
            });
          });
          redirReq.on('error', () => resolve({ statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: '{"ok":true}' }));
          redirReq.write(postData);
          redirReq.end();
        } else {
          resolve({
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: responseData || '{"ok":true}'
          });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: '{"ok":true}' });
    });

    req.write(postData);
    req.end();
  });
};
