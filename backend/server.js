import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'

import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'

dotenv.config()
connectDB()
const app = express()
app.use(express.json())

app.get('/api', (req, res) => {
    res.send('API is up!')
})

app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

app.use('/api/config/rave', (req, res) => {
    res.send(process.env.RAVE_PUBLIC_KEY)
})

app.use('/api/config/paystack', (req, res) => {
    res.send(process.env.PAYSTACK_PUBLIC_KEY)
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))