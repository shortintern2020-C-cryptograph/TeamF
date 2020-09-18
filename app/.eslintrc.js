module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  plugins: ['react', 'prettier'],
  extends: [
    'plugin:react/recommended',
    // 'airbnb',
    // 'plugin:import/errors',
    // 'plugin:import/warnings',
    'prettier',
    'prettier/react'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'warn',
    // suppress errors for missing 'import React' in files
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    // allow jsx syntax in js files (for next.js project)
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }]
  }
}
