#!/bin/bash

# Add all changes
git add .

# Commit changes with descriptive messages
git commit -m "🚀 Feature Updates

✨ Profile Page Updates:
- Redesigned user profile layout for better UX
- Added responsive profile header with gradient banner
- Improved profile photo positioning
- Added edit profile button in top-right corner

🎨 UI Improvements:
- Simplified profile information display
- Added About Me section with fallback text
- Improved interests tags styling
- Updated social media icons layout

🔧 Component Updates:
- Updated UserProfile component structure
- Added EditProfile component with form handling
- Improved AuthenticatedNavbar integration
- Added proper type definitions

♻️ Code Refactoring:
- Cleaned up component structure
- Improved type safety
- Added proper error handling
- Updated API integration

🔒 Auth & Security:
- Added protected routes
- Improved authentication flow
- Added proper route guards
- Updated user session handling

📱 Responsive Design:
- Improved mobile layout
- Better spacing and padding
- Responsive image handling
- Improved button positioning"

# Push to GitHub
git push origin main

echo "✅ Changes have been committed and pushed to GitHub!" 