<template>
    <div>
        <upload-button title="Browse" :selectedCallback="onFileSelected">
        </upload-button>
        <v-btn @click="uploadSelectedFile">test</v-btn>

    </div>
</template>

<script>

    import gql from 'graphql-tag'
    import UploadButton from './UploadButton';

    export default {
        name: 'nkupload',
        data() {
            return {
                selectedFile: {emptyFileTest:'emptyFileTest'}
            }
        },
        components: {
            UploadButton
        },
        methods: {
            onFileSelected(event) {
                console.log(event);
                this.selectedFile = event

            },
            uploadSelectedFile() {
                this.$apollo.mutate({
                    mutation: gql`
                              mutation singleUpload($file: Upload!) {
                                singleUpload(file: $file) {
                                  filename
                                }
                              }
                            `,
                    variables: {
                        file: this.selectedFile
                    },
                    update: (store, {data: {updatedata}}) => {
                        console.log('upload mutation callback debug')
                        console.log(store)
                        console.log(updatedata)
                    }
                })
            }
        }
    }

</script>

<style>

</style>