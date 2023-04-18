import mongoose from "mongoose";

const convSchema = mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receverId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
},{timestamps: true});

export default new mongoose.model("conversation",convSchema);

/* 
{
  "senderId": "640ea102d2137be19e8138e2",
  "receverId": "641169d165bcfa955cee0a1e",
  "message": "Na aji chuti thila"
}

*/