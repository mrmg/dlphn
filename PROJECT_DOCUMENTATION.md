# ThursdayGame - Microsites Collection

A collection of interactive web applications and games hosted on Firebase, featuring multiple microsites with different functionalities including games, utilities, and creative tools.

**🌐 Live URL**: https://dlphn.app
**🔗 Firebase URL**: https://dlphn.app

## ⚠️ Important Deployment Guidelines

**DO NOT deploy after every update!** Firebase has low deployment limits, so please:
1. **Test locally first** using `npm run dev` at `http://localhost:3000`
2. **Only deploy when ready** using `firebase deploy --only hosting`
3. **Batch changes** - make multiple updates before deploying
4. **Monitor usage** - Check Firebase console for remaining deployment quota

This prevents hitting Firebase limits and ensures deployments are available when needed.

## 🏗️ Project Architecture

This project is structured as a **multi-entry point application** with several microsites, each serving different purposes:

## 📁 Project Organization Guidelines

### **For New Microsites:**
1. **Create dedicated directory**: `/project-name/` (e.g., `/monster/`, `/card/`)
2. **Include all project files**:
   - `project-name.html` - Main page
   - `src/` - Project-specific JavaScript
   - `src/services/` - Project-specific services
   - Additional pages as needed
3. **Keep shared code** in root `/src/` directory
4. **Update configurations**:
   - `vite.config.js` - Add entry points
   - `firebase.json` - Add rewrite rules
   - Development server rewrites

### **Directory Structure Template:**
```
project-name/
├── src/                    # Project-specific JavaScript
│   └── services/          # Project-specific services
├── project-name.html      # Main page
├── additional-page.html   # Additional pages
└── assets/                # Project-specific assets (if needed)
```

### **Benefits of This Structure:**
- **Clean separation** of concerns
- **Easy maintenance** and updates
- **Scalable** for multiple projects
- **Clear ownership** of files
- **Reduced conflicts** between projects

### Core Structure
```
ThursdayGame/
├── src/                    # Shared source code and game logic
├── card/                   # Player Card Maker microsite
├── monster/                # Monster Creator microsite
│   ├── src/               # Monster-specific JavaScript
│   │   └── services/      # Monster-specific services
│   ├── monster.html       # Monster Creator page
│   └── gallery.html       # Monster Gallery page
├── functions/             # Firebase Cloud Functions (backend)
├── public/                # Static assets
├── dist/                  # Built files (Firebase hosting target)
├── firebase.json          # Firebase configuration
└── vite.config.js         # Build configuration (JavaScript, not TypeScript)
```

## 🌐 Microsites Overview

### 1. **Player Card Maker** (`/card`)
- **Purpose**: Interactive football/soccer player card generator
- **Features**:
  - Photo upload with background removal
  - Customizable player stats (PAC, SHO, PAS, DRI, DEF, PHY)
  - Position selection (Forward, Midfielder, Defender, Goalkeeper)
  - Country and house selection
  - Real-time card preview with canvas rendering
  - **Download & Auto-Save**: Downloads card image locally and automatically saves a copy to Firebase Storage
  - **Mobile-Optimized**: Smart touch handling allows page scrolling while preserving image editing functionality
- **Tech Stack**: Vanilla JavaScript, Canvas API, Firebase Analytics, Firebase Storage

### 2. **Dolphin Thursday Reminder Generator** (`/ideas`)
- **Purpose**: AI-powered image generation for school activity reminders
- **Features**:
  - Custom memory input for PE, swimming, and homework activities
  - AI-generated artwork using Firebase Cloud Functions
  - Multiple art styles (cartoon, watercolor, digital art, etc.)
  - Social sharing capabilities
- **Tech Stack**: Firebase Functions, AI image generation

### 3. **Horrid Henry Monster Creator** (`/monster`)
- **Purpose**: AI-powered monster creation tool for educational use
- **Location**: `/monster/` directory
- **Files**:
  - `monster.html` - Main creator page
  - `gallery.html` - Monster gallery page
  - `src/monster.js` - Creator functionality
  - `src/gallery.js` - Gallery functionality
  - `src/services/monsterService.js` - API service layer
