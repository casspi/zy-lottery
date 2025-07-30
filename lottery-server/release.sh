#!/bin/bash

FILE_NAME=webshot.tgz
tar -zcvf $FILE_NAME ./*

ServerAddress=root@123.57.244.47
DeployDirectoryPath=/zhongyi-lottery/server

ssh $ServerAddress "mkdir -p $DeployDirectoryPath"
scp $FILE_NAME ${ServerAddress}:${DeployDirectoryPath}
ssh ${ServerAddress} "tar xf ${DeployDirectoryPath}/${FILE_NAME} -C  ${DeployDirectoryPath}"
ssh ${ServerAddress} "cd ${DeployDirectoryPath} && npm i --registry https://registry.npmmirror.com/ && npm run start"
#!/bin/bash

