const User = require("../user/model");
const Transaction = require('./model');
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require('express-validator');
const bcrypt = require("bcryptjs");
const Notification = require('../notification/model');
const Flutterwave = require('flutterwave-node-v3');
                    require('dotenv').config();

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
            const sender_id = req.userId;
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

exports.mobile_charge = [

    body('phone')
        .trim(),
    body('amount'),
    asyncHandler(async (req, res)=>{

        const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()});
            } 

        const flw_secrete_key = process.env.FLW_SECRET_KEY;

        const flw_public_key = process.env.FLW_PUBLIC_KEY;

        const flw = new Flutterwave(flw_public_key, flw_secrete_key);

        const payload = {
            phone_number: req.phone,

            amount: req.amount,

            currency: 'XAF',

            email:'',

            tx_ref: this.generateTransactionReference(),

            country: "CM"
        }

        flw.MobileMoney.franco_phone(payload)
        .then(validateTransaction);

        
    }),
    function validateTransaction(){}
];

exports.web_hook = asyncHandler(async(req, res)=>{
        const payload =req.body;
        console.log(payload);
        res.status(200).end

});

exports.get_all_user_transactions = asyncHandler(async(req,res, next)=>{
      const userId = req.userId;
      const transactions = await Transaction.find({
        $or: [
          { senders_id: userId },
          { receivers_id: userId }
        ]
      }).sort({created:'desc'});

      if(!transactions){
        return res.status(404).json({message:"no transaction yet"});
      }

      res.status(200).json({transactions});
});

exports.get_all_transactions_filter = asyncHandler(async(req, res)=>{

    const userId = req.userId
    const endDate =  new Date();
    let startDate;
    const timeframe = req.body.timeframe;

    switch (timeframe) {
        case 'daily':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
          break;
        case 'weekly':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - endDate.getDay());
          break;
        case 'monthly':
          startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
          break;
        default:
          res.status(400).json({message:"invalid time frame"});
      }

      const transactions = await Transaction.find({

        senders_id: userId,
        created: { $gte: startDate, $lte: endDate }
      });

      let totalTransaction =0;

      transactions.forEach(transaction => {
        const transactionAmount = parseFloat(transaction.amount);
        totalTransaction += transactionAmount;
      });
    
      res.status(200).json({totalTransaction,transactions});

});

