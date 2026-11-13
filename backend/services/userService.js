const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

async function registerUser(userData) {
  const { nombre, email, clave, rol } = userData;

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    return { status: 'error', message: 'El email ya se encuentra registrado' };
  }

  const passwordHash = await bcrypt.hash(clave, 10);

  const newUser = await User.create({
    nombre,
    email,
    clave: passwordHash,
    rol: rol || 'cliente'
  });

  const userWithoutPassword = {
    id: newUser._id,
    nombre: newUser.nombre,
    email: newUser.email,
    rol: newUser.rol
  };

  return { status: 'ok', data: userWithoutPassword };
}

async function loginUser(email, clave) {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return { status: 'error', message: 'Credenciales inválidas' };
  }

  const isValid = await bcrypt.compare(clave, user.clave);
  if (!isValid) {
    return { status: 'error', message: 'Credenciales inválidas' };
  }

  const payload = {
    sub: user._id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

  return { status: 'ok', token, user: payload };
}

async function getAllUsers() {
  const users = await User.find().select('-clave');
  return { status: 'ok', data: users };
}

module.exports = {
  registerUser,
  loginUser,
  getAllUsers
};