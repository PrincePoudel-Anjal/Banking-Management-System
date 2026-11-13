const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"accountModel",
        required:[true,"Ledger should be linked with an account."],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating ledger entry."],
        immutable:true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [false, "Ledger must be associated with a transaction" ],
        index: true,
        immutable: true},    
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can either be credit or Debit" 
        },
        required:[true,"Ledger type is Required"],
        immutable:true
    }
});
function preventLedgerModification(){
    throw new Error("Ledger cannot be modified.");
}
ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);
ledgerSchema.pre('replaceOne',preventLedgerModification);
ledgerSchema.pre('remove',preventLedgerModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerModification);

const ledgerModel = mongoose.model("ledgerModel",ledgerSchema);
module.exports = ledgerModel;