- **Features**:
  - Text-based monster description input (500 character limit)
  - Speech-to-text input with 30-second timer
  - Standard and Detailed modes for description
  - AI image generation using Vertex AI (Imagen 3.0)
  - Horrid Henry visual style with bright colors and thick outlines
  - Real-time character counting with visual feedback
  - Print-optimized display with custom stylesheet
  - Auto-save descriptions to localStorage
  - Mobile-responsive design with touch-friendly interface
  - Gallery integration for viewing all creations
  - Creator name tracking and display
- **Tech Stack**: Vanilla JavaScript, Firebase Functions, Vertex AI, Firestore, Web Speech API
- **Target Audience**: Teachers and students (ages 6-12)

### 4. **Monster Gallery** (`/monster/gallery`)
- **Purpose**: Display and manage all created monster images
- **Location**: Part of `/monster/` project directory
- **Features**:
  - Responsive grid layout showing all monster creations
  - Modal view with full-size images and student descriptions
  - Recreate functionality to load prompts back into editor
  - Print and download options for individual monsters
  - Admin controls with secret code access ("DolphinY3")
  - Image deletion capabilities for content management
  - Styled prompt display with quotation marks
- **Tech Stack**: Vanilla JavaScript, Firestore, Firebase Storage
- **Admin Features**: Content moderation, image deletion, user management

### 5. **Game Collection Hub** (`/games` or `/`)
- **Purpose**: Central hub for multiple Phaser.js games
- **Features**:
  - Main menu with game selection
  - Hash-based routing system
  - Multiple game modes:
    - **Dolphin Thursday Game**: Interactive reminder game
    - **Tamagotchi Pet**: Virtual pet simulation
- **Tech Stack**: Phaser 3, JavaScript, Firebase

## 🚀 Firebase Hosting Configuration

### Routing Strategy
The project uses Firebase Hosting's advanced routing to create a seamless multi-site experience:

```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/card",
      "type": 302
    }
  ],
  "rewrites": [
    {
      "source": "/ideas",
      "destination": "/ideas.html"
    },
    {
      "source": "/card", 
      "destination": "/card/index.html"
    },
    {
      "source": "/games",
      "destination": "/index.html"
    },
    {
      "source": "/monster",
      "destination": "/monster.html"
    },
    {
      "source": "/gallery",
      "destination": "/gallery.html"
    }
  ]
}
```

### Performance Optimizations
- **Asset Caching**: 1-year cache for images and media files
- **Code Splitting**: Separate chunks for Firebase and Phaser libraries
- **CDN Distribution**: Global Firebase CDN for fast loading

## 🛠️ Development Setup

### Prerequisites
- Node.js 22+
- Firebase CLI
- npm or yarn

### Installation
```bash
# Install root dependencies
npm install

# Install Firebase Functions dependencies
cd functions && npm install && cd ..

# Start development server
npm run dev
```

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy to Firebase
npm run deploy
```

## 🔧 Technical Stack

### Frontend Technologies
- **Build Tool**: Vite 5.1.4
- **Game Engine**: Phaser 3.70.0
- **Language**: JavaScript (ES6+ modules)
- **Styling**: CSS3 with responsive design
- **Canvas**: HTML5 Canvas for card generation

### Backend Services
- **Hosting**: Firebase Hosting
- **Functions**: Firebase Cloud Functions (Node.js 22)
- **Database**: Firestore (for prompt templates and data)
- **Storage**: Firebase Storage (for generated images and card backups)
- **Analytics**: Firebase Analytics

### Development Tools
- **Module Bundling**: Vite with multi-entry configuration
- **Asset Management**: fs-extra for build-time asset copying
- **HTML Processing**: vite-plugin-html for template injection

## 📁 Build Configuration

### Multi-Entry Points
The Vite configuration supports multiple entry points for different microsites:

```typescript
rollupOptions: {
  input: {
    main: resolve(__dirname, 'index.html'),      // Game collection
    ideas: resolve(__dirname, 'ideas.html'),      // Reminder generator
    card: resolve(__dirname, 'card/index.html'),  // Player card maker
    monster: resolve(__dirname, 'monster.html'),  // Monster creator
    gallery: resolve(__dirname, 'gallery.html')   // Monster gallery
  }
}
```

### Code Splitting Strategy
- **Firebase chunk**: Shared Firebase SDK modules
- **Phaser chunk**: Game engine libraries
- **Site-specific chunks**: Individual microsite code

## 🔐 Security & Rules

### Firebase Storage Rules
Updated to support card auto-save while maintaining security:
```javascript
// Allow public read access to all files
match /{allPaths=**} {
  allow read: if true;
}

