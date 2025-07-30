#!/bin/sh

# ---------------------------------------------------------------------------
# modify these config for the target project
ServerAddress=root@123.57.244.47
DeployDirectoryPath=/zhongyi-lottery/web
# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------
# https://blog.csdn.net/huang0700340204/article/details/113841225
# source ~/.nvm/nvm.sh
# nvm use 18.15.0
npm install
npm run build

cd ./dist
zip -r ./dist.zip ./*

ssh ${ServerAddress} "mkdir -p $DeployDirectoryPath"
scp -r ./dist.zip ${ServerAddress}:${DeployDirectoryPath}
rm ./dist.zip
ssh ${ServerAddress} "cd $DeployDirectoryPath && unzip -o dist.zip"
## ---------------------------------------------------------------------------
