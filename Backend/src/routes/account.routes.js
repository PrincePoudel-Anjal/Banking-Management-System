const express = require("express");
const accountController = require('../controllers/account.controller.js');
const router = express.Router();
const loginmiddleware  = require('../middlewares/loginauth.middleware.js')
/**
 * @swagger
 * /api/account/create:
 *   post:
 *     summary: Create a new bank account
 *     description: Creates a new account linked to a user. Requires a valid user ID and an account name.
 *     tags:
 *       - Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAccountRequest'
 *     responses:
 *       200:
 *         description: Account successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               message: "Account has been created."
 *       400:
 *         description: Missing required fields (user or name)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "The user and name is required."
 *       401:
 *         description: Account already exists for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "User already Exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/create', loginmiddleware, accountController.createAccount)

/**
 * @swagger
 * /api/account/checkaccount:
 *   post:
 *     summary: Get logged-in user's account details
 *     description: Retrieves the bank account details (such as name and balance) for the currently authenticated user via their session cookie.
 *     tags:
 *       - Accounts
 *     responses:
 *       200:
 *         description: Account details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 account:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     balance:
 *                       type: number
 *                       example: 1500.50
 *       401:
 *         description: Unauthorized - User is not logged in or token is invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Unauthorized access"
 *       404:
 *         description: Account not found for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Account not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/checkaccount', loginmiddleware, accountController.checkAccount);

module.exports = router;
