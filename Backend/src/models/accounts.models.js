const mongoose = require('mongoose');
const ledgerModel = require('./ledger.models.js'); 

const accountSchema = new mongoose.Schema({
    name:{ 
        type:String,
        required:true,
        unique:true
    }
    ,
    balance: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
        required: true,
        min: [0, "Balance cannot be negative."]
    },

    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status must be ACTIVE, FROZEN, or CLOSED."
        },
        default: "ACTIVE",
        required: true
    },

    currency: {
        type: String,
        required: [true, "Currency is required."],
        default: "NPR"
    }
}, {
    timestamps: true
});

accountSchema.methods.getBalance = async function (){
    const balanceData = await ledgerModel.aggregate([
        {$match:{account: this._id}},           //First layer
        {                                       //Second layer
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {                                       //Third Layer
            $project:{
                _id:0,
                balance:{$subtract:["$totalCredit","$totalDebit"]}
            }

        }
    ])
    if(balanceData.length == "0"){return 0}
    else{return balanceData[0].balance;}
}

const accountModel = mongoose.model("accountModel", accountSchema);

module.exports = accountModel;
