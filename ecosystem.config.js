module.exports = {
  apps: [
    {
      name: 'upy-web',
      script: './.output/server/index.mjs',
      watch: false,
      exec_mode: 'cluster',
      instances: 'max',
      args: 'start',
      max_memory_restart: '512M',
      listen_timeout: 3000,
      kill_timeout: 6000,
      combine_logs: true
    }
  ]
}