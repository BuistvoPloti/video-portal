module.exports = {
  routes: {
    users: {
      index: '/users',
      findById: '/users/:id',
      signUp: '/users/signup',
      signIn: '/users/signin',
      verify: '/users/verify/:code',
      findVideos: '/users/:id/videos'
    },
    videos: {
      index: '/videos',
      findById: '/videos/:id',
    },
    swagger: {
      index: '/api-docs'
    },
    graphql: {
      index: '/graphql',
      graphiql: '/graphiql'
    },
    auth: {
      index: '/auth',
      twoFactorAuth: '/auth/2fa/authenticate',
      twoFactorGenerate: '/auth/2fa/generate'
    }
  }
};
