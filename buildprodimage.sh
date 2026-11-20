#!/bin/bash
tag=$1
docker build -t "ghcr.io/${tag}:latest" .
docker push "ghcr.io/${tag}:latest"
