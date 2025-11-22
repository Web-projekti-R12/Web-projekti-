import 'dotenv/config'
import pkg from 'pg'

const { Pool } = pkg

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

// testataan yhteys kun käynnistää
pool
  .connect()
  .then((client) => {
    console.log(
      `Tietokantayhteys OK! (PGHOST: ${process.env.PGHOST}, PGPORT: ${process.env.PGPORT})`
    )
    client.release()
  })
  .catch((err) => {
    console.error('Tietokantayhteys epäonnistui.', err)
    console.log(
      `Yritetyt asetukset: HOST=${process.env.PGHOST}, PORT=${process.env.PGPORT}, USER=${process.env.PGUSER}, DBNAME=${process.env.PGDATABASE}`
    )
  })

export default pool
