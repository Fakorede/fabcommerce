import express from 'express'
const router = express.Router()

import { protectRoute, isAdmin } from '../middlewares/authMiddleware.js'
import { 
    authUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
} from '../controllers/userController.js'

router.route('/').post(registerUser).get(protectRoute, isAdmin, getUsers)
router.post('/login', authUser)
router
    .route('/profile')
    .get(protectRoute, getUserProfile)
    .put(protectRoute, updateUserProfile)
router
    .route('/:id')
    .get(protectRoute, isAdmin, getUserById)
    .put(protectRoute, isAdmin, updateUser)
    .delete(protectRoute, isAdmin, deleteUser)

export default router