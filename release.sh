# 发布
rsync -cavzP  ./ --exclude-from='.rsync-exclude' root@47.107.171.59:/home/wechat-koa
ssh root@47.107.171.59 "\
cd /home/wechat-koa; 
npm install; \
sh deploy.sh; \
"
