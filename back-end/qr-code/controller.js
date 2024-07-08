const asyncHandler = require("express-async-handler");
const QR = require('./model');
const User = require("../user/model");
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

exports.get_QR_code_url = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const qrCodeDirectory = 'qr-code-images';
  
    try {
      const qr = await QR.findOne({ userId: userId });
  
      if (!qr) {
        const qrCodeBuffer = await qrcode.toBuffer(userId);
        const fileName = `${Date.now()}.png`;
        const filePath = path.join(__dirname, '../', qrCodeDirectory, fileName);
        await fs.promises.writeFile(filePath, qrCodeBuffer);
        const newQRCode = new QR({ userId: userId, url: `/${qrCodeDirectory}/${fileName}` });
        await newQRCode.save();
        res.status(200).json(newQRCode);
      } else {
        res.status(200).json(qr);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error generating QR code',error:error });
    }
  });