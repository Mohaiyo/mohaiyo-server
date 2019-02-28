module.exports = {
  apps: [
    {
      name: 'blogKoa',
      script: './app.js',
      'cwd': './',
      env: {
        'PORT': 3030,
        'NODE_ENV': 'development'
      },
      env_production: {
        'PORT': 3040,
        'NODE_ENV': 'production'
      }
    }
  ]
}