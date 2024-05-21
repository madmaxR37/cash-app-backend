const { json } = require("express");
const User = require("./model");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.user_create = [
    body("first_name")
           .trim()
           .isLength({min:1})
           .escape()
           .withMessage("firstname must be specified"),
    body("last_name")
            .trim()
            .isLength({min:1})
            .escape()
            .withMessage("lastname must be specified"),
    body("date_of_birth", "Invalid date of birth")
            .optional({values:"falsy"})
            .isISO8601()
            .toDate(),
    body("address.city")
            .isLength({min:1})
            .withMessage("city must be specified")
            ,
    body("address.quarter")
            .isLength({min:1})
            .withMessage("quarter must be specified")
            ,
    body("address.country")
            .isLength({min:1})
            .withMessage("country must be specified")
            ,
    body("email")
            .isLength({min:1})
            .withMessage("email must be specified")
            .isEmail()
            .normalizeEmail()
            .withMessage("must be a valide email address"),
    body("phone_number")
            .isLength({min:1})
            .withMessage("phone number must be specified"),
    body("password")
            .isLength({min:7})
            .withMessage("password should be more than 7 chacters"),

    body("pin")
            .trim()
            .isLength(6)
            .withMessage("pin length should be six digits"),

    asyncHandler(async (req, res,next)=>{
       const errors = validationResult(req);

       const hashedpassword = await bcrypt.hash(req.body.password,11);
       const hashedpin = await bcrypt.hash(req.body.pin, 6)
       const walletName = await nameWallet();
       const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        date_of_birth: req.body.date_of_birth,
        address:{
            city: req.body.city,
            quarter:req.body.quarter,
            country:req.body.country,
            },
        email:req.body.email,
        wallet:{
                name: walletName
        },
        phone_number:req.body.phone_number,
        password:hashedpassword,
        pin:hashedpin
       });
 
       async function nameWallet(){
        let rand = parseInt(Math.random()*100000);
        return req.body.first_name + '#wallet#' + rand;
       }

       if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
        return;
       }else{
        await user.save();
        res.status(201).json({message:"user created successfully!"});
       }

    })
];

exports.user_login = asyncHandler(async (req, res, next)=>{

    const user_email = req.body.email;
    const user_password = req.body.password;
    const user = await User.findOne({email: user_email});
    if(!user){
        res.status(401).json({error: 'authentication failed'})
    }
    const passwordMatch = await bcrypt.compare(user_password, user.password);
    if(!passwordMatch){
        res.status(401).json({error: 'authentication failed'})
    }
    const token = jwt.sign({userId: user._id, 
        role: user.role, 
        profile: user.profile,
         userName:user.first_name,
         wallet:user.wallet}, 'your-secret-key',{expiresIn: 60*10});
    res.status(200).json({token});
});

exports.user_update = asyncHandler(async (req, res, next)=>{
       res.send(`Not Implemented : User :${req.params.id}`);
});

exports.user_delete = asyncHandler(async (req, res, next)=>{
    res.send("Not yet implemented: Delete User");
});