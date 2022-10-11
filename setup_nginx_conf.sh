#!/usr/bin/env bash

input_file="/home/user/nginx.conf"
output_file="/etc/nginx/nginx.conf"

nginx_config=`cat $input_file`

if [[ -v FLOWIFY_AUTH_TOKEN ]];
then
    flowify_token_auth="proxy_set_header Authorization '$FLOWIFY_AUTH_TOKEN';\n            proxy_pass_header Authorization;"
    nginx_config=$(sed "/# flowify_token_auth/a \            $flowify_token_auth" <<< $nginx_config)
fi

envsubst '$FLOWIFY_SERVER_PORT $FLOWIFY_SERVER_HOST' <<< $nginx_config > $output_file

echo done