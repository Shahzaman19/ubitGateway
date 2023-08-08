const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const userExperienceSchema = new Schema({
  position: String,
  company: String,
  startDate: Date,
  endDate: Date,
});

const educationSchema = new Schema({
  degree: String,
  startDate: Date,
  endDate: Date,
});

const personalDetailsSchema = new Schema({
  name: String,
  skill: String,
  picture: String,
});

const resumeSchema = new Schema({
  resume: String,
  portfolio: String,
});

const userSchema = new Schema({
  googleId : {
    type: String,
  },
  name: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  email: {
    type: String,
    minlength: 8,
    maxlength: 255,
  },
  password: {
    type: String,
  },
  confirmPassword: {
    type: String,
  },
  role: {
    type: String,
    enum: ["student", "employer", "admin"],
    default: "student",
  },
  experience: [userExperienceSchema], 
  education: [educationSchema], 
  personalDetails: [personalDetailsSchema], 
  resumeDetails: [resumeSchema], 
});

const User = mongoose.model("Users", userSchema, "Users");


const schema = Joi.object({
    googleId : Joi.string().min(0).max(255),
    name : Joi.string().min(5).max(255),
    email : Joi.string().min(8).max(255).email(),
    password : Joi.string().min(5).max(255),
    confirmPassword : Joi.string().min(5).max(255),
    role : Joi.string().min(4).max(255),
    experience : Joi.string().min(0).max(255),
    education : Joi.string().min(0).max(255),
    personalDetails : Joi.string().min(0).max(255),
    resumeDetails : Joi.string().min(0).max(255),
    

})

exports.User = User;
exports.schema = schema;
