#!/bin/bash

# Stage and commit auth.ts
git add src/types/auth.ts
git commit -m "refactor(types): update User interface with new socialLinks structure"

# Stage and commit EditProfile.tsx
git add src/components/profile/EditProfile.tsx
git commit -m "refactor(EditProfile): update socialLinks structure to match API requirements"

# Stage and commit SocialMediaSection.tsx
git add src/components/profile/edit-profile/SocialMediaSection.tsx
git commit -m "refactor(SocialMediaSection): align social media property names with backend API"

# Stage and commit auth.service.ts
git add src/services/auth.service.ts
git commit -m "refactor(AuthService): update profile update method to match new DTO structure"

# Stage and commit UserProfile.tsx
git add src/components/profile/UserProfile.tsx
git commit -m "refactor(UserProfile): update social media display with new link structure"

# Stage any remaining changes
git add .
git commit -m "chore: update remaining files for social links refactor"

# Push all changes to remote
git push 