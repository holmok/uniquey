import love from 'eslint-config-love'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      'public',
      'test',
      'tests',
      'tmp',
      '*.js'
    ]
  },
  {
    ...love,
    files: ['**/*.js', '**/*.ts']
  },
  eslintConfigPrettier
]
