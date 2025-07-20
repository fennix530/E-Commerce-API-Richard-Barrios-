import admin from 'firebase-admin';

let credentialObject;

if (process.env.NODE_ENV !== 'production') {
  // En desarrollo, usá el archivo firebase.json
  const serviceAccount = await import('./firebase.json', {
    assert: { type: 'json' },
  });
  credentialObject = serviceAccount.default;
} else {
  // En producción (Vercel), usá variables de entorno sin transformar la clave
  credentialObject = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY, // SIN .replace() NI .trim()
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  };
}

// Inicialización segura
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(credentialObject),
  });
}

// Exportá Firestore como db
const db = admin.firestore();
export default db;