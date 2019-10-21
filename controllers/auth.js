var firebase = require("../firebase");

exports.verifyToken = async (req, res, next) => {
  const idToken = req.header("id-token");
  const verifyObject = await firebase.verifyIdToken(idToken);
  if (verifyObject.isError) {
    return res.status(401).send({
      isAuthenticated: false
    });
  }

  return res.status(200).send({
    isAuthenticated: true
  });
};
