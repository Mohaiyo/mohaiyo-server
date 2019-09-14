# 发布
rsync -cavzP  ./ --exclude-from='.rsync-exclude' root@10.10.10.10:/home/blogKoa
ssh root@10.10.10 "\
cd /home/blogKoa; 
npm install; \
sh deploy.sh; \
"
