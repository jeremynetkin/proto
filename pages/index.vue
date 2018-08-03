<template>
    <section class="container">
        <div>
            <app-logo/>
            <h1 class="title">
                proto
            </h1>
            <div>
                <v-btn color="success">Success</v-btn>
                <v-btn color="error">Error</v-btn>
                <v-btn color="warning">Warning</v-btn>
                <v-btn color="info">Info</v-btn>
            </div>
            <nk-card
                    src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
                    title="Kangaroo Valley Safari"
                    content="Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ..."
                    withCardAction
                    :cardActions="[{title: 'Share'}, {title: 'Explore'}]"
            ></nk-card>


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
                        <div
                                v-for="post of data.posts"
                                :key="post.id"
                                class="message"
                        >
                            <span class="the-message">{{ post.title }} (ID: {{post.id}})</span> &nbsp;
                            <span @click="deleteMessage(post)" class="delete-message-btn">x</span>
                        </div>

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
            deleteMessage(post){
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
                    update: (store, { data: { deletePost } }) => {
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

                        const data = store.readQuery({query: postsQuery }); // the GraphQL query is returned by the function fooQuery

                        const index = data.posts.findIndex(function (fetchedPost) {
                            return fetchedPost.id === post.id;
                        });
                        if (index > -1) {
                            data.posts.splice(index, 1);
                        }
                        store.writeQuery({ query: postsQuery, data });
                    }
                })
            }
        },
    }
</script>

<style>
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

    .delete-message-btn{
        color:red;
        cursor: pointer;
    }

</style>

