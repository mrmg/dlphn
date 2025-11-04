# Horrid Henry Monster Creator - Product Requirements Document

## 🎯 Project Overview

**Project Name**: Horrid Henry Monster Creator  
**Microsite Path**: `/monster`  
**Target Audience**: Teachers and students (ages 6-12)  
**Purpose**: Interactive AI-powered monster creation tool inspired by Horrid Henry books, allowing students to describe and visualize their imagined monsters.

## 🎨 Core Concept

A web application that transforms student descriptions of monsters into AI-generated artwork, with multiple input methods and difficulty levels to accommodate different learning needs and abilities.

## 🚀 MVP Features (Phase 1)

### 1. **Text-Based Monster Description**
- [ ] Large, child-friendly text input area
- [ ] Character limit indicator (500 characters)
- [ ] Real-time character count
- [ ] Placeholder text with examples: "My monster has three heads and purple fur..."
- [ ] Auto-save draft descriptions

### 2. **AI Image Generation**
- [ ] Reuse existing Firebase Functions architecture
- [ ] Create new `generateMonsterImage` function
- [ ] Horrid Henry-style art prompts
- [ ] Consistent art style (cartoon, colorful, child-friendly)
- [ ] 1:1 aspect ratio for easy printing

### 3. **Enhanced Prompt Engineering**
- [ ] **Style Context**: "Horrid Henry style monster illustration, bold cartoon art"
- [ ] **Visual Guidelines**: 
  - "Bright, vibrant colors with thick black outlines"
  - "Child-friendly, playful design with exaggerated features"
  - "Sharp triangular teeth, big expressive eyes, spiky elements"
  - "Clean background, high contrast, easy to see details"
- [ ] **Color Palette**: "Use bright yellow, electric blue, lime green, purple, and red colors"
- [ ] **Safety filters**: Appropriate content for children ages 6-12
- [ ] **Prompt enhancement**: Add creative context to student descriptions

### 4. **Print-Optimized Display**
- [ ] Large image display with print-friendly styling
- [ ] Print button with optimized CSS
- [ ] A4 page layout for printing
- [ ] High-resolution image generation
- [ ] Print preview functionality

### 5. **User Interface**
- [ ] Horrid Henry themed design (green, orange, playful fonts)
- [ ] Mobile-responsive layout
- [ ] Large, accessible buttons
- [ ] Clear visual hierarchy
- [ ] Loading animations with monster-themed graphics

## 🎤 Phase 2: Speech-to-Text Integration

### 6. **Voice Input System**
- [ ] Microphone button for voice recording
- [ ] Web Speech API integration
- [ ] Real-time transcription display
- [ ] Edit transcribed text before generation
- [ ] Voice activity detection
- [ ] Audio feedback for recording state

### 7. **Accessibility Features**
- [ ] Screen reader compatibility
- [ ] Keyboard navigation support
- [ ] High contrast mode option
- [ ] Large text size options
- [ ] Audio cues for interactions

## 🎮 Phase 3: Easy Mode Builder

### 8. **Guided Monster Creation**
- [ ] Step-by-step monster builder
- [ ] Visual prompts for each body part
- [ ] Pre-written descriptive options
- [ ] Drag-and-drop interface elements
- [ ] Real-time preview updates

### 9. **Monster Component System**
- [ ] **Body Parts**: Head, torso, arms, legs, tail
- [ ] **Features**: Eyes, mouth, nose, ears
- [ ] **Colors**: Primary and secondary color selection
- [ ] **Size**: Big, medium, small options
- [ ] **Textures**: Furry, scaly, slimy, smooth
- [ ] **Accessories**: Hats, glasses, jewelry, etc.

### 10. **Smart Description Generation**
- [ ] Auto-generate descriptions from selections
- [ ] Encourage creative language: "IT HAS SO MANY LEGS"
- [ ] Grammar assistance for young writers
- [ ] Vocabulary suggestions
- [ ] Story prompts: "What does your monster do?"

## 🛠️ Technical Implementation

### 11. **Firebase Integration**
- [ ] New Cloud Function: `generateMonsterImage`
- [ ] Firestore collection: `monsterQueries`
- [ ] Storage bucket: `monster-images/`
- [ ] Analytics tracking for usage patterns
- [ ] Error handling and fallbacks

### 12. **Frontend Architecture**
- [ ] New HTML file: `monster.html`
- [ ] JavaScript module: `src/monster.js`
- [ ] Service module: `src/services/monsterService.js`
- [ ] CSS styling: `src/styles/monster.css`
- [ ] Asset management for monster-themed graphics

### 13. **Build Configuration**
- [ ] Update `vite.config.ts` with monster entry point
- [ ] Add monster route to `firebase.json`
- [ ] Code splitting for monster-specific features
- [ ] Asset optimization for images and sounds

## 📱 User Experience Design

### 14. **Main Interface Layout**
- [ ] Header with Horrid Henry branding
- [ ] Input section (text/voice/easy mode tabs)
- [ ] Generation button with loading states
- [ ] Results display with print options
- [ ] Navigation back to main games

