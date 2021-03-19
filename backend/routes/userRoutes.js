import express from 'express'
const router = express.Router()

import { protectRoute } from '../middlewares/authMiddleware.js'
import { 
    authUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile
} from '../controllers/userController.js'

router.route('/').post(registerUser)
router.post('/login', authUser)
router
    .route('/profile')
    .get(protectRoute, getUserProfile)
    .put(protectRoute, updateUserProfile)

export default router