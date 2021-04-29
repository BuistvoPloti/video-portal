const app = require("./app");
const { createTables } = require("./db/postgresql/create-tables");
const pool = require('./db/postgresql').connectionPool;
const { application: { port } } = require('./config');
const { log } = require('./utils/logger');

if (process.env.NODE_ENV === 'dev') {
  createTables(pool).then();
}

app.listen(port, () => {
  log(`Application ${app.name} is running on ${app.url}`);
});
