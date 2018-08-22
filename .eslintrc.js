module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'airbnb-base',
        'plugin:vue/essential'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here
    rules: {},
    globals: {
        "jest": true,
        "expect": true,
        "mockFn": true,
        "config": true,
        "afterEach": true,
        "beforeEach": true,
        "describe": true,
        "it": true,
        "runs": true,
        "waitsFor": true,
        "pit": true,
        "require": true,
        "xdescribe": true,
        "xit": true
    }
}
