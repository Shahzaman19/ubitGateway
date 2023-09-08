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

exports.getAllJobsByEmployer = async (req, res, next) => {
  try {
    const { employerEmail } = req.query;

    const jobs = await Job.find({ employerEmail });
    console.log("------------------->",jobs);
    return res.status(200).json(jobs);
  } catch (error) {
    return next(error);
  }
};


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

//GET USER WHO HAVE APPLIED FOR A JOB
exports.getJobApplicants = async (req, res, next) => {
    try {
      const { jobId } = req.query;
  
      if (!jobId) {
        return res.status(400).json({ error: 'jobId is required in the query parameters' });
      }
  
      const jobApplications = await JobApplication.find({ jobId });
  
      const userIds = jobApplications.map((application) => application.userId);
  
      const applicants = await User.find({ _id: { $in: userIds } });
      console.log("Applicants------->>>",applicants);

      const simplifiedApplicants = applicants.map((applicant) => {
        const jobApplication = jobApplications.find((app) => app.userId.toString() === applicant._id.toString());
        return {
          name: applicant.name,
          email: applicant.email,
          coverLetter: jobApplication ? jobApplication.coverLetter : null,
          // portfolio: applicant.resumeDetails[0].portfolio,
          resume: applicant.resumeDetails[0].resume,
        };
      });
      
      console.log("simplified------->>>",simplifiedApplicants);
      return res.status(200).json(simplifiedApplicants);
  } catch (error) {
    return next(error)
  }
}



//GET JOB DETAILS BASEED ON JOBID
exports.getJobDetails = async (req, res, next) => {
  try {
    const { jobId } = req.query;

    if (!jobId) {
      return res.status(400).json({ error: 'jobId is required in the query parameters' });
    }

    // Find the job details by jobId
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const response = {
      jobId: jobId, 
      jobDetails: job,
    };

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

