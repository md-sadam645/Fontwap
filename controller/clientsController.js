const tokenService = require("../services/token.services");
const dbService = require("../services/database.services");

const create = async (request, response) => {
  const tokenData = tokenService.verifyToken(request);
  if (tokenData.isVerified) {
    const data = request.body;
    data["companyId"] =
      tokenData.data.uid !== undefined ? tokenData.data.uid : tokenData.data;
    try {
      const dbRes = await dbService.createRecord(data, "clients");
      response.status(200);
      response.json({
        msg: "Record Created",
        data: dbRes,
      });
    } catch (error) {
      response.status(400);
      response.json({
        msg: "Record not Created",
        error: error,
        data: data,
      });
    }
  } else {
    response.status(401);
    response.json({
      msg: "Permission Denied",
    });
  }
};

const clientCount = async (request, response) => {
  const tokenData = tokenService.verifyToken(request);
  if (tokenData.isVerified) {
    const query = {
      companyId: tokenData.data.uid,
    };
    const dataRes = await dbService.countData(query, "clients");
    response.status(200);
    response.json({
      data: dataRes,
    });
  } else {
    response.status(401);
    response.json({
      msg: "Permission Denied",
    });
  }
};

const paginate = async (request, response) => {
  const tokenData = tokenService.verifyToken(request);
  if (tokenData.isVerified) {
    const query = { companyId: tokenData.data.uid };
    let from = Number(request.params.from);
    let to = Number(request.params.to);
    const dataRes = await dbService.paginate(query, from, to, "clients");
    response.status(200);
    response.json({ data: dataRes });
  } else {
    response.status(401);
    response.json({
      msg: "Permission Denied",
    });
  }
};

const deleteClient = async (request, response) => {
  const tokenData = tokenService.verifyToken(request);
  if (tokenData.isVerified) {
    let id = request.params.id;
    const dataRes = await dbService.deleteById(id, "clients");
    response.status(200);
    response.json({ data: dataRes });
  } else {
    response.status(401);
    response.json({
      msg: "Permission Denied",
    });
  }
};

const updateClient = async (request, response) => {
  const tokenData = tokenService.verifyToken(request);
  if (tokenData.isVerified) {
    let id = request.params.id;
    let data = request.body;
    const dataRes = await dbService.updateById(id, data, "clients");
    response.status(200);
    response.json({ data: dataRes });
  } else {
    response.status(401);
    response.json({
      msg: "Permission Denied",
    });
  }
};

module.exports = {
  create: create,
  clientCount: clientCount,
  paginate: paginate,
  delete: deleteClient,
  update: updateClient,
};
