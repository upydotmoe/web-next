module.exports = {
  apps: [
    {
      name: 'upy-web',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      watch: false,
      autorestart: true,
      args: 'start',
      max_memory_restart: '4G',
      listen_timeout: 3000,
      kill_timeout: 8000,
      combine_logs: true,
      env: {
        NODE_ENV: 'production',
        PORT: '3000'
      }
    }
  ]
}
