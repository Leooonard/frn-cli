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

exit 0
