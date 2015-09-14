#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# This script runs after `gulp dist`. The deployment files are in dist/sample.

if [[ "$TRAVIS_BRANCH" == "master" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
  pushd dist/sample
  sed -i -e 's/baseURL: "\/"/baseURL: "\/aurelia-pagination\/"/' config.js
  git init

  # inside this git repo we'll pretend to be a new user
  git config user.name "Travis CI"
  git config user.email "alxandr@alxandr.me"

  # The first and only commit to this new Git repo contains all the
  # files present with the commit message "Deploy to GitHub Pages".
  git add .
  git commit -m "Deploy to GitHub Pages"

  # Force push from the current repo's master branch to the remote
  # repo's gh-pages branch. (All previous history on the gh-pages branch
  # will be lost, since we are overwriting it.) We redirect any output to
  # /dev/null to hide any sensitive credential data that might otherwise be exposed.
  git push --force --quiet "https://${GH_TOKEN}@github.com/${GH_REPO}.git" master:gh-pages > /dev/null 2>&1
  popd
else
  if [[ "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    echo "Skipping deployment because it's a pull request"
  else
    echo "Skipping deployment because it's not master branch"
  fi
fi
