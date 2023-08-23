const fs = require('fs');
const axios = require('axios');
const {User} = require('../model/user')

exports.resumeanalyzer = async (req, res, next) => {
  try {
    const id = req.user.userId;
    const user = await User.findById(id);
    const newResumeDetails = {
      resume: null,
    };

    const imageUrl ='uploads/' + req.file.filename;
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        newResumeDetails.resume = imageUrl;

        const myPath = global.appRoot + '/' + imageUrl
        fs.readFile(myPath, 'utf8',(err,data) => {
          if (err) {
            throw new Error({
              error: 'Error reading file',
            });
          }

        })
          

        const apiKey = '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';
        const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

        const response = await axios.post(
          apiUrl,
          {
            prompt : req.body.prompt,
            max_tokens: 1000,
            
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const reviewFeedback = response.data.choices[0].text;
        newResumeDetails.feedback = reviewFeedback;

        user.resumeDetails.push(newResumeDetails);

        await user.save();
        return res.status(201).json(newResumeDetails);
      } else {
        throw new Error({
          error: 'Only PDF files are accepted for the resume',
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};


exports.getResumeFeedback = async(req,res,next) => {
  try {
        const id = req.user.userId;
        const user = await User.findById(id);
        console.log("userID----------->",user);
       const result =  user.resumeDetails.map((item) => {
          return item.feedback
       })
       return res.status(200).json({"feedback" : result})

  } catch (error) {
    return next(error)
  }
}