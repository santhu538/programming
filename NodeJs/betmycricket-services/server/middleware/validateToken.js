const { OAuth2Client } = require("google-auth-library");
const config = require("config");
const clientId = config.get("clientId");

const client = new OAuth2Client(clientId);

var validateToken = function verifyToken(req, res, next) {
  let token = req.header("Authorization");
  console.log("token", token);
  client
    .verifyIdToken({
      idToken: token,
      audience: clientId // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    })
    .then(ticket => {
      const payload = ticket.getPayload();
      const userid = payload["sub"];
      console.log("payload", payload);
      console.log("userid ", userid);
      next();
    })
    .catch(err => {
      return res.status(401).json({
        success: false,
        message: "unauthorised access.",
        error: err.message
      });
    });

  // If request specified a G Suite domain:
  //const domain = payload['hd'];
};

module.exports = validateToken;
