<template>
    <section class="container">
        <div>
            <app-logo/>
            <h1 class="title">
                proto 2
            </h1>


            <!-- Tchat example -->
            <ApolloQuery
                    :query="require('../graphql/post/Post.gql')"
            >
                <ApolloSubscribeToMore
                        :document="require('../graphql/post/PostAdded.gql')"
                        :update-query="onPostAdded"
                />
                <div slot-scope="{ result: { data } }">
                    <template v-if="data">


                        <v-list two-line subheader>
                            <v-subheader inset>Folders</v-subheader>

                            <v-list-tile
                                    v-for="post of data.posts"
                                    :key="post.id"
                            >

                                <v-list-tile-content>
                                    <v-list-tile-title>{{ post.title }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ post.content }}</v-list-tile-sub-title>
                                </v-list-tile-content>

                                <v-list-tile-action v-if="post.published">
                                    <v-btn icon ripple @click="publishMessage(post,false)" color="warning"
                                            dark>
                                        <v-icon color="white">block</v-icon>
                                    </v-btn>
                                </v-list-tile-action>
                                <v-list-tile-action v-else>
                                    <v-btn icon ripple @click="publishMessage(post,true)" color="success" dark>
                                        <v-icon color="white">check_circle</v-icon>
                                    </v-btn>
                                </v-list-tile-action>
                                <v-list-tile-action>
                                    <v-btn icon ripple @click="deleteMessage(post)" color="error" dark>
                                        <v-icon color="white">delete</v-icon>
                                    </v-btn>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>


                        <!--<div
                                v-for="post of data.posts"
                                :key="post.id"
                                class="message"
                        >
                            <span class="the-message">{{ post.title }} (ID: {{post.id}})</span>
                            <span class="post-status status-published btn">{{ post.p }} (ID: {{post.id}})</span>&nbsp;
                            <v-btn   @click="publishMessage(post,false)" color="error" v-if="post.published" dark>Dépublier
                                <v-icon dark right>block</v-icon>
                            </v-btn>
                            <v-btn  @click="publishMessage(post,true)" color="success" v-else dark>Publier
                                <v-icon dark right>check_circle</v-icon>
                            </v-btn>

                            <v-btn  @click="deleteMessage(post)" color="error" dark>Supprimer
                                <v-icon dark right>delete</v-icon>
                            </v-btn>
                        </div>-->

                    </template>
                </div>
            </ApolloQuery>

        </div>
    </section>
</template>

<script>
    import AppLogo from '~/components/AppLogo.vue'
    import gql from 'graphql-tag'
    import NkCard from '~/components/ui/NkCard.vue'

    export default {
        components: {
            AppLogo,
            NkCard
        },
        methods: {
            onPostAdded(previousResult, {subscriptionData}) {

                return {
                    posts: [
                        ...previousResult.posts,
                        subscriptionData.data.postAdded,
                    ],
                }
            },
            deleteMessage(post) {
                if (!confirm('Do you realy want to delete this message ?')) return;
                this.$apollo.mutate({
                    mutation: gql`
                        mutation deletePost($postID: ID!) {
                              deletePost(id: $postID) {
                                id
                                title
                                content
                                published
                              }
                            }
                        `,
                    variables: {
                        postID: post.id,
                    },
                    update: (store, {data: {deletePost}}) => {
                        const postsQuery = gql`
                        {
                            posts {
                                    id
                                    title
                                    content
                                    published
                                }
                            }
                        `

                        const data = store.readQuery({query: postsQuery}); // the GraphQL query is returned by the function fooQuery

                        const index = data.posts.findIndex(function (fetchedPost) {
                            return fetchedPost.id === post.id;
                        });
                        if (index > -1) {
                            data.posts.splice(index, 1);
                        }
                        store.writeQuery({query: postsQuery, data});
                    }
                })
            },
            publishMessage(post, published) {
                this.$apollo.mutate({
                    mutation: gql`
                        mutation publish($postID: ID!, $published: Boolean!) {
                              publish(id: $postID, published: $published) {
                                id
                              }
                            }
                        `,
                    variables: {
                        postID: post.id,
                        published: published
                    },
                    update: (store, {data: {deletePost}}) => {
                        const postsQuery = gql`
                        {
                            posts {
                                    id
                                    title
                                    content
                                    published
                                }
                            }
                        `
                        const data = store.readQuery({query: postsQuery}); // the GraphQL query is returned by the function fooQuery
                        console.log(data);

                        const index = data.posts.findIndex(function (fetchedPost) {
                            return fetchedPost.id === post.id;
                        });

                        data.posts[index].published = published

                        store.writeQuery({query: postsQuery, data});
                    }
                })
            }
        },
    }
</script>

<style scoped>
    .container {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .title {
        font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
        display: block;
        font-weight: 300;
        font-size: 100px;
        color: #35495e;
        letter-spacing: 1px;
    }

    .subtitle {
        font-weight: 300;
        font-size: 42px;
        color: #526488;
        word-spacing: 5px;
        padding-bottom: 15px;
    }

    .links {
        padding-top: 15px;
    }

    .delete-message-btn {
        color: red;
        cursor: pointer;
    }

</style>

