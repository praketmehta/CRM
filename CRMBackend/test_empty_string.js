const mongoose = require('mongoose');
const schema = new mongoose.Schema({ name: { type: String, required: true } });
const Model = mongoose.model('TestEmptyString', schema);
const doc = new Model({ name: "" });
const error = doc.validateSync();
console.log(error ? error.message : "Success");
