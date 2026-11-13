//No user and name means no account Creation
//Checking whether an account already exists?
//Else Create Account

const accountModel = require('../models/accounts.models.js');

async function createAccount(req,res,next){
    const {user,name} = req.body;
    if(!user || !name){
        return res.status(400).json({
            message:"The user and name is required."
        });
    }    
    const isaccount = await accountModel.findOne({_id:user});
    if(isaccount){
       res.status(401).json({
        message:"User already Exists"
       });
    }
    const account =  accountModel.create({
        "_id":user,
        "name":name
    }); 
    return res.status(200).json({
        message:"Account has been created."
    });
}
module.exports = createAccount;
