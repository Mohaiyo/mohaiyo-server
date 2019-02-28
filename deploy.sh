
PIDS=`ps -ef |grep blogKoa |grep -v grep | awk '{print $2}'`
if [ "$PIDS" != "" ]; then
#进程已存在，重新加载进程(重新部署)
pm2 reload blogKoa
else
#进程不存在，即未部署，开始部署
pm2 start ecosystem.config.js --env production
fi