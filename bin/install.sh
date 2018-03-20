#!/bin/bash

# fetch code
git clone https://github.com/pastudan/monopoly-ticket-reader.git
cd monopoly-ticket-reader

# add node to repo list
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

# add yarn to repo list
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

# install dependencies
sudo apt-get update
sudo apt-get install -y nodejs redis-server yarn virtualenv postgresql

# install app
yarn

# install pm2, our process daemonizer
sudo yarn global add pm2

# setup virtual environment for the image processor
virtualenv image-processor/venv
source image-processor/venv/bin/activate
pip install -r image-processor/requirements.txt
deactivate

# setup virtual environment for tensorflow
virtualenv -p python3 tensorflow-imagenet/venv
source tensorflow-imagenet/venv/bin/activate
pip install -r tensorflow-imagenet/requirements.txt
deactivate

# start backend scripts, passing environment variables
sudo --preserve-env pm2 start ecosystem.config.js

# generate a startup script for pm2 to persist through reboots
sudo pm2 startup