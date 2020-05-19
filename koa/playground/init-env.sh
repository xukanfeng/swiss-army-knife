echo "init server env..."

if [ `ps -ef|grep redis-server|wc -l` -eq 1 ]
then
  echo "starting redis server..."
  redis-server &
  sleep 2s
fi