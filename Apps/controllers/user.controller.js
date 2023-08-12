const { User, schema } = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { generateOTP } = require("../utils/otp");

//GET USER
exports.get = async (req, res,next) => {
  try {
    const users = await User.find().select("-password");
    return res.json({ users: users });
  } catch (error) {
    return next(error);
  }
};

//GET A SINGLE USER
exports.getSingleUser = async (req, res,next) => {
  try {
    const id = req.user.userId;
    const user = await User.findById(id).select("-password");

    if (user) {
      return res.json({ user: user });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return next (error)
  }
};

//CREATE USER AND GENERATE OTP
exports.create = async (req, res,next) => {
  const { error } = schema.validate(req.body);
  if (error) return  res.status(404).json(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .json({ error: "User already registered with that email" });

  let { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  try {
    const otpCode = await generateOTP(email); 
    req.session.otpCode = otpCode
    req.session.userDetails = {
      name,
      email,
      password,
      role,
    };

    return res.json({ message: "Email sent for OTP verification" });
  } catch (error) {
    return next(error);
  }
};

//LOGIN
exports.login = async (req, res,next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) res.status(403).json({ error: "Email not found" });

    let isPassword = await bcrypt.compare(req.body.password, user.password);

    if (isPassword) {
      const token = await jwt.sign(
        { userId: user._id, userRole: user.role },
        // eslint-disable-next-line no-undef
        process.env.PRIVATE_KEY
      );
      return res.status(200).json({
        token,
        user: _.pick(user, ["_id", "name", "email", "role"]),
        message: "Login Successfully",
      });
    } else {
      return  res.status(400).json({ error: "INVALID PASSWORD" });
    }
  } catch (error) {
    return next(error);
  }
};

//FORGET PASSWORD
exports.forgetPassword = async (req, res,next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return  res.status(403).send({ error: "Email not found" });

    const { email } = req.body;
    const otpCode = await generateOTP(email);

    req.session.otpCode = otpCode;
    req.session.userDetails = { email };
    return res.json({ message: "Email sent for OTP verification" });
  } catch (error) {
   return next(error);
  }
};

//VERIFICATION OTP FOR RESET PASSWORD
exports.verification = async (req, res,next) => {
try {
  const userOtp = req.body.otp;
  const storedOtp = req.session.otpCode;

  if (!userOtp) {
    return res.status(400).send({ error: "OTP is required" });
  } else if (userOtp === storedOtp) {
    req.session.otpCode = null;
    return res.status(200).send({ message: "OTP verification successful" });
  } else {
    return res.status(400).send({ error: "Invalid OTP" });
  }
} catch (error) {
  return next(error)
}
};

//RESET PASSWORD
exports.resetPassword = async (req, res,next) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userDetails = req.session.userDetails;

  if (password !== confirmPassword) {
    return  res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Generate a salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password in the database
    await User.updateOne(
      { email: userDetails.email },
      { password: hashedPassword }
    );
    req.session.userDetails = null;

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return next(error)
  }
};

//VERIFY OTP AND  CREATE STORE USER IN DB
exports.verifyOtp = async (req, res,next) => {
  const userOtp =  req.body.userotp;

  const storedOtp = req.session.otpCode;
  const userDetails = req.session.userDetails;
  console.log('storedOtp------------------------->', storedOtp)
  console.log('userOtp------------------------->', userOtp)

  // console.log('userDetails------------------------->', userDetails)

  if (userOtp === storedOtp) {
    try {
      const user = await User.create(userDetails);

      req.session.otpCode = null;
      req.session.userDetails = null;

      return res.status(200).json({
        user: _.pick(user, ["_id", "name", "email", "role"]),
        message: "Verified Successfully",
      });
    } catch (error) {
      return next(error);
    }
  } else {
    return res.status(400).json({ error: "Invalid OTP" });
  }
};

//UPDATE USER
exports.edit = async (req, res, next) => {
  const id = req.user.userId;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user: user });
  } catch (error) {
    return next(error);
  }
};

