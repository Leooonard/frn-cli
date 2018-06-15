#!/bin/bash

# 上线后删除pm2 kill
# pm2 kill
pm2 status

# 切换到 bash 执行文件所在的目录
cd `dirname $0`
cd ..
appid=$(basename $(pwd))

cd current
# appname=flighth5-nodeapp-$appid

# oldappname=flightswift

# pm2 delete $oldappname
# pm2 delete $appname

appname=flighth5-flightknr-$appid

pm2 delete $appname

NODE_ENV=production pm2 start index.js -i 4 --name $appname --log-date-format "YYYY-MM-DD HH:mm:ss.SSS"

exit 0
