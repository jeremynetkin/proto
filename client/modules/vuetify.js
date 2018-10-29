export default function (moduleOptions) {
    this.addPlugin({
        src: path.resolve(__dirname, 'plugin.js'),
        fileName: 'vuetify.js',
        options: moduleOptions // <-- Here we pass them
    })
}