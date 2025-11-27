import { getAllUsers } from '../models/userModel.js'

export async function getUsers(req, res) {
  try {
    console.log(`Suojattu pyyntö ${req.userId}`)
    const users = await getAllUsers()
    return res.json(users)

  } catch (err) {
    console.error('Virhe', err)
    return res.status(500).send('käyttäjää ei löytynyt')
  }
}