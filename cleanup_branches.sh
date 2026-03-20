#!/bin/bash

# Script to clean up all local git branches except main in svelte_ui

set -e  # Exit on error

echo "========================================="
echo "Svelte UI - Git Branch Cleanup"
echo "========================================="
echo ""

# Get current branch
current_branch=$(git branch --show-current)

# Count branches (excluding main and current)
branch_count=$(git branch | grep -v "^\*" | grep -v "main" | wc -l)

echo "Current branch: $current_branch"
echo "Branches to delete: $branch_count"
echo ""

if [ "$branch_count" -eq 0 ]; then
    echo "✅ No branches to delete"
    exit 0
fi

# Show branches that will be deleted
echo "Branches that will be deleted:"
git branch | grep -v "^\*" | grep -v "main"
echo ""

# Confirm before proceeding
read -p "Continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 0
fi

# Switch to main if not already there
if [ "$current_branch" != "main" ]; then
    echo "⚠️  Switching to main branch first..."
    git checkout main
fi

# Delete all branches except main
echo "🗑️  Deleting branches..."
git branch | grep -v "^\*" | grep -v "main" | xargs -r git branch -D

echo ""
echo "✅ Cleanup complete!"
echo "========================================="
