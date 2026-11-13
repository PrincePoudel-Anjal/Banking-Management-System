const accountModel = require('../models/accounts.models.js');
const userModel = require('../models/accounts.models.js');
const ledgerModel = require('../models/ledger.models.js');
const transactionModel = require('../models/transaction.models.js');
const mongoose = require('mongoose');


// * - Create a new transaction[cite: 3]
//  * THE 10-STEP TRANSFER FLOW:[cite: 3]
//  * 1. Validate request[cite: 3]
//  * 2. Validate idempotency key[cite: 3]
//  * 3. Check account status[cite: 3]
//  * 4. Derive sender balance from ledger[cite: 3]
//  * 5. Create transaction (PENDING)[cite: 3]
//  * 6. Create DEBIT ledger entry[cite: 3]
//  * 7. Create CREDIT ledger entry[cite: 3]
//  * 8. Mark transaction COMPLETED[cite: 3]
//  * 9. Commit MongoDB session[cite: 3]
//  * 10. Send email notification[cite: 3]
//  */

async function transfer(req, res) {

    const {fromAccount,toAccount,amount,IdempotencyKey} = req.body;
    if(!fromAccount,!toAccount,!amount,!IdempotencyKey){
        return res.status(400).json({
            message:"Transfer isn't Possible"
        });
    }
    
    const fromUserAccount = await accountModel.findOne({
            _id:fromAccount         
        })
    const toUserAccount = await accountModel.findOne({
            _id:toAccount         
        })  
    
    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message:"Can't transfer! There is Either no Sender or Receiver Account."
        });
    }

    if(fromUserAccount.status != "ACTIVE" || toUserAccount.status != "ACTIVE"){
        return res.status(422).json({
           message: "account isn't active",
        });
    }  


    const isTransactionExists = await accountModel.findOne({
        idempotencyKey:IdempotencyKey,
    });
    
    if(isTransactionExists){
        
        if(isTransactionExists.status == "completed"){
            return res.status(400).json({
                 message:"Transaction has already been finished."
        });
        }
        
        if(isTransactionExists.status == "pending"){
            return res.status(401).json({
                 message:"Transaction is pending."
        });
        }
        
        if(isTransactionExists.status == "failed"){
            return res.status(402).json({
                 message:"Transaction has failed previously."
        });
        }    
        
    }
    
    const balance = await fromUserAccount.getBalance();
    if(balance<amount){
        return res.status(422).json({
            message:`Insufficient balance current balance is:${balance} where amount to send is ${amount}`
    }); 
    }
    
    //Creating transaction
    const session = await mongoose.startSession();
    session.startTransaction() 
    const [transaction] = await transactionModel.create([{
        fromAccount:fromAccount,toAccount:toAccount,type:"transfer",amount:amount,idempotencyKey:IdempotencyKey,status:"pending",description:"Amount has been Transferred."
    }],{session});
    
    const [debitLedgerEntry] = await ledgerModel.create([{
        account:fromAccount,amount:amount,transaction:transaction._id,type:"DEBIT"
    }],{session});
    const [creditLedgerEntry] = await ledgerModel.create([{
        account:toAccount,amount:amount,transaction:transaction._id,type:"CREDIT"
    }],{session});

    await accountModel.updateOne(
        {_id:fromAccount},
        {$inc:{balance:-amount}},
        {session}    
    );
    await accountModel.updateOne(
        {_id:toAccount},
        {$inc:{balance:amount}},
        {session}    
    );

    await transactionModel.updateOne(
        {_id:transaction._id},
        {$set:{status:"completed"}},
        {session}
    );
    

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
        message:"Transfer Successful!"});
};



//Import amount to deposit
//checking whether the transaction is already present
//creating the ledger of credit 

async function deposit(req,res){
    const {user,moneyadd,Description,IdempotencyKey} = req.body;
    if(!user || !moneyadd || !IdempotencyKey){
        return res.status(400).json({
            message:"User and Money is required!"
        });    
    }
    //checking whether money is number only
    if(typeof moneyadd != "number" || moneyadd<0){
        return res.status(400).json({
            message: "Deposit money should be greater than Zero."
        });
    }

    const account = await accountModel.findOne({_id:user})
    if(!account){
        return res.status(404).json({
            message:"Invalid user"
        });
    }
    if(account.status != "ACTIVE"){
        return res.status(422).json({
           message: "account isn't active",
        });
    }  

    isTransactionExists = await transactionModel.findOne({
        idempotencyKey:IdempotencyKey
    });
    
    
    if(isTransactionExists){
        if(isTransactionExists.status === "completed"){
        return res.status(200).json({
                message:"Transaction has already been finished."
    });
    }

        if(isTransactionExists.status === "pending"){
            return res.status(200).json({
                    message:"Transaction is pending."
        });
        }
        if(isTransactionExists.status === "failed"){
            return res.status(500).json({
                    message:"Transaction has failed previously."
        });
        }  
    }
          
    
    
    //Transaction: 
    //Creating Transaction to Pending
    //creating Ledger Credit
    //creating Ledger Debit
    //Making   Transaction to Complete
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try{    
  
    const [transaction] = await transactionModel.create([{account,account,type:"deposit",amount:moneyadd,idempotencyKey:IdempotencyKey,status:"pending",description:Description}],{session})
    const [creditLedgerEntry] = await ledgerModel.create([{
        account:account,amount:moneyadd,transaction:transaction,type:"CREDIT"
    }],{session});    
   
    await accountModel.updateOne({_id:user},{$inc:{balance:moneyadd}},{session});

    transaction.status = "completed"
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json(
        {
            "message":"Transaction has been Completed"
        }
    )
    }
    catch(error){
        await session.abortTransaction();
        return res.status(500).json({
            message:"Couldn't complete deposit",
        });
    }
       
}

module.exports = { transfer, deposit }; 











