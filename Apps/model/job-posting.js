const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi =  require('joi')

const jobSchema = new Schema({
  title : {
    type : String,
    required : true,
  },
  location: {
    type : String,
    required : true,
  },
  jobType : {
    type : String,
    enum : ["Internship","Halftime","Fulltime"],
    required : true,
},
company_name : {
  type : String
},
  description: String,
  img : {
    type : String
  },
  postedAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);

const schema = Joi.object({
  title : Joi.string().min(5).max(255),
  location : Joi.string().min(0).max(255),
  jobType : Joi.string().min(0).max(255),
  company_name : Joi.string().min(0).max(255),
  description : Joi.string().min(0).max(1024),
  img : Joi.string().min(0).max(255),
}) 

exports.Job = Job
exports.schema = schema;
