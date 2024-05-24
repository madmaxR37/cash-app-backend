const asyncHandler = require("express-async-handler");
const Notification = require('./model');

exports.getUserNotifications = asyncHandler(async (req, res, next)=>{
    
    const userId = req.params.id;

    const notification = await Notification.find({userId: userId}).sort({date:'desc'}).limit(15);

    if(!notification){
        return res.status(404).json({"message":"No notifications yet!"});
    }

    return res.status(200).json({notification});

})
