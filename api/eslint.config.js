import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    // Déclare l'environnement Node.js → autorise process, console, setTimeout, etc.
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      }
    },
    rules: {
      'no-unused-vars': 'off',   // Désactive la règle "no-unused-vars" pour permettre les variables non utilisées dans le code.
      'no-undef': 'error'
    }
  },
  {
    // Fichiers de test : autorise les globals Jest (describe, it, expect, etc.)
    files: ['tests/**/*.test.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      }
    }
  }
];