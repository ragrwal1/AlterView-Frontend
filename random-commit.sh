#!/bin/bash

# Array of fun, random commit messages
MESSAGES=(
  "🚀 To infinity and beyond!"
  "🔧 Fixed that thing nobody noticed"
  "✨ Magic happened here"
  "🐛 Squashed a bug that was hiding in plain sight"
  "🎨 Made it pretty"
  "📝 Updated documentation because I'm nice"
  "🔥 Removed code that was on fire"
  "🧪 This might work, who knows?"
  "🤖 Robots wrote this code"
  "🍕 Late night coding with pizza"
  "💤 Commit made while half asleep"
  "🎯 Hit the target this time"
  "🧩 Puzzle pieces coming together"
  "🌈 Added some color to the codebase"
  "⚡ Performance improvements"
  "🧹 Cleaned up the mess"
  "🎁 Surprise feature!"
  "🔍 Found the needle in the haystack"
  "🏗️ Work in progress, but it's worth committing"
  "🌟 This is my best work yet"
)

# Get a random message from the array
RANDOM_INDEX=$((RANDOM % ${#MESSAGES[@]}))
COMMIT_MESSAGE="${MESSAGES[$RANDOM_INDEX]}"

# Add all changes
git add .

# Commit with the random message
git commit -m "$COMMIT_MESSAGE"

git push

# Display the commit message that was used
echo "Committed with message: $COMMIT_MESSAGE"

# Optional: Push to remote (uncomment if you want automatic pushing)
# git push 