const jwt = require("jsonwebtoken");
const firestore = require("firebase-admin/firestore");

const { Storage } = require("@google-cloud/storage");
// Destination bucket
const bucket = "gs://firestoree";
console.log();

const credential = {
  type: "service_account",
  project_id: "vapta-v2",
  private_key_id: process.env.BACKUP_PRIVATE_KEY_ID,
  private_key: process.env.BACKUP_PRIVATE_KEY,
  client_email: process.env.BACKUP_CLIENT_EMAIL,
  client_id: process.env.BACKUP_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.BACKUP_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com",
};

const config = {
  credentials: credential,
};
const client = new firestore.v1.FirestoreAdminClient(config);
const databaseName = client.databasePath("vapta-v2", "(default)");

const exportBackup = async () => {
  // Export call!
  try {
    const exportPromise = client.exportDocuments({
      name: databaseName,
      outputUriPrefix: bucket,
      // Leave collectionIds empty to export all collections
      // or set a list of collection IDs to export
      collectionIds: [],
    });
    let response = await exportPromise;
    return response;
  } catch (error) {
    console.log(error);
  }
};
const backupdb = async (req, res) => {
  let response = await exportBackup();
  console.log("Backup response", response);
  if (response) {
    res.status(200).send({
      message: "data backup",
    });
  } else {
    res.status(401).send({
      message: "backup failed",
    });
  }
};

const getFiles = async (req, res) => {
  const bucketName = "firestoree";
  jwt.verify(req.token, "loginn", async (err, authData) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: "Invalid token" });
    } else {
      try {
        const storage = new Storage({
          projectId: "vapta-v2",
          credentials: credential,
        });
        const [files] = await storage.bucket(bucketName).getFiles();
        const folderNames = new Set();

        files.forEach((file) => {
          const parts = file.name.split("/");
          if (parts.length > 1) {
            folderNames.add(parts[0]); // Assuming the first part is the folder name
          }
        });

        const fileNames = Array.from(folderNames);

        const fileArray = [];

        for (let file of fileNames) {
          const obj = {};
          try {
            let [url] = await storage
              .bucket(bucketName)
              .file(file)
              .getSignedUrl({
                action: "read",
                expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // URL expires in 15 minutes
              });
            const ind = url.indexOf("?");
            url = url.slice(0, ind);
            obj.fileUrl = url;
            obj.fileUrlPart = file;
            const index = file.indexOf("_");
            let elem = file.slice(0, index);
            elem = elem.slice(0, 19).replace("T", "_");
            obj.fileName = elem;
            fileArray.push(obj);
          } catch (error) {
            res.status(500).json({ error: "Failed to generate download URL" });
          }
        }
        res.send({
          files: fileArray,
        });
      } catch (err) {
        console.log("errorrrrrrrrrrrrrr", err);
      }
    }
  });
};

module.exports = { backupdb, getFiles, exportBackup };
