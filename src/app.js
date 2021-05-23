const restify = require('restify');
const { makeExecutableSchema } = require('graphql-tools');
const initializeSwagger = require('./utils/swagger-initializer');
const { application: { apiVersion, name } } = require('./config');
const initializeRoutes = require('./routes');
const initializeGraphqlRoutes = require('./routes/graphql');
const gqlOpts = require('./graphql/graphqlSchema');

const server = restify.createServer({
  name: name,
  version: apiVersion
});

initializeRoutes(server);
initializeSwagger(server);

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.pre(restify.pre.sanitizePath());

const schema = makeExecutableSchema({
  typeDefs: gqlOpts.typeDefs,
  resolvers: gqlOpts.resolvers,
});
const graphQLOptions = { schema: schema };
initializeGraphqlRoutes(server, graphQLOptions);

module.exports = server;
