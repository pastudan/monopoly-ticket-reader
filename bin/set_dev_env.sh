#!/bin/bash

#for OSX
HOST=$(ipconfig getifaddr en0)

export REACT_APP_SOCKET_URL=ws://${HOST}:3002
export REACT_APP_API_URL=http://${HOST}:3001