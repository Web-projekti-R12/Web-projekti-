import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { createUser, findUserByEmail } from '../models/userModel.js'

const JWT_SECRET = process.env.JWT_SECRET

export async function registerUser(req, res) {
  const { email, username, password } = req.body

  const rawEmail = email || username
  const loginEmail = rawEmail?.trim().toLowerCase()

  if (!loginEmail || !password) {
    return res
      .status(400)
      .json({ msg: 'Email and password are required.' })
  }

  // salasanan määritykset
  const passwordRules = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }

  if (!passwordRules.minLength) {
    return res.status(400).json({
      msg: 'The password must be at least 8 characters long.',
    })
  }

  if (!passwordRules.hasUppercase) {
    return res.status(400).json({
      msg: 'The password must contain at least one uppercase letter.',
    })
  }

  if (!passwordRules.hasNumber) {
    return res.status(400).json({
      msg: 'The password must contain at least one number',
    })
  }

  try {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await createUser({ email: loginEmail, passwordHash })

    return res.status(201).json({
      msg: 'User created',
      user,
    })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ msg: 'Email is already in use.' })
    }
    console.error('Rekisteröintivirhe:', err.stack || err)
    return res.status(500).send('Palvelinvirhe rekisteröinnissä.')
  }
}

export async function loginUser(req, res) {
  const { email, username, password } = req.body

  const rawEmail = email || username
  const loginEmail = rawEmail?.trim().toLowerCase()

  if (!loginEmail || !password) {
    return res
      .status(400)
      .json({ msg: 'Email and password are required.' })
  }

  try {
    const user = await findUserByEmail(loginEmail)

    if (!user) {
      return res
        .status(401)
        .json({ msg: 'Virheellinen sähköposti tai salasana' })
    }

    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
      return res
        .status(401)
        .json({ msg: 'Virheellinen sähköposti tai salasana' })
    }

    const payload = { userId: user.user_id }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

    return res.json({ token })
  } catch (err) {
    console.error('Kirjautumisvirhe:', err)
    return res.status(500).send('Palvelinvirhe kirjautumisessa.')
  }
}
