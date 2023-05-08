const mongoose = require("mongoose");

const connection = mongoose.connect(process.env.mongoURL);

mongoose.set("debug", true);
module.exports = { connection };
