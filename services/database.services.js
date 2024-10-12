const mongo = require("mongoose");
const companySchema = require("../model/company.model");
const userSchema = require("../model/user.model");
const clientsSchema = require("../model/clients.model");
const url =
  "mongodb+srv://mdsadam:0XAGHc4PmgMdfot9@cluster0.pajeisv.mongodb.net/frontwap";

const schemaList = {
  company: companySchema,
  user: userSchema,
  clients: clientsSchema,
};

mongo.connect(url);

const createRecord = async (data, schema) => {
  const currentSchema = schemaList[schema];
  const collection = new currentSchema(data);
  const resData = await collection.save();
  return resData;
};

const getCompanyByQuery = async (query, schema) => {
  const currentSchema = schemaList[schema];
  const resData = await currentSchema.find(query);
  return resData;
};

const updateByQuery = async (query, schema, data) => {
  const currentSchema = schemaList[schema];
  const resData = await currentSchema.updateOne(query, data);
  return resData;
};

const countData = async (query, schema) => {
  const currentSchema = schemaList[schema];
  const resData = await currentSchema.countDocuments(query);
  return resData;
};

const paginate = async (query, from, to, schema) => {
  const currentSchema = schemaList[schema];
  const resData = await currentSchema.find(query).skip(from).limit(to);
  return resData;
};

const deleteById = async (id, schema) => {
  const currentSchema = schemaList[schema];
  const resData = await currentSchema.findByIdAndDelete(id);
  return resData;
};

const updateById = async (id, data, schema) => {
  const currentSchema = schemaList[schema];
  const resData = await currentSchema.findByIdAndUpdate(id, data, {
    new: true,
  });
  return resData;
};

module.exports = {
  createRecord: createRecord,
  getCompanyByQuery: getCompanyByQuery,
  updateByQuery: updateByQuery,
  countData: countData,
  paginate: paginate,
  deleteById: deleteById,
  updateById: updateById,
};
