module.exports = {
  apps: [
    {
      name: 'API',
      script: 'api/index.js',
      max_restarts: 10,
      min_uptime: 5000,
      env: {
        "API_PORT": "3001",
        "WS_PORT": "3002",
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z'
    }, {
      name: 'Image Processor',
      script: 'image-processor/scan.py',
      interpreter: 'image-processor/venv/bin/python',
      max_restarts: 10,
      min_uptime: 5000,
      log_date_format: 'YYYY-MM-DD HH:mm Z'
    }, {
      name: 'Model Server',
      script: 'tensorflow-imagenet/scripts/label_image.py',
      interpreter: 'tensorflow-imagenet/venv/bin/python3',
      interpreter_args: '--graph tensorflow-imagenet/tf_files/retrained_graph.pb',
      max_restarts: 10,
      min_uptime: 5000,
      log_date_format: 'YYYY-MM-DD HH:mm Z'
    }
  ],
}
