import pluginVue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['dist', '**/dist/**', 'node_modules', '**/node_modules/**'],
  },
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/attributes-order': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]
