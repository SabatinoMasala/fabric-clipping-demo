yarn build
git add . && git commit -m "bump version"
git push github master
git push github `git subtree split --prefix dist master`:gh-pages --force