#!/usr/bin/env bash

# deploy API
ssh api.scanopoly.com "cd monopoly-ticket-reader && git pull && sudo pm2 kill && sudo --preserve-env pm2 start ecosystem.config.js"

# build and deploy client
REACT_APP_SOCKET_URL=wss://api.scanopoly.com REACT_APP_API_URL=https://api.scanopoly.com yarn build
aws s3 sync build/ s3://scanopoly.com