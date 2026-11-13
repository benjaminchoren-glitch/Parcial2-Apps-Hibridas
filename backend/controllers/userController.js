const userService = require('../services/userService');

async function register(req, res) {
  try {
    const { nombre, email, clave, rol } = req.body;

    if (!nombre || !email || !clave) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos (nombre, email, clave) son obligatorios'
      });
    }

    if (clave.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'El formato del email no es válido'
      });
    }

    const result = await userService.registerUser({ nombre, email, clave, rol });

    if (result.status === 'error') {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al registrar el usuario',
      error: error.message
    });
  }
}

async function login(req, res) {
  try {
    const { email, clave } = req.body;

    if (!email || !clave) {
      return res.status(400).json({
        status: 'error',
        message: 'Debe ingresar email y contraseña'
      });
    }

    const result = await userService.loginUser(email, clave);

    if (result.status === 'error') {
      return res.status(401).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al iniciar sesión',
      error: error.message
    });
  }
}

async function getUsers(req, res) {
  try {
    const result = await userService.getAllUsers();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener los usuarios',
      error: error.message
    });
  }
}

module.exports = {
  register,
  login,
  getUsers
};