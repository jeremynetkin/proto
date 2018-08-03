import {gql} from 'apollo-server-express'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Subscription {
    postAdded: Post
  }
  type Query {
    hello: String
    posts: [Post!]!
    post(id: ID!): Post
    description: String
    }
  type Post {
      id: ID!
      title: String!
      content: String!
      published: Boolean!
    }
  type Mutation {
      createDraft(title: String!, content: String): Post
      deletePost(id: ID!): Post
      publish(id: ID!): Post
    }
`;

export {typeDefs}