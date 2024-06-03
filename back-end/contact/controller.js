const asyncHandler = require("express-async-handler");
const Contact = require('./model');
const User = require("../user/model");

exports.add_contact = asyncHandler(async (req, res, next)=>{
    const userId = req.userId;
    const contactId = req.params.contactId;

    const user = await User.findById(userId);
    const contact = await User.findById(contactId);

    const newContact = new Contact({
             first_name:contact.first_name,
             last_name: contact.last_name,
             email:contact.email,
             phone:contact.phone_number,
             profile:contact.profile,
             userId:user._id
    });
    await newContact.save();

    user.contacts.push(newContact._id);

    user.save();

    res.status(201).json({message : "Contact added successfully !"});
    
});

exports.get_contacts = asyncHandler(async (req, res, next)=>{

    const user = await User.findById(req.userId).populate('contacts');
    res.status(200).json(user.contacts);
});