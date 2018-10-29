import {gql} from 'apollo-server-express'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Upload
  type Subscription {
    postAdded: Post,
    postUpdated: Post
  }
  type Query {
    hello: String
    posts: [Post!]!
    post(id: ID!): Post
    description: String
    uploads: [File]
    }
  type Mutation {
      createDraft(title: String!, content: String): Post
      deletePost(id: ID!): Post
      publish(id: ID!, published: Boolean!): Post
      singleUpload(file: Upload!): File!
  }
  
  type Post {
      id: ID!
      title: String!
      content: String!
      published: Boolean!
    }
    
    type File {
    filename: String!
    mimetype: String!
    encoding: String!
    path: String!
    }
`;

export {typeDefs}