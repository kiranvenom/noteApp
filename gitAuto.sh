#!/bin/bash

# Prompt for additional commit message input
read -p "Enter commit message: " COMMIT_MESSAGE

# Perform Git commands
git add .
git commit -m "${COMMIT_MESSAGE}"
git push origin main

echo "Commit fe: ${COMMIT_MESSAGE} pushed to origin main."