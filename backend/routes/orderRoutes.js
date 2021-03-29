import express from 'express'
const router = express.Router()
import { protectRoute } from '../middlewares/authMiddleware.js'
import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders } from '../controllers/orderController.js'

router.route('/').post(protectRoute, addOrderItems)
router.route('/').get(protectRoute, getOrders)
router.route('/myorders').get(protectRoute, getMyOrders)
router.route('/:id').get(protectRoute, getOrderById)
router.route('/:id/pay').put(protectRoute, updateOrderToPaid)

export default router