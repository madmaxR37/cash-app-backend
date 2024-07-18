const User = require("../user/model");
const { Decimal128 } = require('mongodb');
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

exports.create_transaction_with_id = asyncHandler(async(req, res)=>{

  const sender_id = req.userId;
  const receiver_id = req.params.id;
  const transaction_amount = req.body.amount;

  const sender = await User.findById(sender_id);
  
  if(!sender){
      return res.status(404).json({"message": "sender not found"});
  }
  
  const senderWalletBalance = sender.wallet.account_balance;

  if(senderWalletBalance < transaction_amount){
           return res.status(400).json({"message":"Transaction failed, balance insufficient"});
  }

  const receiver = await User.findById(receiver_id);
  if(!receiver){
      return res.status(404).json({"message": "sender not found"});
  }

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
    
    sender.wallet.account_balance -=parseFloat(amount);
    receiver.wallet.account_balance += parseFloat(amount);
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
        description:`You have received ${amount}${sender.wallet.currency} to ${receiver.first_name}, on ${transaction.created}.
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
    asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userId = req.userId;
      const user = await User.findById(userId);
      const amount = req.body.amount;

      const transaction = new Transaction({

        receivers_id: userId,

        amount: amount,

        status: true


      });
      
      await transaction.save();

      const recharge = parseFloat(user.wallet.account_balance) + amount; 
      console.log(recharge);

      user.wallet.account_balance= recharge;

      const receiverNotification = new Notification({
        userId:userId,
        title:'Transaction reception',
        description:`You have received ${amount}${user.wallet.currency}`,
    });

     await user.save();
    await receiverNotification.save();

    res.status(200).json({message:"Recharge successful"});
    }),

  ];

  exports.carte_charge = [
    body('number')
      .trim(),
      body('cvv')
      .trim(),
      body('exp_date')
      .trim(),
    body('amount'),
    asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
   
      const userId = req.userId;
      const user = await User.findById(userId);
      const amount = req.body.amount;

      const transaction = new Transaction({

        receivers_id: userId,

        amount: amount,

        status: true


      });
      
      await transaction.save();

      const recharge = parseFloat(user.wallet.account_balance) + amount; 

      user.wallet.account_balance= recharge;

      const receiverNotification = new Notification({
        userId:userId,
        title:'Transaction reception',
        description:`You have received ${amount}${user.wallet.currency}`,
    });

     await user.save();
    await receiverNotification.save();

    res.status(200).json({message:"Recharge successful"});
  }),

  ];


exports.get_all_user_transactions = asyncHandler(async(req,res, next)=>{
      const userId = req.userId;
      const sent_transactions = await Transaction.find({
        senders_id: userId
      });

      let total_sent_Transaction =0;

      sent_transactions.forEach(transaction => {
        const transactionAmount = parseFloat(transaction.amount);
        total_sent_Transaction += transactionAmount;
      });


      const received_transactions = await Transaction.find({

        receivers_id: userId
      });

      let total_received_Transaction =0;

      received_transactions.forEach(transaction => {
        const transactionAmount = parseFloat(transaction.amount);
        total_received_Transaction += transactionAmount;
      });

      const sent_percentage = (total_sent_Transaction/(total_sent_Transaction+total_received_Transaction))*100;
      const received_percentage = (total_received_Transaction/(total_sent_Transaction+total_received_Transaction))*100;
    
      res.status(200).json({total_received_Transaction,total_sent_Transaction,received_transactions,sent_transactions,sent_percentage,received_percentage});
});

exports.get_all_transactions_filter = asyncHandler(async(req, res)=>{

    const userId = req.userId
    const endDate =  new Date();
    let startDate;
    const timeframe = req.params.timeframe;

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

      const sent_transactions = await Transaction.find({

        senders_id: userId,
        created: { $gte: startDate, $lte: endDate }
      });

      let total_sent_Transaction =0;

      sent_transactions.forEach(transaction => {
        const transactionAmount = parseFloat(transaction.amount);
        total_sent_Transaction += transactionAmount;
      });


      const received_transactions = await Transaction.find({

        receivers_id: userId,
        created: { $gte: startDate, $lte: endDate }
      });

      let total_received_Transaction =0;

      received_transactions.forEach(transaction => {
        const transactionAmount = parseFloat(transaction.amount);
        total_received_Transaction += transactionAmount;
      });

      const sent_percentage = (total_sent_Transaction/(total_sent_Transaction+total_received_Transaction))*100;
      const received_percentage = (total_received_Transaction/(total_sent_Transaction+total_received_Transaction))*100;

      res.status(200).json({total_received_Transaction,total_sent_Transaction,received_transactions,sent_transactions,sent_percentage,received_percentage});

});

exports.mobile_withdraw = [
  body('phone')
    .trim(),
  body('amount'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.userId;
    const user = await User.findById(userId);
    const amount = req.body.amount;

    const transaction = new Transaction({

      senders_id: userId,

      amount: amount,

      status: true


    });
    
    await transaction.save();

    const withdraw = parseFloat(user.wallet.account_balance) - amount; 
   

    user.wallet.account_balance= withdraw;

    const receiverNotification = new Notification({
      userId:userId,
      title:'Transaction sent',
      description:`You have removed ${amount}${user.wallet.currency}`,
  });

   await user.save();
  await receiverNotification.save();

  res.status(200).json({message:"withdraw successful"});
  }),

];