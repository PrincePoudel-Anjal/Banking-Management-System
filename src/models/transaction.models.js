const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const transactionSchema = new mongoose.Schema({ //Tracks Every Balance that changed
    referenceId:{
        type:String,
        unique:true,
        required:true,
        default: () => randomUUID()
    },
    receiverAccountId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    type:{
        enum:{
            values:["deposit","withdrawal","transfer"]
        }
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        enum:{
           vlues: ["pending","completed","failed"]
        },
    },
    description:{
        type:String,
        required:true,
    }
},{timestamp:true});

const transactionModel = mongoose.model("transactionModel",transactionSchema);