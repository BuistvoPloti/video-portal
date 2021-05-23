const { log } = require('../utils/logger');

const connectionShutDownStrategies = {
  NewPrismaClient: connectionInstance => (
    connectionInstance.$disconnect()
  ),
  Sequelize: connectionInstance => (
    connectionInstance.close()
  ),
  BoundPool: connectionInstance => (
    connectionInstance.end()
  ),
  noConnection: () => log('No opened connections')
};

const initializeShutDownStrategy = (connectionInstance) => {
  const constructorName = connectionInstance.constructor.name;
  const initialize = connectionShutDownStrategies[constructorName] || connectionShutDownStrategies.noConnection;
  return () => initialize(connectionInstance).then(() => log(`${constructorName} connection closed`));
};

const currentConnection = {
  close: providerInstance => initializeShutDownStrategy(providerInstance)()
};

module.exports = currentConnection;
