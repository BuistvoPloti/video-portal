const restify = require('restify');
const initializeRoutes = require('./routes');

const app = restify.createServer({
  name: 'video-portal-app',
  version: '1.0.0'
});

initializeRoutes(app);
app.use(restify.plugins.acceptParser(app.acceptable));
app.use(restify.plugins.queryParser());
app.use(restify.plugins.bodyParser());
app.pre(restify.pre.sanitizePath());

module.exports = app;