// Allow write access for card uploads (no authentication required for simplicity)
match /cards/{cardId} {
  allow write: if true;
}

// Allow write access for other microsite content
match /ideas/{imageId} {
  allow write: if true;
}

// Allow write access for monster images
match /monster-images/{monsterId} {
  allow write: if true;
}

// Deny all other writes for security
match /{allPaths=**} {
  allow write: if false;
}
```

### Cloud Functions Security
- Input validation for all function parameters
- Error handling with proper HTTP status codes
- Rate limiting considerations for AI generation

### Firestore Security Rules
Updated to support public read access for gallery functionality:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to monster queries for the gallery
    match /monsterQueries/{document} {
      allow read: if true;
      allow write: if false; // Only Cloud Functions can write
    }
    
    // Allow public read access to memory queries for the ideas page
    match /memoryQueries/{document} {
      allow read: if true;
      allow write: if false; // Only Cloud Functions can write
    }
    
    // Allow public read access to project templates
    match /projectTemplates/{document} {
      allow read: if true;
      allow write: if false; // Only admin can write
    }
    
    // Allow public read access to monster templates
    match /monsterTemplates/{document} {
      allow read: if true;
      allow write: if false; // Only admin can write
    }
    
    // Deny all other reads for security
    match /{document=**} {
      allow read: if false;
      allow write: if false;
    }
  }
}
```

## 💾 Card Download & Auto-Save System

### Overview
The Player Card Maker includes an automatic backup system that works seamlessly with the download functionality:

#### How It Works
1. **User Downloads Card**: User clicks download button as normal
2. **Local Download**: Card image is downloaded to user's device immediately
3. **Silent Backup**: A copy is automatically saved to Firebase Storage in the background
4. **No User Interruption**: The backup process is completely transparent to the user

#### Technical Implementation
- **Dual Action**: Download triggers both local file save and cloud upload
- **Unique Filenames**: Each card gets a timestamped filename for organization
- **Error Handling**: If Firebase Storage fails, download still works normally
- **Silent Operation**: No UI changes or user notifications for the backup process

#### Storage Organization
- **Path**: `/cards/{uniqueCardId}.png`
- **Naming**: `card_{timestamp}_{randomString}.png`
- **Access**: Files are publicly readable for easy retrieval

#### Benefits
- **User Experience**: No change to existing download workflow
- **Backup Safety**: Cards are automatically preserved for users who can't print
- **Admin Access**: You can access all generated cards for printing assistance
- **Reliability**: Download works even if cloud storage fails

## Monster Creator System

### Overview
The Horrid Henry Monster Creator is an AI-powered educational tool that transforms student descriptions into illustrated monsters using the distinctive visual style of the Horrid Henry book series.

### AI Image Generation
- **Engine**: Google Vertex AI (Imagen 3.0)
- **Style**: Horrid Henry cartoon aesthetic with bold outlines and bright colors
- **Prompt Engineering**: Enhanced prompts ensure consistent style and child-appropriate content
- **Safety**: Built-in content filters for educational environments

### Visual Design System
- **Color Palette**: Bright yellow backgrounds, electric blue text, lime green accents
- **Typography**: Bold, hand-drawn sans-serif fonts with thick outlines
- **UI Elements**: Large, chunky buttons with dark outlines for child accessibility
- **Layout**: Uncluttered design focusing on 2-3 key elements maximum

### Gallery & Management
- **Public Gallery**: Displays all created monsters in a responsive grid
- **Modal Views**: Full-size images with student descriptions
- **Admin Controls**: Secret code access ("DolphinY3") for content management
- **Recreate Feature**: Load any prompt back into the editor for modifications
- **Print System**: Styled printouts with quotation-marked prompts

### Educational Features
- **Character Counting**: Real-time feedback to encourage detailed descriptions
- **Auto-Save**: Prevents loss of student work
- **Mobile Optimized**: Touch-friendly interface for tablets and phones
- **Print Ready**: A4-optimized layouts for classroom display

### Technical Architecture
- **Frontend**: Vanilla JavaScript with Firebase SDK
- **Backend**: Cloud Functions with Vertex AI integration
- **Database**: Firestore for monster queries and templates
- **Storage**: Firebase Storage for generated images
- **Security**: Firestore rules for public read access

## 📱 Mobile Touch Optimization

### Problem Solved
The original implementation prevented all page scrolling on mobile devices when touching the canvas, making it difficult for users to scroll through the form controls.

