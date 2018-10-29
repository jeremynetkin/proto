<template>
    <v-layout>
        <v-flex xs12 sm10>
            <v-card>
                <v-card-media
                        :src="src"
                        height="200px"
                ></v-card-media>

                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0">{{title}}</h3>
                        <div v-html="content"></div>
                    </div>
                </v-card-title>

                <v-card-actions v-if="withCardAction">
                    <v-btn v-for="action in cardActions" :key="action.title"  color="primary">{{ action.title }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        props: {
            src: String,
            title: String,
            content: String,
            withCardAction: Boolean,
            cardActions: Array

        },
        created(){
            console.log(this.cardActions);
        }
    }
</script>

<style scoped>

</style>