import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pkg from 'pg'
const { Pool } = pkg

const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users')
    res.json(result.rows)
  } catch (err) {
    console.error('Virhe:', err)
    res.status(500).send('Virhe')
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Toimii portissa ${process.env.PORT}`)
})
