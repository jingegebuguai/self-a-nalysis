#!/bin/bash

#Author: shaohuimeng
#Date: 2017/12/9
#Description: 部署脚本：将编译后文件拷贝至静态资源服务器

APP_DIR_PROD="/home/uaa/prog/self-analysis-frontend"
APP_DIR_TEST="/home/uaa/prog/self-analysis-frontend-test"
#静态文件目标机器
APP_USER_HOST="root@10.121.86.35" #目标机器需添加 public_key

CALLER=`basename $0`
SOURCE_DIR=$(cd `dirname $0`; cd ..; pwd)
cd ${SOURCE_DIR}

echo "whoami: $(whoami)"

usage(){
    echo "USAGE: $CALLER [test|prod]"
}

build(){
    yarn config set registry 'https://registry.npm.taobao.org'
    yarn install --pure-lockfile
    if [ $? -ne 0 ]; then
        echo "==> error when downloading dependencies."
        exit -1
    fi
    echo "==> download success."

    if [ "$1" == "prod" ]; then
        echo "==> start to build: env=prod"
        npm run build_prod
        if [ $? -ne 0 ]; then
            echo "==> error when building."
            exit -1
        fi
    elif [ "$1" == "test" ]; then
        echo "==> start to build: env=test"
        npm run build_test
        if [ $? -ne 0 ]; then
            echo "==> error when building."
            exit -1
        fi
    fi

    echo "==> build success."
}

copy_file(){
    if [[ "$#" -ne 1 ]]; then
        usage
        break
    fi

    local app_dir=""
    if [[ "$1" == "test" ]]; then
        app_dir=${APP_DIR_TEST}
    elif [[ "$1" == "prod" ]]; then
        app_dir=${APP_DIR_PROD}
    fi

    scp -rvC "dist" "${APP_USER_HOST}:${app_dir}"
    if [ $? -ne 0 ]; then
        echo "==> error when copying to ${APP_USER_HOST}:${app_dir}."
        exit -1
    fi
    echo "==> app copied to ${APP_USER_HOST}:${app_dir}."
}

main() {
    if [[ "$#" -ne 1 ]] || [[ "$1" != "test" && "$1" != "prod" ]]; then
        usage
        exit -1
    fi
    build "$1"
    copy_file "$1"
}
main "$@"