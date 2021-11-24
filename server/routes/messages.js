const express = require('express');
const router = express.Router();


const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');



router.get('/', (req, res, next) => {
    Message.find().populate('sender').then(messagelist=>{

        console.log('messages',messagelist);
        return res.status(200).json(
            {
              message:'post fetch successfully weww',
              messageList:messagelist,
              
              
            });


    }).catch(err => {
        
        return res.status(500).json(
        {
            message: err +' - ' +'post fetch error 500'
        });
      });
 });



 router.post('/', (req, res, next) => {


  console.log('posting', req.body.subject,'-subject', req.body.msgText);
  // console.log(req.body);

    const maxmessageId = sequenceGenerator.nextId("messages");
  

    const message = new Message({
      id: maxmessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender:'619b912230aa458252200553'
    });
  
    message.save()
      .then(createdmessage => {
        res.status(201).json({
          message: 'message added successfully',
          message: createdmessage
        });
      })
      .catch(error => {
         res.status(500).json({
            message: 'An error occurred',
            error: error
          });
      });
  });






module.exports = router; 


