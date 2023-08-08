const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobApplicationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  resume: String,
  portfolioLink: String,
  coverLetter: String,
  applicationDate: { type: Date, default: Date.now },
});

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

exports.JobApplication = JobApplication;
