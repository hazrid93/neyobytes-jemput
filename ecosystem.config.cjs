module.exports = {
  apps: [
    {
      name: 'jemput-api',
      script: 'server/index.js',
      cwd: '/home/debian/neyobytes-jemput',
      node_args: '--experimental-modules',
      env: {
        NODE_ENV: 'production',
      },
      // Auto restart
      watch: false,
      max_memory_restart: '256M',
      // Logging
      error_file: '/home/debian/.pm2/logs/jemput-api-error.log',
      out_file: '/home/debian/.pm2/logs/jemput-api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // Restart policy
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
    },
  ],
};
