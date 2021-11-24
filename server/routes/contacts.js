const express = require('express');
const router = express.Router();


const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');



router.get('/', (req, res, next) => {
  Contact.find()
    .populate('group')
    .then(contacts => {
      res.status(200).json({
          message: 'Contacts fetched successfully!',
          contacts: contacts
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});



 router.post('/', (req, res, next) => {
    const maxContactId = sequenceGenerator.nextId("contacts");
  
    const contact = new Contact({
      id: maxContactId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
    });
  
    contact.save()
      .then(createdContact => {
        res.status(201).json({
          message: 'Contact added successfully',
          Contact: createdContact
        });
      })
      .catch(error => {
         res.status(500).json({
            message: 'An error occurred',
            error: error
          });
      });
  });



  router.put('/:id', (req, res, next) => {

    console.log('ids',req.params.id);
    console.log('ids',req.params.group);

    Contact.findOne({ id: req.params.id })
      .then(contact => {
        console.log('contacts',contact);
        contact.name = req.body.name;
        contact.email = req.body.email;
        contact.phone = req.body.phone;
        contact.imageUrl = req.body.imageUrl;
        contact.group= req.body.group;
 
        Contact.updateOne({ id: req.params.id }, contact)
          .then(result => {
            console.log('result',result);
            res.status(204).json({
              message: 'Contact updated successfully'
            })
          })
          .catch(error => {
             res.status(500).json({
             message: 'An error occurred',
             error: error
           });
          });
      })
      .catch(error => {
        console.log('PUT',error);
        res.status(500).json({
          
            message: 'Contact not found.',
          error: { Contact: 'Contact not found'}
        });
      });
  });


  router.delete("/:id", (req, res, next) => {
    console.log('param',req.params.id);

    Contact.findOne({ id: req.params.id })
      .then(contact => {
        Contact.deleteOne({ id: req.params.id })
          .then(result => {
            res.status(204).json({
              message: "Contact deleted successfully"
            });
          })
          .catch(error => {
             res.status(500).json({
             message: 'An error occurred',
             error: error
           });
          })
      })
      .catch(error => {
        res.status(500).json({
          message: 'Contact not found.',
          error: { Contact: 'Contact not found'}
        });
      });
  });




module.exports = router; 