//DELETE USER
exports.delete = async (req, res,next) => {
  try {
    const id = req.query.id;
    if (!id) {
      return  res.status(400).json({ error: "User Id is required" });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return  res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    return next(error);
  }
};

//change Status
// exports.changeStatus = async (req, res,next) => {
//   let user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return  res.status(400).json({ error: "Invalid email" });
//   }

//   if (req.body.is_Active) {
//     user.is_Active = true;
//     await user.save();
//   }

//   if (!user.is_Active) {
//     return  res.status(400).json({ message: "User is not active" });
//   }
// };

//POST USER EXPERIENCE
exports.experience = async (req, res,next) => {
  try {
    const id = req.user.userId;
    const { position, company, startDate, endDate } = req.body;

    const user = await User.findById(id);

    const newExperience = {
      company,
      position,
      startDate,
      endDate,
    };

    user.experience.push(newExperience);
    await user.save();

    return res.status(201).json({ message: "User Experience added successfully" });
  } catch (error) {
    return next(error);
  }
};

//UPDATE EXPERIENCE
exports.updateExperience = async (req, res,next) => {
  const id = req.user.userId;
  const { position, company, startDate, endDate } = req.body;

  try {
     await User.findOneAndUpdate(
      { _id: id, "experience.position": { $exists: true } },
      {
        $set: {
          "experience.$.position": position,
          "experience.$.company": company,
          "experience.$.startDate": startDate,
          "experience.$.endDate": endDate,
        },
      },
      { new: true }
    );

    return res.json({message : "Experience updated successfully"});
  } catch (error) {
    return next(error);
  }
};

//POST USER EDUCATION
exports.education = async (req, res,next) => {
  try {
    const id = req.user.userId;
    const { degree, startDate, endDate } = req.body;

    const user = await User.findById(id);

    const newEducation = {
      degree,
      startDate,
      endDate,
    };

    user.education.push(newEducation);

    await user.save();

    return res.status(201).json({ message: "Education added successfully" });
  } catch (error) {
    return next(error);
  }
};

//UPDATE EDUCATION
exports.updateEducation = async (req, res,next) => {
  const id = req.user.userId;
  const { degree, startDate, endDate } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: id, "education.degree": { $exists: true } },
      {
        $set: {
          "education.$.degree": degree,
          "education.$.startDate": startDate,
          "education.$.endDate": endDate,
        },
      },
      { new: true }
    );

    return res.json({message : "Education updated successfully"});
  } catch (error) {
    return next(error);
  }
};

//POST USER PERSONAL DETAILS
exports.personalDetails = async (req, res, next) => {
  try {
    const id = req.user.userId;
    const { name, skill } = req.body;

    const user = await User.findById(id);

    const newPersonalDetails = {
      name,
      skill,
      picture: null,
    };

    if (req.file) {
      if (
        req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/png"
      ) {
        newPersonalDetails.picture = req.file.filename;

        // Generate the URL for the uploaded image
        const imageUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
        newPersonalDetails.picture = imageUrl;
        // console.log("--------------->",newPersonalDetails);
      } else {
        throw new Error("Only JPEG and PNG images are accepted");
      }
    }
    user.personalDetails.push(newPersonalDetails);

    await user.save();

    return res.status(201).json({ user: user, message: "Personal Details added successfully" });
  } catch (error) {
    console.error(error);
    // console.log("---------------------->",error);
    return next(error);
  }
};


//UPDATE PERSONAL DETAILS
exports.updatePersonalDetails = async (req, res,next) => {
  const id = req.user.userId;
  const { name, skill } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: id, "personalDetails.name": { $exists: true } },
      {
        $set: {
          "personalDetails.$.name": name,
          "personalDetails.$.skill": skill,
          "personalDetails.$.picture": req.file ? req.file.filename : null,
        },
      },
      { new: true }
    );

    if (!user) {
      return  res.status(404).json({ error: "User not found" });
    }

    return res.json({message : "User updated successfuly"});
  } catch (error) {
    return next(error);
  }
};

//POST USER RESUME
exports.resumeDetails = async (req, res,next) => {
  try {
    const id = req.user.userId;
    const { portfolio} = req.body;

    // Find the user by userId
    const user = await User.findById(id);

    // Create a new PersonalDetails document
    const newResumeDetails = {
      resume: null,
      portfolio,
    };

    const imageUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
    if (req.file) {
      if (req.file.mimetype === "application/pdf") {
        newResumeDetails.resume = imageUrl;
        
      } else {
        throw new Error({
          error: "Only PDF files are accepted for the resume",
        });
      }
    }

    // Add the new PersonalDetails to the user's personalDetails array
    user.resumeDetails.push(newResumeDetails);

    await user.save();

    return res.status(201).json({ user : newResumeDetails,message: "Resume Details added successfully" });
  } catch (error) {
    return next(error);
  }
};

//UPDATE RESUME DETAILS
exports.updateResumeDetails = async (req, res,next) => {
  const id = req.user.userId;
  const { portfolio } = req.body;

  try {
    if (req.file && req.file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json({ error: "Only PDF files are accepted for the picture" });
    }

    const user = await User.findOneAndUpdate(
      { _id: id, "resumeDetails.portfolio": { $exists: true } },
      {
        $set: {
          "resumeDetails.$.portfolio": portfolio,
          "resumeDetails.$.resume": req.file ? req.file.filename : null,
        },
      },
      { new: true }
    );

    if (!user) {
      return  res.status(404).json({ error: "User not found" });
    }

    return res.json({message : "Resume details updated successfully"});
  } catch (error) {
    return next(error);
  }
};

//USER LIMITED DETAILS
exports.getLimitedUserDetails = async (req, res,next) => {
  try {
    // Fetch the limited user details from the database
    const users = await User.find(
      {},
      "name personalDetails.skill personalDetails.picture"
    );

    return res.status(200).json({ users });
  } catch (error) {
    return next(error);
  }
};
