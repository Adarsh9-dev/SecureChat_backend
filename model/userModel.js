// const mongoose = require("mongoose");
import mongoose from "mongoose"

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    file: {
        type: String,
    }
})

export default new mongoose.model('userData',user)
// module.exports(new mongoose.model('userData',user))