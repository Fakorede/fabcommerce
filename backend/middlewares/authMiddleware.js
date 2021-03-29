import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protectRoute = asyncHandler(async (req, res, next) => {
    let authHeader = req.headers.authorization
    let token

    if(authHeader && authHeader.startsWith('Bearer')) {
        try {
            token = authHeader.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password')
            //console.log(req.user)
            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    } 
    
    if(!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }

})

const isAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as an admin')
    }
}

export { protectRoute, isAdmin }