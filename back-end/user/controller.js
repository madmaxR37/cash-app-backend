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
       const hashedpin = await bcrypt.hash(req.body.pin, 6);
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

    const user_email = req.body.credentials;
    const user_password = req.body.password;
    const user = await User.findOne({email: user_email});
    if(!user){
      return  res.status(401).json({error: 'authentication failed incorrect email/password'});
    }
    const passwordMatch = await bcrypt.compare(user_password, user.password);
    if(!passwordMatch){
      return  res.status(401).json({error: 'authentication failed incorrect email/password'});
    }

    const userAuth = {userId: user._id, 
        role: user.role};

    const access_token = jwt.sign(userAuth, 'your-secret-key',{expiresIn: 30*60});

    const refresh_token = jwt.sign(userAuth, 'your-secret-key',{expiresIn: '1d'});

    res
    .cookie('refreshToken', refresh_token, {httpOnly:true, sameSite:'strict'})
    .status(200).json({message:'login successful',token:access_token});
});



exports.user_update = asyncHandler(async (req, res, next)=>{
       res.send(`Not Implemented : User :${req.userId}`);
});

exports.user_update_password = asyncHandler(async (req, res, next)=>{
        
        const email = req.body.email;

        const password = req.body.password;

        const user = await User.findOne({email: email});

        if(!user){
     return  res.status(404).json({error: 'user with that email does not exist'});
        }

        user.password = password;

        await User.save(user);

        res.status(200).json({message:"password updated succesfully"});

 });

exports.user_delete = asyncHandler(async (req, res, next)=>{
    res.send("Not yet implemented: Delete User");
});



exports.refresh_token = asyncHandler(async (req, res)=>{
        const refresh_token = req.cookies.refreshToken;
        if(!refresh_token) return res.status(401).json({error:"refresh token not provided"});

try{
        const decoded = jwt.verify(refresh_token,'your-secret-key');
        const access_token = jwt.sign({userId:decoded.userId,role:decoded.role},'your-secret-key', {expiresIn: 60*15});
        res
                .header('Authorization', access_token)
                .json({message:'token refreshed'});
}catch(error){
        return res.status(401).json({message:'invalid refresh token'});
}
});

exports.get_user_by_id = asyncHandler(async (req, res)=>{

        const userId = req.userId;

        const user = await User.findById(userId);

        if(!user){
                return res.status(404).json({message:'user not found'});
        }

        res.status(200).json({user});

});

exports.change_password = asyncHandler(async(req, res)=>{
        
});


exports.get_user_by_email = asyncHandler(async(req, res)=>{

        const email = req.body.email;
        const user = await User.find({email:email});

        if(!user){
                return  res.status(404).json({error: 'user with that email does not exist'});
                   }

                   res.status(200).json(user);
});