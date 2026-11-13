const express = require('express');
const transactionController = require('../controllers/transaction.controller.js');
const loginmiddleware = require('../middlewares/loginauth.middleware.js');

const router = express.Router();

/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     summary: Transfer money between accounts
 *     description: Executes an atomic peer-to-peer money transfer between two active accounts. Creates a transaction record, generates corresponding DEBIT and CREDIT ledger entries, and updates account balances using MongoDB transactions.
 *     tags:
 *       - Transactions
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferRequest'
 *     responses:
 *       200:
 *         description: Transfer completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               message: "Transfer Successful!"
 *       400:
 *         description: Missing parameters, accounts not found, or transaction already finished
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingParams:
 *                 summary: Missing required fields
 *                 value:
 *                   message: "Transfer isn't Possible"
 *               notFound:
 *                 summary: Sender or Receiver account not found
 *                 value:
 *                   message: "Can't transfer! There is Either no Sender or Receiver Account."
 *               alreadyFinished:
 *                 summary: Transaction idempotency key already processed
 *                 value:
 *                   message: "Transaction has already been finished."
 *       401:
 *         description: Unauthorized - missing/invalid authentication token or transaction pending
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Please login First!"
 *       422:
 *         description: Account is not ACTIVE or sender has insufficient funds
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               inactive:
 *                 summary: Account not active
 *                 value:
 *                   message: "account isn't active"
 *               insufficientFunds:
 *                 summary: Insufficient balance
 *                 value:
 *                   message: "Insufficient balance current balance is:500 where amount to send is 1200"
 *       500:
 *         description: Internal transaction failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/transfer", loginmiddleware, transactionController.transfer);

/**
 * @swagger
 * /api/transactions/deposit:
 *   post:
 *     summary: Deposit money into an account
 *     description: Deposits money into an active bank account. Performs an idempotent transaction, generates a CREDIT entry in the ledger, and increments the account balance atomically.
 *     tags:
 *       - Transactions
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepositRequest'
 *     responses:
 *       200:
 *         description: Deposit completed successfully or idempotent replay
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               message: "Transaction has been Completed"
 *       400:
 *         description: Invalid input (missing fields or deposit amount <= 0)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingFields:
 *                 summary: Required fields missing
 *                 value:
 *                   message: "User and Money is required!"
 *               invalidAmount:
 *                 summary: Deposit amount not greater than zero
 *                 value:
 *                   message: "Deposit money should be greater than Zero."
 *       401:
 *         description: Unauthorized - missing or invalid authentication cookie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Please login First!"
 *       404:
 *         description: Target user/account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Invalid user"
 *       422:
 *         description: Account is not in ACTIVE status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "account isn't active"
 *       500:
 *         description: Deposit transaction failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Couldn't complete deposit"
 */
router.post("/deposit", loginmiddleware, transactionController.deposit);

module.exports = router;
