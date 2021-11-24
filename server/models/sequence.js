const mongoose = require('mongoose');


const sequenceSchema = mongoose.Schema({
    maxDocumentId: {
        type:Number,
       
    },

    maxContactId: {
        type:Number,
    },

    maxMessageId: {
        type:Number,
    },

    name:{
        type:Number,
    }
})


module.exports = mongoose.model('Sequence', sequenceSchema);