### 15. **Input Methods Toggle**
- [ ] Tab-based interface for different input types
- [ ] Clear visual indicators for active mode
- [ ] Seamless switching between modes
- [ ] Preserve input when switching modes

### 16. **Results Display**
- [ ] Large, centered image display
- [ ] Print-optimized layout
- [ ] Download options (PNG, PDF)
- [ ] Share functionality
- [ ] Regenerate with modifications

## 🎨 Art Style & Branding

### 17. **Visual Design System**
- [ ] **Horrid Henry Color Palette**:
  - Primary: Bright Yellow background (#FFEB3B)
  - Secondary: Electric Blue (#2196F3) for text and accents
  - Accent: Lime Green (#4CAF50) for interactive elements
  - Highlight: Rich Purple (#9C27B0) for headings
  - Support: Red (#F44336) for monster features, Brown (#795548) for details
- [ ] **Typography**: Bold, hand-drawn sans-serif fonts with thick outlines
- [ ] **UI Elements**: Large, chunky buttons with dark outlines
- [ ] **Icons**: Simple, bold graphics with thick black outlines
- [ ] **Layout**: Uncluttered, focusing on 2-3 key elements maximum

### 18. **Monster Art Style Guidelines**
- [ ] **Horrid Henry Style**: Bold, cartoon illustrations with thick dark outlines
- [ ] **Color Scheme**: Bright, saturated colors with high contrast
- [ ] **Monster Features**: 
  - Exaggerated expressions (big eyes, wide mouths)
  - Sharp, triangular teeth
  - Spiky, jagged elements
  - Dynamic energy lines (like the camera's "smoke")
  - Blocky, geometric shapes
- [ ] **Background**: Clean, solid colors or simple patterns
- [ ] **Scale**: Large, clear elements that are easy to see and interact with
- [ ] **Personality**: Playful, mischievous, energetic (like Henry himself)

## 🔧 Development Tasks

### 19. **Backend Development**
- [ ] Create `generateMonsterImage` Cloud Function
- [ ] Implement monster-specific prompt templates
- [ ] Add Firestore collections for monster data
- [ ] Configure Storage rules for monster images
- [ ] Add error handling and logging

### 20. **Frontend Development**
- [ ] Create `monster.html` page structure
- [ ] Implement text input with character counting
- [ ] Add voice recording functionality
- [ ] Build easy mode interface
- [ ] Create print-optimized CSS
- [ ] Add responsive design

### 21. **Integration & Testing**
- [ ] Connect frontend to backend services
- [ ] Test image generation pipeline
- [ ] Validate print functionality
- [ ] Test on mobile devices
- [ ] Accessibility testing
- [ ] Performance optimization

## 📊 Success Metrics

### 22. **Usage Analytics**
- [ ] Track image generation success rate
- [ ] Monitor user engagement by input method
- [ ] Measure print/download actions
- [ ] Track session duration
- [ ] Monitor error rates

### 23. **Educational Impact**
- [ ] Track creative language usage
- [ ] Monitor vocabulary expansion
- [ ] Measure user satisfaction
- [ ] Collect teacher feedback
- [ ] Track repeat usage

## 🚀 Deployment Plan

### 24. **Release Strategy**
- [ ] Phase 1: Basic text input and generation
- [ ] Phase 2: Add speech-to-text functionality
- [ ] Phase 3: Implement easy mode builder
- [ ] Continuous: Bug fixes and improvements

### 25. **Post-Launch Support**
- [ ] Monitor system performance
- [ ] Collect user feedback
- [ ] Iterate based on usage data
- [ ] Add new features based on demand
- [ ] Maintain and update prompts

## 🎯 Acceptance Criteria

### 26. **Core Functionality**
- [ ] Students can describe monsters in text
- [ ] AI generates appropriate monster images
- [ ] Images are print-ready and high quality
- [ ] Interface is intuitive for children
- [ ] Works on mobile and desktop devices

### 27. **Advanced Features**
- [ ] Speech-to-text works reliably
- [ ] Easy mode guides students through creation
- [ ] Generated descriptions are creative and engaging
- [ ] Print functionality produces good results
- [ ] Accessibility features work as expected

## 📝 Future Enhancements

### 28. **Potential Additions**
- [ ] Monster story generation
- [ ] Multiple monster scenes
- [ ] Monster comparison features
- [ ] Teacher dashboard for student creations
- [ ] Monster gallery sharing
- [ ] AR/VR integration
- [ ] Monster animation features

---

## 🏁 Project Timeline

**Phase 1 (MVP)**: 2-3 weeks
- Basic text input and image generation
- Print functionality
- Core UI/UX

**Phase 2 (Voice)**: 1-2 weeks
- Speech-to-text integration
- Accessibility improvements

**Phase 3 (Easy Mode)**: 2-3 weeks
- Guided monster builder
- Component system
- Smart description generation

**Total Estimated Time**: 5-8 weeks

---

*This PRD serves as a living document and will be updated as the project evolves and new requirements are identified.*