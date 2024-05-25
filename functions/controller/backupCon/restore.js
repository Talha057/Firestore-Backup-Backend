const jwt = require("jsonwebtoken");
const firestore = require("firebase-admin/firestore");
const credential = {
  type: "service_account",
  project_id: "test-project-2f8d2",
  private_key_id: process.env.RESTORE_PRIVATE_KEY_ID,
  private_key: process.env.RESTORE_PRIVATE_KEY,
  client_email: process.env.RESTORE_CLIENT_EMAIL,
  client_id: process.env.RESTORE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.RESTORE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com",
};
const config = {
  credentials: credential,
};
const client = new firestore.v1.FirestoreAdminClient(config);
const databaseName = client.databasePath("test-project-2f8d2", "(default)");

const restoreBackup = (req, res) => {
  jwt.verify(req.token, "loginn", (err, authData) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: "Invalid token" });
    } else {
      const { name } = req.body;
      console.log(name);
      const bucket = `gs://firestoree/${name}`;
      const importPromise = client.importDocuments({
        name: databaseName,
        // This time its inputUriPrefix and not outputUriPrefix
        inputUriPrefix: bucket,
        // Empty array to import all collections
        collectionIds: [],
      });
      importPromise
        .then((response) => {
          console.log(response);
          res.status(200).send({
            message: "Restore Successful",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
};
module.exports = restoreBackup;
