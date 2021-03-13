import express from 'express'
const router = express.Router()

import { protectRoute } from '../middlewares/authMiddleware.js'
import { 
    authUser, 
    registerUser, 
    getUserProfile 
} from '../controllers/userController.js'

router.route('/').post(registerUser)
router.post('/login', authUser)
router.route('/profile').get(protectRoute, getUserProfile)

export default router