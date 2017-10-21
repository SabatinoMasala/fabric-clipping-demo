yarn build
git add . && git commit -m "bump version"
git push github example
git push github `git subtree split --prefix dist example`:gh-pages --force