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

// (valinnainen pieni testikysely, joka EI kaada mitään)
pool.query('SELECT NOW()')
  .then(res => {
    console.log(
      `Tietokantayhteys toimii (PGHOST: ${process.env.PGHOST}, PGPORT: ${process.env.PGPORT})`
    )
  })
  .catch(err => {
    console.error('Tietokantayhteyden testikysely epäonnistui:', err.message)
  })

export default pool
