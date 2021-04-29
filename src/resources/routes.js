module.exports = {
  routes: {
    users: {
      index: "/users",
      findById: "/users/:id",
      signUp: "/users/signup",
      signIn: "/users/signin",
    },
    videos: {
      index: "/videos",
    }
  }
}
