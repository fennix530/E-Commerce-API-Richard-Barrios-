import admin from 'firebase-admin';

// Verifica si ya hay una app inicializada
if (!admin.apps.length) {
  // Si estás en desarrollo, usá el archivo JSON local
  const useLocalCredentials = process.env.NODE_ENV !== 'production';

  const credentials = useLocalCredentials
    ? await import('./firebase.json', { assert: { type: 'json' } }).then(mod => mod.default)
    : {
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
        universe_domain: process.env.UNIVERSE_DOMAIN,
      };

  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}

const db = admin.firestore();
export default db;