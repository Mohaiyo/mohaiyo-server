# 发布
rsync -cavzP  ./ --exclude-from='.rsync-exclude' root@47.107.171.59:/home/blogKoa
ssh root@47.107.171.59 "\
cd /home/blogKoa; 
npm install; \
sh deploy.sh; \
"
