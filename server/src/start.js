const app = require('express')();
const config = require('./config');
const parseError = require('./utils/parseError');
const setupAuthentication = require('./init/setupAuthentication');
const setupRoutes = require('./init/setupRoutes');
const setupServer = require('./init/setupServer');
const setupLogger = require('./init/setupLogger');
const setupMySql = require('./init/setupMySql')
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const scheduleRouter = require('./routes/schedule');


var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const start = async () => {
  let log;
  const prestart = async () => {
    log = setupLogger();
  };

  await prestart().catch((error) => {
    console.error(error);
    process.exit(1);
  });

  const startAsync = async () => {
    log.info('Application starting');

    app.set('etag', true);

    await setupAuthentication(app, config.auth, log);

    app.use('/auth', authRouter);
    app.use('/user', userRouter);
    app.use('/schedule', scheduleRouter);
    log.info('Setting up user API');

    app.get('/hello', (req, res) => {
      res.send('hello');
    });

    setupRoutes(app, config.server.staticRoot, log);
    await setupServer(app, log, config.server);
  };
  startAsync().catch((error) => {
    log.error(parseError(error));
    process.exit(1);
  });
};

start();
