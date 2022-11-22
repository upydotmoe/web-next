module.exports = {
  apps: [
    {
      name: 'upy-web',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      args: 'start'
    }
  ]
}