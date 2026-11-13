const mongoose = require("mongoose");


const transactionSchema = new mongoose.Schema({ //Tracks Every Balance that changed
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountModel"
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "accountModel"
    },
    type: {
        type: String,
        enum: ["deposit", "withdrawal", "transfer"],
        default: "deposit"
    },
    amount: {
        type: Number,
        required: true
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency Key is required for Transaction"],
        index: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    description:{
        type:String,
        required:true,
    }
},{timestamps:true});

const transactionModel = mongoose.model("transactionModel",transactionSchema);
module.exports = transactionModel;
