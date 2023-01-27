module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-param-reassign': 'off',
    'prefer-destructuring': ['error', { object: true, array: false }],
    'no-confusing-arrow': 'off',
    'react/forbid-prop-types': 'off',
    'no-plusplus': 'off',
  },
};
