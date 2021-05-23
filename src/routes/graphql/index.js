const { graphqlRestify, graphiqlRestify } = require('apollo-server-restify');
const graphqlRouteNamings = require('../../resources/routes.js').routes.graphql;
const { auth } = require('../../middlewares/auth');
const { hasAdminRole } = require('../../middlewares/has-admin-role');
const { isSecondFactorAuthenticated } = require('../../middlewares/two-factor-auth-pass');

const contextExtender = (req, graphQLOptions) => {
  return {
    ...graphQLOptions,
    context: {
      req: req,
    },
  };
};

const graphqlRoutes = (server, graphQLOptions) => {
  server.post(graphqlRouteNamings.index,
    graphqlRestify(req => contextExtender(req, graphQLOptions)));
  server.get(graphqlRouteNamings.index,
    auth,
    isSecondFactorAuthenticated,
    hasAdminRole,
    graphqlRestify(req => contextExtender(req, graphQLOptions)));
  server.get(graphqlRouteNamings.graphiql, graphiqlRestify(
    {
      endpointURL: graphqlRouteNamings.index
    }
  ));
};

module.exports = graphqlRoutes;
