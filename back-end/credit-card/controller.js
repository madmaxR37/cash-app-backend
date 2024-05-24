const creditCardvalidator = require('card-validator');
const CreditCard = require('./model');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const User = require('../user/model');
const MaskData = require('maskdata');

exports.add_creditcard = [
    body('name')
            .isLength({min:1, max:255})
            .withMessage('length must be atleast character and less than 255 characters'),
    body('number')
            .trim()
            .isLength({min:4, max:19})
            .withMessage('credit card number should be greater than 4 digits'),
    body('expdate')
            .trim()
            .isLength(5)
            .withMessage('creditcard date should be in the form mm/yy'),
    body('cvv')
            .trim()
            .isLength({min:3, max:4})
            .withMessage('cvv or cvc should be atleast 3 digits'),

    asyncHandler (async (req, res, next)=>{

        const maskOptionsNumber = {
                maskWith:'*',

                unmaskedStartDigits:4,

                unmaskedEndDigits: 1

        };

        const maskOptionsCvv ={

                maskWith:'*',

                unmaskedStartDigits:1,
        };
        const maskOptionsExpDate = {
                maskWith:'*',
                unmaskedStartDigits:1,

                unmaskedEndDigits: 1

        };

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const user = await User.findById(req.params.id);

        if(!user){
                return res.status(404).json({message:"User not found"});
        }

        const creditCardNumberValidation = creditCardvalidator.number(req.body.number);
        if(!creditCardNumberValidation.isValid){
                return res.status(400).json({message:"Invalid CreditCard"});
        }
                 const creditCardDatevalidation = creditCardvalidator.expirationDate(req.body.expdate);
        if(!creditCardDatevalidation.isValid){
                return res.status(400).json({message:"CreditCard expired"});
        }

                const cvvValidation = creditCardvalidator.cvv(req.body.cvv);
         if(!cvvValidation.isValid){
                        return res.status(400).json({message:"invalid cvv"});
                
        }

        const maskedCreditCardNumber = MaskData.maskCard(req.body.number, maskOptionsNumber);
        const maskedCvv = MaskData.maskCard(req.body.cvv, maskOptionsCvv);
        const maskedDate = MaskData.maskCard(req.body.expdate,maskOptionsExpDate);

        const creditcard = new CreditCard({
                name:req.body.name,
                brand:creditCardNumberValidation.card.type,
                number:maskedCreditCardNumber,
                expDate:maskedDate,
                cvv:maskedCvv,
                userId:req.params.id
        });
        await creditcard.save();

        user.creditCards.push(creditcard._id);
        
        await user.save();

        return res.status(201).json({message: "Credit card created successfully !"})

    })

];

exports.get_creditcards = asyncHandler (async (req, res, next)=>{
        const user = await User.findById(req.params.id).populate('creditCards');
        res.status(200).json(user.creditCards);
});
