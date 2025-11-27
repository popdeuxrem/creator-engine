module.exports = {
  apps: [
    {
      name: "creator-engine-api",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
