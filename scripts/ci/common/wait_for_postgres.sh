[ -n "$DEBUG" ] && set -x
set -e
set -o pipefail

dockerize -wait tcp://localhost:5432 -timeout 1m
