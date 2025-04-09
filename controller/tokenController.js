const TokenService = require("../services/token.services");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const issService = require("../services/iss.services");
const secretKey = process.env.SECRET_KEY;

const getToken = async(req, res) => {
  const data = req.body;
  const expireIn = 172800;

  const FormData = req.body.data;
  const endpoint = req.get("origin");
  const token = await jwt.sign(
    {
      iss: endpoint + "get-token",
      data: FormData,
    },
    secretKey,
    { expiresIn: expireIn }
  );

  res.status(200);
  res.json({
    msg: "success",
    data: {token },
  });
};

module.exports = {
  getToken: getToken,
};
