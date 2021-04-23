const restify = require('restify');
const initializeRoutes = require('./routes');

const server = restify.createServer({
  name: 'video-portal-app',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

//start section
const { createTables } = require("./db/postgresql/create-tables");
const pool = require('./db/postgresql').connectionPool;
// const { Pool } = require('pg');
// const DATABASE_URL = 'postgres://postgres:denis126478712@127.0.0.1:5432/VideoPlatform';
//
// const pool = new Pool({
//   connectionString: DATABASE_URL
// });

createTables(pool).then();

server.get('/createusertest', async (req, res, next) => {
  const result = await pool.query('INSERT INTO users(role, username, email, password, salt) VALUES($1, $2, $3, $4, $5)  RETURNING *',
    ['editor', 'denis123', 'den1@google.com', 'qwef43f3g3', '1234114124']);
  res.send({ data: result.rows });
  return next();
});
//end section

server.listen(8080, () => {
  initializeRoutes(server);
  console.log('%s listening at %s', server.name, server.url);
});
