#!/bin/bash

# Small script to get melonJS all set up
# Created Nov 6, 2012
# By: Zachary Massia

echo :: Fetching melonJS repo
git submodules init
git submodules update

echo :: Installing..
cd lib/melonjs
npm install -d
cake build:browser


