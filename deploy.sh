#!/bin/bash

. ~/.nvm/nvm.sh
nvm use 6
hexo clean
hexo generate
rm -rf ~/nets/daiyitastic.github.io/blog/*
cp -r ~/nets/hexo-blog/public/* ~/nets/daiyitastic.github.io/blog
