const {body, validationResult} = require('express-validator')
const asyncHandler = require('express-async-handler')
const User = require('../user/model')
const Litigation = require('./model');

exports.createLitigation = [
    body("title")
        .trim()
        .isLength({min:1, max:30})
        .withMessage("title should be between 1-30 words"),
    body("description")
        .isLength({min:1, max:500})
        .withMessage("description should be between 1-500 words"),
    
    asyncHandler(async (req, res, next)=>{
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const userId = req.params.id;
         
        const user = await User.findById(userId);

        if(!user){
           return res.status(404).json({"message" : "user does not exist ! "});
        }

        const litigation = new Litigation({

            userId: req.userId,

            title: req.body.title,

            description: req.body.description
        });

        await litigation.save();
        return res.status(201).json({message:"Litigation creation successful !"});
    })
]