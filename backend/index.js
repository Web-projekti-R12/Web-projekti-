import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()

app.use(express.json())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))

app.use('/api/auth', authRoutes)   // <-- tärkeä
app.use('/api/users', userRoutes)  // jos sulla on tämäkin

app.get('/test', (req, res) => {
  res.send('Palvelin vastaa ja reititys toimii!')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Backend toimii portissa ${PORT}`)
})
