#!/usr/bin/env bash

[ -n "$GO_DEBUG" ] && set -x
set -e

verbose="no"
offline="no"

[ -n "$GO_DEBUG" ] && verbose="yes"
[ -n "$GO_OFFLINE" ] && offline="yes"

if [[ "$offline" = "no" ]]; then
    echo "Installing bundler."
    if [[ "$verbose" = "yes" ]]; then
        gem install --no-document bundler
    else
        gem install --no-document bundler > /dev/null
    fi

    echo "Installing ruby dependencies."
    if [[ "$verbose" = "yes" ]]; then
        bundle install
    else
        bundle install > /dev/null
    fi
fi

echo "Starting rake."
if [[ "$verbose" = "yes" ]]; then
    time bundle exec rake --verbose "$@"
else
    time bundle exec rake "$@"
fi