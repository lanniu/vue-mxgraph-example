#!/bin/bash

for id in $(docker ps -a |  grep $1  | awk '{print $1}')
do
 docker rm -f $id
done

