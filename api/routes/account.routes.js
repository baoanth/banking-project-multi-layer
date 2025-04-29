const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account.controller");

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Tạo tài khoản mới
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               currency:
 *                 type: string
 *               description:
 *                 type: string
 *               balance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Tài khoản đã được tạo thành công
 */
router.post("/accounts", accountController.create);

/**
 * @swagger
 * /accounts/{user}:
 *   get:
 *     summary: Lấy thông tin tài khoản
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin tài khoản
 */
router.get("/accounts/:user", accountController.get);

/**
 * @swagger
 * /accounts/{user}:
 *   delete:
 *     summary: Xóa tài khoản
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Đã xóa thành công
 */
router.delete("/accounts/:user", accountController.delete);

/**
 * @swagger
 * /accounts/{user}/transactions:
 *   post:
 *     summary: Thêm giao dịch mới
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               object:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Giao dịch đã thêm thành công
 */
router.post("/accounts/:user/transactions", accountController.addTransaction);

/**
 * @swagger
 * /accounts/{user}/transactions/{id}:
 *   delete:
 *     summary: Xóa giao dịch
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Giao dịch đã được xóa
 */
router.delete("/accounts/:user/transactions/:id", accountController.deleteTransaction);

module.exports = router;
