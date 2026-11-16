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
       return res.status(401).json({
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


async function checkAccount(req, res) {
    try {
        // 1. Get the logged-in user's ID from your auth middleware
        const {userId} = req.body; // (or req.user.id depending on how you sign your JWT)

        // 2. Find the account using that ID
        const account = await accountModel.findOne({ _id: userId });

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        // 3. Return the account details (name, balance, etc.)
        return res.status(200).json({
            account
        });

    } catch (error) {
        console.error("Error fetching account:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = { createAccount, checkAccount };