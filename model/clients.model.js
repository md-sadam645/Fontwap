const mongo = require("mongoose");
const { Schema } = mongo;

const clientSchema = new Schema({
  companyId: String,
  name: String,
  mobile: Number,
  country: String,
  email: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

clientSchema.pre("save", async function (next) {
  const query = {
    companyId: this.companyId,
    email: this.email,
  };
  let length = await mongo.model("Client").countDocuments(query);
  if (length == 0) {
    next();
  } else {
    next("Duplicate Client Email" + length);
  }
});

module.exports = mongo.model("Client", clientSchema);
