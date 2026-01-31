# Delete all local branches except main
git branch | grep -v "main" | xargs git branch -D

# Delete all remote branches except main
git branch -r \
| grep -v "main" \
| grep -v "HEAD" \
| sed 's|origin/||' \
| xargs -I {} git push origin --delete {}

