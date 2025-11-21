import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pkg from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import auth from './middleware/auth.js'

const { Pool } = pkg

const app = express()
app.use(express.json()) // TÄRKEÄ: Ottaa vastaan JSON-rungon
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_must_be_changed'

// Tietokantayhteyden testaus heti käynnistyksen jälkeen
pool.connect()
  .then(client => {
    console.log(`Tietokantayhteys OK! (PGHOST: ${process.env.PGHOST}, PGPORT: ${process.env.PGPORT})`)
    client.release()
  })
  .catch(err => {
    console.error('KRIITTINEN VIRHE: Tietokantayhteys epäonnistui.', err)
    console.log(`Yritetyt asetukset: HOST=${process.env.PGHOST}, PORT=${process.env.PGPORT}, USER=${process.env.PGUSER}, DBNAME=${process.env.PGDATABASE}`)
  })

// ----------------------------------------------------
// REKISTERÖINTI (ILMAN EMAILIA TÄSSÄ VAIHEESSA)
// ----------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body 
  
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Käyttäjätunnus, sähköposti ja salasana vaaditaan.' })
  }
  try {
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)

    // TÄRKEÄ: Käytetään single quote -merkkiä (`...`) täällä
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING user_id, username, email`,
      [username, email, password_hash]
    )

    res.status(201).json({
      msg: 'Käyttäjä luotu onnistuneesti.',
      user: result.rows[0],
    })
  } catch (err) {
    // Jos käyttäjä on jo olemassa (PostgreSQL-koodi '23505' viittaa uniikkiusrajoitukseen)
    if (err.code === '23505') {
      return res.status(400).json({ msg: 'Käyttäjätunnus tai sähköposti on jo käytössä.' })
    }
    // Tulostetaan koko virhe konsoliin
    console.error('Rekisteröintivirhe:', err.stack || err)
    res.status(500).send('Palvelinvirhe rekisteröinnissä.')
  }
})

// ----------------------------------------------------
// KIRJAUTUMINEN
// ----------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body 

    try {
        const userResult = await pool.query(
            'SELECT user_id, password_hash FROM users WHERE username = $1', 
            [username]
        )
        const user = userResult.rows[0]

        if (!user) {
            return res.status(401).json({ msg: 'Virheellinen käyttäjätunnus tai salasana' })
        }

        const isMatch = await bcrypt.compare(password, user.password_hash)

        if (!isMatch) {
            return res.status(401).json({ msg: 'Virheellinen käyttäjätunnus tai salasana' })
        }

        const payload = { userId: user.user_id } 
        const token = jwt.sign(
            payload,
            JWT_SECRET, 
            { expiresIn: '1h' } 
        )

        res.json({ token })

    } catch (err) {
        console.error('Kirjautumisvirhe:', err)
        res.status(500).send('Palvelinvirhe kirjautumisessa.')
    }
})

// ----------------------------------------------------
// MUUT REITIT
// ----------------------------------------------------
app.get('/users', auth, async (req, res) => { 
    try {
    console.log(`Suojattu pyyntö käyttäjältä ID: ${req.userId}`);
    
    // HUOM: Valitaan user_id (ei id, joka saattoi aiheuttaa virheen)
    const result = await pool.query('SELECT user_id, username FROM users'); 
      res.json(result.rows)
    } catch (err) {
    console.error('Virhe suojatussa reitissä:', err)
    res.status(500).send('Virhe')
  }
})

app.get('/test', (req, res) => {
    res.send('Palvelin vastaa ja reititys toimii ainakin GET-pyynnöissä!');
});

app.use((req, res) => {
    res.status(404).send(`Reittiä ${req.method} ${req.url} ei löydy tältä palvelimelta.`);
});


app.listen(4000, () => { 
  console.log(`Toimii portissa 4000`)
})