<!-- git reset --hard HEAD^  回退到上一个版本 如果想回退多个版本就在后面加 ^,  -->
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

 d69e0776d43f28976339a845e522583b77f42702
git log 查看历史记录

git diff '你修改的文件文件名'   查看修改内容

rm 'fileName' 删除文件

mkdir fileName  创建一个文件夹


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
    git push --set-upstream origin (远端分支名)  本地分支第一次往远端提交

 ###撤销本地修改###
    未使用git add 缓存代码时
        git checkout -- filePathName 例如: git checkout -- readme.md
        git checkout . 丢弃所有文件
    已使用git add 缓存代码时
        git reset HEAD filepathname 例如: git reset HEAD readme.md
        git reset HEAD . 撤销所有文件

###mock 数据 起json server, 要cd 到mock 文件下
json-server --watch --port 3000 mock.js

###git tag###
    git tag 查看所有的tag
    git tag [tagName] 创建一条简单的tag
    git tag -a [tagName] -m ['备注信息']  创建一条带备注的tag
    git show [tagName]  查看tag 的详细信息（包括commit号等）
    git tag -a [tabName] [commit号] -m ["tag备注"]  给具体的每个commit打tag
    git push origin [tagName] 推送单个分支到远端
    git push origin --tags 推送本地所有tag 到远端
    git checkout [tagName]  切换tag
    git tag -d [tagName] 删除本地 tag
    git push origin :refs/tags/[tagName] 删除远端tag

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
````
###查看一下当前源
yarn config get registry

###切换为淘宝源
yarn config set registry https://registry.npm.taobao.org

###或者切换为自带的
yarn config set registry https://registry.yarnpkg.com

<!-- yarn 命令 -->
yarn install,    yarn run serve,    yarn run build,    yarn ren test,    yarn run lint


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


    npm canmad

    npm install --production // 只安装devDependencie 中的依赖

    npm uninstall gulp --save-dev
    npm remove gulp --save-dev

    npm install lodash@4.17.3  安装具体版本的依赖 

    dependencies: {
        ladash: ^4.17.3  锁定第二位最新
        ladash: ~4.17.3 锁定 第三位最新
        ladash: '*' 现在最新版本
        ladash: 4.17.3 固定版本
    }

    npm install live-server -g  安装
    npm root -g  查看全局依赖
    npm remove -g live-server  卸载

    npm list  查看 node_modules 
    npm list --depth 0 node_modules展开到一级
###查看 是否使用npm 安装过 pluginName 插件, 返回版本号
    npm pluginName -v  



微信git命令
    git全局设置
        git config --global user.name  "李文"
        git config --global user.email "oncwnuCobIm37YP_0TuqLbbLphyE@git.weixin.qq.com"
    创建一个新的版本库
        git clone https://git.weixin.qq.com/mengmenglove/WebChartLearnProject.git
        cd WebChartLearnProject
        touch README.md
        git add README.md
        git commit -m "add README"
        git push -u origin master
    现有的文件夹或Git版本库
        cd existing_folder
        git init
        git remote add origin https://git.weixin.qq.com/mengmenglove/WebChartLearnProject.git
        git add .
        git commit
        git push -u origin master
    git设置本地分支跟踪远程分支的几种方法
        1. git  checkout -b brach-name origin/branch-name 
        2. git branch --set-upstream branch-name  origin/branch-name
        3.git branch -u origin/branch-name



 远程桌面
    cd/data/staticresources/bim5d-cost/modules/commerce/