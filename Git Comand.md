git reset --hard HEAD^  回退到上一个版本 如果想回退多个版本就在后面加 ^, 
例如 git reset --hard HEAD^^ 回退两个版本
git reset --hard 1000  回退到指定版本
###方法一： 首选
git revert HEAD
git push origin master
revert是放弃指定提交的修改，但是会生成一次新的提交，需要填写提交注释，以前的历史记录都在

git revert commitID  回滚到指定版本
###方法二：
git reset --hard HEAD^
git push origin master -f
reset是指将HEAD指针指到指定提交，历史记录中不会出现放弃的提交记录。


git log 查看历史记录

git diff '你修改的文件文件名'   查看修改内容

rm 'fileName' 删除文件

mkdir fileName  创建一个文件夹

git push --set-upstream origin (远端分支名)  本地分支第一次往远端提交
git branch  查看本地分支
git branch -a  查看全部分支

git branch '新分支名称'  创建新分支

git checkout -b '新分支名称'  创建&切换到新分支

git branch -D '要删除的本地分支'  删除本地分支
git push origin :要删除的远端分支  删除远端分支


ssh-keygen -t rsa -C 1000000@qq.com  生成ssh key 然后copy 到 自己的gitHub--setting--SSH和GPG 密钥里

git config --global user.name '自己的gitHub名称'
git config --global user.email '自己的gitHub验证邮箱'

pwd 显示当前文件的路径
git add .  提交全部修改的文件到暂存区
git add 'fileName'  提交单个文件到暂存区

git commit -m '此次操作的信息' 提交到本地仓库
git push 推送到当前分支的远端

###mock 数据 起json server, 要cd 到mock 文件下
json-server --watch --port 3000 mock/mock.js

###安装淘宝镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org

###修改 下载仓库为淘宝镜像
npm config set registry http://registry.npm.taobao.org/

###如果要发布自己的镜像需要修改回来
npm config set registry https://registry.npmjs.org/

###部门内部私服镜像
npm set registry http://10.129.56.220:4873
npm set registry ry http://10.129.56.220:4873
###升级部门公共插件
npm update @bim5d/common-components


###yarn 命令
###查看一下当前源
yarn config get registry

###切换为淘宝源
yarn config set registry https://registry.npm.taobao.org

###或者切换为自带的
yarn config set registry https://registry.yarnpkg.com

<!-- yarn 命令 -->
yarn install

yarn run serve

yarn run build

yarn ren test

yarn run lint

liww820925


###移动端测试

```weinre   web inspector remote```
安装   npm install weinre -g
运行   weinre --httpPort 8080 --boundHost -all-

在 index.html 中添加 钩子 
让电脑和手机处于同一个网段 就可以用手机访问项目

修改webpack
    devServer: {
        host: ''
    }
```debuggap```
www.debuggap.com
下载安装 软件  并且把debuggap.js 存放到项目中，然后再引入 index.html 中

打开工具 ---> web调试工具---> 调试H5---> 点击蓝色小方块---> 在大方块中的config 中输入ip


###测试环境 发版
10.0.197.96   
用户名：root
密码：www.zx.c0m

44环境项目目录：
cd /opt/bim5d/bim5d-web/modules/commerce

上传文件：
rz -y

删除文件 递归删除：
rm -rf enterprise

解压到当前文件夹：
unzip dist.zip -d .  / unzip -o dist.zip -d .

重命名为：
mv old enterprise

pwd 查看当前路径


npm set registry http://10.129.56.220:4873
rm -rf  /root/.tmp/platform-commerce-enterprise



6225 7583 1927 0558