const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})


const usermodel = mongoose.model('User',userschema)

module.exports = usermodel