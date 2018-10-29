import shortid from 'shortid'

import { PubSub } from 'graphql-subscriptions';
import { GraphQLUpload } from 'apollo-server';
import fs from 'fs'
import mkdirp from 'mkdirp'

export const pubsub = new PubSub();

const UPLOAD_DIR = './uploads'

const posts = []
const uploads = []
const POST_ADDED = 'POST_ADDED';
const POST_UPDATED = 'POST_UPDATED';
const stream = require('stream');


mkdirp.sync(UPLOAD_DIR)


const resolvers = {
    Upload: GraphQLUpload,
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
        uploads: () => uploads
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
        async singleUpload(parent, { file }) {
            const { stream, filename, mimetype, encoding } = await file;

            console.log('File name :'+filename);

            const { id, path } = await storeFS({ stream, filename })

            let generatedId = shortid.generate();
            const upload = {
                id,
                path,
                filename,
                mimetype,
                encoding

            }
            uploads.push(upload)

            return upload;
        }
    },
}

const storeFS = ({ stream, filename }) => {
    mkdirp.sync(UPLOAD_DIR)
    const id = shortid.generate()
    const path = __dirname +`/${UPLOAD_DIR}/${id}-${filename}`
    return new Promise((resolve, reject) =>
        stream
            .on('error', error => {
                if (stream.truncated)
                // Delete the truncated file
                    fs.unlinkSync(path)
                reject(error)
            })
            .pipe(fs.createWriteStream(path))
            .on('error', error => reject(error))
            .on('finish', () => resolve({ id, path }))
    )
}

export {resolvers}