const jwt = require("jsonwebtoken");
const firestore = require("firebase-admin/firestore");
const config = {
  // keyFilename: "./restore_database.json",
  credentials: require("../../config/restore_database.json"),
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
