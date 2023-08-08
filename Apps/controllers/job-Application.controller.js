const {JobApplication} =  require('../model/job-Application')

// Submit a job application
exports.post = async (req,res,next ) => {

    try {
      const newJobApplication = new JobApplication(req.body);
    
      if (req.file) {
        newJobApplication.resume = req.file.filename;
      }
    
      const savedJobApplication = await newJobApplication.save();
      return res.status(201).json(savedJobApplication);
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






