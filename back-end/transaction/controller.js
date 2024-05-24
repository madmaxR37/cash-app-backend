const User = require("../user/model");
const Transaction = require('./model');
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require('express-validator');
const bcrypt = require("bcryptjs");
const Notification = require('../notification/model');

exports.create_transaction = [
         body('receiver')
            .trim()
            .isLength({min:9})
            .withMessage("identifier must be valid"),
        body('amount')
            .isFloat({min:100})
            .withMessage('amount should be more than 100'),
        asyncHandler(async (req, res, next)=>{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()});
            } 
            const sender_id = req.params.id;
            const receiver_param = req.body.receiver;  
            const sender = await User.findById(sender_id);
            if(!sender){
                return res.status(404).json({"message": "sender not found"});
            }
            const transaction_amount = req.body.amount;
            const senderWalletBalance = sender.wallet.account_balance;

            if(senderWalletBalance < transaction_amount){
                     return res.status(400).json({"message":"Transaction failed, balance insufficient"});
            }
           
            const receiver = await User.findOne({
                $or:[
                    {email:receiver_param},
                    {phone_number:receiver_param}
                ]
            })

            if(!receiver){
                return res.status(404).json({"message": "user not found"});
            }
            

            const receiver_id = receiver._id;
           
           const transaction = new Transaction({
            senders_id : sender_id,
            receivers_id: receiver_id,
            amount : transaction_amount 
           });

           await transaction.save(); 
            res.status(201).json({
             "receiver" : receiver.first_name + ' ' + receiver.last_name,
             "amount": transaction_amount,
             "transaction_id":transaction._id
           });
        })
];

exports.confirm_transaction = [
    body('pin')
        .trim()
        .isLength(6)
        .withMessage("Pin must be six digits"),
        asyncHandler(async (req, res, next)=>{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()});
            } 

    const pin = req.body.pin;

    const transaction_id= req.params.id;

    const transaction = await Transaction.findById(transaction_id);


    if(!transaction){
        return res.status(404).json({"message":"transaction not found!"});
    }

    const sender = await User.findById(transaction.senders_id);
    const receiver = await User.findById(transaction.receivers_id);
    const amount =  transaction.amount;

    const pinMatch = await bcrypt.compare(pin, sender.pin);

    if(!pinMatch){
        return res.status(400).json({"message": "invalid pin"})
    }
    
    sender.wallet.account_balance -= amount;
    receiver.wallet.account_balance += amount;
    transaction.status= true;
    
    const senderNotification = new Notification({
        userId:transaction.senders_id,
        title:'Transaction confirmation',
        description:`You have sent ${amount}${sender.wallet.currency} to ${receiver.first_name}, on the ${transaction.created}.
        TransactionID:${transaction._id}`,
    });

    const receiverNotification = new Notification({
        userId:transaction.receivers_id,
        title:'Transaction reception',
        description:`You have sent ${amount}${sender.wallet.currency} to ${receiver.first_name}, on ${transaction.created}.
        TransactionID:${transaction._id}`,
    });

    await sender.save();
    await receiver.save();
    await transaction.save();
    await senderNotification.save();
    await receiverNotification.save();

    res.status(200).json({"message": "transaction successfull!"});
    })
];