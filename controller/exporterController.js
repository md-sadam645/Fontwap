const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const crypto = require("crypto");
const random = crypto.randomBytes(4).toString("hex");
const tokenService = require("../services/token.services");
const pdf = async (req, res) => {
  const comingData = req.body;
  const fileData = JSON.parse(comingData.data);
  const tokenData = tokenService.verifyToken(req);
  const doc = new PDFDocument({
    margin: 30,
    size: "A4",
  });

  doc.pipe(fs.createWriteStream("public/exports/" + random + ".pdf"));

  const left = (doc.page.width - 60) / 2;

  doc.fontSize(18).text(tokenData.data.companyInfo.c_name, {
    align: "center",
  });

  doc.moveDown(2);

  const table = {
    title: "Clients Records",
    subtitle: "2024-10-12 07:30 PM",
    headers: [
      { label: "Client Name", property: "name", width: 200 },
      { label: "Email", property: "email", width: 150 },
      { label: "Mobile", property: "mobile", width: 100 },
      { label: "Country", property: "country", width: 100 },
    ],
    datas: [],
  };

  for (const data of fileData) {
    table.datas.push({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      country: data.country,
    });
  }

  doc.table(table, {
    width: 500,
    columnSpacing: 10,
    padding: 5,
    align: "center",
  });

  doc.end();

  // Send a success response
  res.status(200).json({
    status: 1,
    msg: "success",
    filename: random + ".pdf",
    token: tokenData,
  });
};

const deletePdf = async (req, res) => {
  const filename = "public/exports/" + req.params.filename;
  fs.unlinkSync(filename);
  res.status(200);
  res.json({ msg: "success" });
};

module.exports = {
  pdf: pdf,
  deletePdf: deletePdf,
};
