const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobApplicationSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  resume: String,
  portfolio: String,
  coverLetter: String,
  applicationDate: { type: Date, default: Date.now },
});

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

exports.JobApplication = JobApplication;
