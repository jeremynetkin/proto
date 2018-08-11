import shortid from 'shortid'

import { PubSub } from 'graphql-subscriptions';
export const pubsub = new PubSub();

const posts = []
const POST_ADDED = 'POST_ADDED';
const POST_UPDATED = 'POST_UPDATED';

const resolvers = {
    Subscription: {
        postAdded: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe:  (parent, args) => pubsub.asyncIterator([POST_ADDED]),
        },
        postUpdated: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe:  (parent, args) => pubsub.asyncIterator([POST_UPDATED]),
        },
    },
    Query: {
        description: () => `This is the API for a simple blogging application`,
        posts: () => posts,
        post: (parent, args) => posts.find(post => post.id === args.id),
    },
    Mutation: {
        createDraft: (parent, args, context) => {
            let generatedId = shortid.generate();
            const post = {
                id: generatedId,
                title: args.title + ' ' + generatedId,
                content: args.content,
                published: false,
            }
            posts.push(post)

            pubsub.publish(POST_ADDED, { postAdded: post });
            return post
        },
        deletePost: (parent, args, context) => {
            const postIndex = posts.findIndex(post => post.id === args.id)

            if (postIndex > -1) {
                const deleted = posts.splice(postIndex, 1)
                return deleted[0]
            }
            return null
        },
        publish: (parent, args) => {
            const postIndex = posts.findIndex(post => post.id === args.id)
            posts[postIndex].published = args.published
            pubsub.publish(POST_UPDATED, { postAdded: posts[postIndex] });
            return posts[postIndex]
        },
    },
}

export {resolvers}