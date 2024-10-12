require("dotenv").config();
const jwt = require("jsonwebtoken");
const issService = require("./iss.services");
const secretKey = process.env.SECRET_KEY;

const create = async (request, expiresIn) => {
  const FormData = request.body;
  const endpoint = request.get("origin");
  const api = request.originalUrl;
  const token = await jwt.sign(
    {
      iss: endpoint + api,
      data: FormData,
    },
    secretKey,
    { expiresIn: expiresIn }
  );

  return token;
};

const createSignup = async (data, expiresIn) => {
  // const FormData = {
  //     uid : data.uid,
  //     companyInfo : data.companyInfo
  // };
  const endpoint = data.endpoint;
  const api = data.api;
  const token = await jwt.sign(
    {
      iss: data.iss,
      data: data.body.uid,
      companyInfo: data.body.companyInfo,
    },
    secretKey,
    { expiresIn: expiresIn }
  );

  return token;
};

const createCustom = async (data, expiresIn) => {
  const FormData = data.body;
  const endpoint = data.endpoint;
  const api = data.api;
  const token = await jwt.sign(
    {
      iss: data.iss,
      data: FormData,
    },
    secretKey,
    { expiresIn: expiresIn }
  );

  return token;
};

const verify = (request) => {
  let token = "";
  if (request.method == "GET") {
    if (request.headers["x-auth-token"]) {
      token = request.headers["x-auth-token"];
    } else {
      token = request.cookies.authToken;
    }
  } else {
    token = request.body.token;
  }

  if (token) {
    try {
      const tmp = jwt.verify(token, secretKey);
      if (issService.indexOf(tmp.iss) != -1) {
        return {
          isVerified: true,
          data: tmp.data,
        };
      } else {
        return {
          isVerified: false,
        };
      }
    } catch (error) {
      return {
        isVerified: false,
      };
    }
  } else {
    return {
      isVerified: false,
    };
  }
};

module.exports = {
  createToken: create,
  createCustomToken: createCustom,
  createSignupToken: createSignup,
  verifyToken: verify,
};
