// 将dist目录放在koa public目录下，就能通过koa加载页面
*create link
ln -s  ~/GitHub/swiss-army-knife/koa/playground ~/GitHub/swiss-army-knife/www/
mv playground server
ln -s  ~/GitHub/swiss-army-knife/vue/playground/dist ~/GitHub/swiss-army-knife/www/server/public/

*delete link
unlink ~/GitHub/swiss-army-knife/www/server

*nginx
// 在nginx.conf中添加代理配置，就能从nginx 8080端口访问koa 3000端口
/usr/local/etc/nginx/nginx.conf
          location / {
              proxy_pass  http://127.0.0.1:3000;
              root   html;
              index  index.html index.htm;
          }

./nginx -t
./nginx -s reload

