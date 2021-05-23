const gql = require('graphql-tag');
const videoQueries = require('./resolvers/query/video');
const userMutations = require('./resolvers/mutation/user');

const typeDefs = gql`
    type Video {
        video_id: Int
        user_id: Int
        bucket_file_path: String
        source: String
    }
    type User {
        user_id: Int
        username: String
        email: String
        verified: Boolean
        role: String
    }
    input UserInput {
        username: String
        email: String
        password: String
    }
    type Mutation {
        signUp(user: UserInput!): User
    }
    type Query {
        findVideo(id: Int): Video!
        findVideos: [Video!]
    }
`;

const resolvers = {
  Query: {
    ...videoQueries
  },
  Mutation: {
    ...userMutations
  }
};

module.exports = {
  typeDefs,
  resolvers,
};
