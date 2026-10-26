const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectID,
        ref:"User",
        required:[true,"Account must required."]
    },
    accountnumber:{
        type:Number,
        min:6,
        max:12
    },
    acconttype:{
        enum:{
            values:["savings","checking"],
        }
    }
    ,
    status:{
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Status Can be either Active,Frozen, or Closed"
        }
    },
    currency:{
        type:String,
        required:[true,"Currency is required for creating an Account."], 
        default:"NPR"
    } 
},{timestamps:true});


const accountModel = mongoose.model("accountModel",accountSchema);

module.exports = accountModel;