### Solution Implemented
Smart touch event handling that only prevents scrolling when touching interactive areas:

#### Touch Event Logic
- **Image Editing Area**: Touch events prevent scrolling only when touching the photo frame area
- **Flag Area**: Touch events prevent scrolling only when touching the flag for repositioning
- **Pinch-to-Zoom**: Always prevents scrolling (as expected for zoom gestures)
- **Other Areas**: Normal page scrolling is preserved

#### CSS Touch Action
- **Before**: `touch-action: none` (blocked all touch interactions)
- **After**: `touch-action: pan-y pinch-zoom` (allows vertical scrolling and pinch-zoom)

#### Interactive Areas
- **Photo Frame**: `frame.x` to `frame.x + frame.w`, `frame.y` to `frame.y + frame.h`
- **Flag Area**: Dynamic positioning based on flag layout
- **Pinch Gestures**: Two-finger touch anywhere on canvas

### Benefits
- **Better UX**: Users can scroll the page normally on mobile
- **Preserved Functionality**: Image editing and flag positioning still work perfectly
- **Intuitive Behavior**: Touch interactions feel natural and expected
- **Cross-Platform**: Works consistently across different mobile devices

## 🎮 Game Architecture

### Router System
Custom hash-based routing for seamless navigation between games:
- `#menu` - Main menu
- `#dolphin` - Dolphin Thursday game
- `#tamagotchi` - Tamagotchi pet game

### Scene Management
Phaser.js scenes for different game states:
- `MainMenuScene` - Game selection interface
- `GameScene` - Core game logic
- `TamagotchiGameScene` - Pet simulation
- `ModeSelectionScene` - Game mode selection

## 📊 Analytics & Monitoring

### Firebase Analytics Integration
- **Event tracking** for user interactions across all microsites
- **Game completion metrics** and user engagement
- **Microsite usage statistics** with `/monster/` prefixed events
- **Performance monitoring** and error tracking

### Monster Creator Analytics
- **Page views**: `/monster/` and `/monster/gallery` tracking
- **Mode usage**: Standard vs Detailed mode preferences
- **Speech-to-text**: Usage and error tracking
- **Generation metrics**: Success rates, description lengths, creator names
- **Gallery interactions**: Views, prints, downloads, deletions
- **Admin actions**: Deletion tracking for moderation

### Event Categories
- `monster_creator` - Monster Creator page events
- `monster_gallery` - Gallery page events
- `ui_interaction` - User interface interactions
- `monster_generation` - AI generation process
- `speech_to_text` - Voice input functionality
- `gallery_actions` - Gallery management actions

### Error Handling
- Graceful fallbacks for Firebase services
- User-friendly error messages
- Console logging for debugging

## 🚀 Deployment Pipeline

### Live URLs
- **Primary Domain**: https://dlphn.app
- **Firebase URL**: https://dlphn.app
- **Custom Domain**: Configured with Firebase Hosting

### ⚠️ Deployment Process (IMPORTANT)
**DO NOT deploy after every change!** Firebase has low deployment limits.

#### Recommended Workflow:
1. **Local Development**: `npm run dev` (http://localhost:3000)
2. **Test thoroughly** on local server
3. **Batch multiple changes** before deploying
4. **Deploy when ready**: `firebase deploy --only hosting`
5. **Monitor quota** in Firebase Console

#### Commands:
```bash
# Local development (use this for testing)
npm run dev

# Build only (no deployment)
npm run build

# Deploy when ready (use sparingly)
firebase deploy --only hosting
```

### Environment Management
- **Development**: Local Vite server with hot reload at `http://localhost:3000`
- **Production**: Firebase Hosting with CDN distribution at `https://dlphn.app`
- **Functions**: Deployed separately with `firebase deploy --only functions`
- **Custom Domain**: dlphn.app pointing to Firebase Hosting

## 🔄 Future Enhancements

### Potential Additions
- User authentication system
- Score persistence across sessions
- Social features (sharing, leaderboards)
- Additional game modes
- Progressive Web App (PWA) capabilities
- Offline functionality

### Performance Improvements
- Service worker implementation
- Advanced caching strategies
- Image optimization
- Bundle size optimization

---

This documentation provides a comprehensive overview of the ThursdayGame microsites collection. Each microsite serves a specific purpose while sharing common infrastructure and deployment strategies through Firebase.