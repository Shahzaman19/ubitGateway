const { Job, schema } = require("../model/job-posting");
const {User} = require("../model/user")

//JOB POSTING
exports.jobPost = async (req, res,next) => {
  try {
    const user = await User.findOne({role : 'employer'})
    if(user.role === "employer"){
      console.log("USER ROLE -------------->",user.role);
    }
    else{
       return res.status(400).json({error : "The user should be employer to post the job"})
    }

    const { error } = schema.validate(req.body);
    if (error) return  res.status(400).json(error.details[0].message);

    const newJob = new Job({
      ...req.body,
      employerEmail: user.email, // Add the employer's email to the job document
    });

    let img;
    if (req.file) {
      img = req.file.path;
      newJob.img = img;
    }

    try {
      let savedJob;
      const imageUrl = img;
      savedJob = await newJob;
      savedJob.img = imageUrl;
      await savedJob.save()
      return res.status(201).json({ savedJob});

    } catch (error) {
      res
        .status(500)
        .json({ error: error.message });
    }
  } catch (error) {
    return next(error);
  }
};




//GET ALL JOB POSTS
exports.getJobPosts = async (req, res,next) => {
  try {
    const jobs = await Job.find().sort({ postedAt : -1 });
    return res.status(200).json(jobs);
  } catch (error) {
    return next(error);
  }
};

//GET JOB POST BY ID
exports.getJobPost = async (req, res,next) => {
  try {
    const job = await Job.findById(req.query.id);
    return res.status(200).json(job);
  } catch (error) {
    return next(error);
  }
};

//Delete JOB POSTS BY ID
exports.deleteJobPosts = async (req, res,next) => {
  try {
    const id = req.query.id;

    if (!id) {
      return  res.status(400).json({ error: "Job post ID is required" });
    }

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return  res.status(404).json({ error: "Job post not found" });
    }

    return res.status(200).json({ job, message: "Deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

//Get filtered Jobs
exports.getFilteredJobs = async (req, res,next) => {
  try {
    const jobType = req.query;
    const jobs = await Job.find(jobType).sort({ postedAt: -1 });
    return res.status(200).json(jobs);
  } catch (error) {
    return next(error);
  }
};

