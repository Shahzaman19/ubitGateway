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

          console.log("Resume COntent --------------->",data);
        })
          

        const apiKey = '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';
        const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

        const response = await axios.post(
          apiUrl,
          {
            // prompt: `Please review this resume and provide feedback on its weakness and areas for improvement:\n\n${resumeContent}`,
            // prompt: `We would appreciate your feedback on areas where this resume can be improved:\n\n${resumeContent}`,
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

        return res.status(201).json({
          user: newResumeDetails,
        });
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
