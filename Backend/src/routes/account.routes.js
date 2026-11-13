const express = require("express");
const accountController = require('../controllers/account.controller.js');
const router = express.Router();

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
router.post('/create', accountController);

module.exports = router;
