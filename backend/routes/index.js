const usersRouter = require('./usersRouter');
const servicesRouter = require('./servicesRouter');
const appointmentsRouter = require('./appointmentsRouter');

function routerAPI(app) {
  app.use('/api/usuarios', usersRouter);
  app.use('/api/servicios', servicesRouter);
  app.use('/api/turnos', appointmentsRouter);
}

module.exports = routerAPI;