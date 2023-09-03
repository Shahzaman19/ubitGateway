const {JobApplication} =  require('../model/job-Application')
const {Job} = require('../model/job-posting')
const {User} = require("../model/user")
const {sendEmail} = require('../utils/mailer')

// Submit a job application
exports.post = async (req, res, next) => {
  try {
 

    const { jobId } = req.query; 
    const { user } = req; 


    if (!jobId) {
      return res.status(400).json({ error: 'jobId is required in the query parameters' });
    }
    const job = await Job.findById(jobId);
    const newJobApplication = new JobApplication({
      jobId,
      userId: user.userId,
      ...req.body, 
    });

    if (req.file) {
      newJobApplication.resume = req.file.filename;
    }
    const imageUrl = 'uploads/' + req.file.filename;
    newJobApplication.resume = imageUrl;

    const savedJobApplication = await newJobApplication.save();

    const subject = 'New Job Application';
    const text = `A new job application has been submitted for the job titled: ${job.title}`;
    await sendEmail(job.employerEmail, subject, text, savedJobApplication);

    return res.status(201).json(savedJobApplication);
  } catch (error) {
    return next(error);
  }
};





//GET ALL JOBS
exports.getAllJobs = async(req,res,next) => {
  try {
    const {jobId} = req.query
    const user = await Job.findById(jobId)
    return res.status(200).json(user)
  } catch (error) {
    return next(error)
  }
}

// Count Users Applied for a Job
exports.getJobApplicationCount = async (req, res,next) => {
  try {
    const jobId = req.query.jobId;

    const appliedUsersCount = await JobApplication.countDocuments({ jobId: jobId });
    return res.json({ appliedUsersCount });
  } catch (error) {
    return next(error);
  }
};

exports.getJobApplicants = async (req, res, next) => {
    try {
      const { jobId } = req.query;
  
      if (!jobId) {
        return res.status(400).json({ error: 'jobId is required in the query parameters' });
      }
  
      // Query the JobApplication collection to find applications for the specific job
      const jobApplications = await JobApplication.find({ jobId });
  
      // Extract user IDs from the job applications
      const userIds = jobApplications.map((application) => application.userId);
      console.log("userId ---------->",userIds);
  
      // Find user details based on the user IDs
      const applicants = await User.find({ _id: { $in: userIds } });
      console.log("APplicants--------------->",applicants);
  
      return res.status(200).json(applicants);
  } catch (error) {
    return next(error)
  }
}



