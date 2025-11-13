# Cyber-Noir Styling Implementation Guide

## ✅ Completed
- **dashboard.html** - Fully updated with cyber-noir styling

## 🎨 Cyber-Noir Design System

### Core CSS File
All pages should link to: `<link rel="stylesheet" href="styles/cyber-noir.css">`

### Key Classes to Use

#### Header & Navigation
```html
<header class="cyber-header">
  <div class="container">
    <a href="index.html" class="cyber-logo">CyTutor</a>
    <nav class="cyber-nav">
      <a href="dashboard.html">Home</a>
      <a href="challenges.html">Challenges</a>
      <a href="domains.html">Learn</a>
      <a href="#" class="cyber-btn cyber-btn-primary">Login</a>
    </nav>
  </div>
</header>
```

#### Buttons
- Primary: `class="cyber-btn cyber-btn-primary"`
- Secondary: `class="cyber-btn cyber-btn-secondary"`

#### Cards
- Standard card: `class="cyber-card"`
- With hover effects and glassmorphism built-in

#### Background Elements
```html
<canvas id="particles-bg" class="cyber-bg"></canvas>
<div class="cyber-grid"></div>
```

#### Grid Layouts
- 2 columns: `class="cyber-grid-2"`
- 3 columns: `class="cyber-grid-3"`

### Color Variables
```css
--neon-green: #22c55e
--cyber-purple: #6E40C9
--bg-void: #0f0f0f
--bg-dark: #1a1a1a
--bg-glass: rgba(26, 26, 26, 0.8)
--text-primary: #e5e5e5
--text-secondary: #aaa
--border-subtle: rgba(255, 255, 255, 0.1)
--border-glow: rgba(34, 197, 94, 0.3)
```

### Spacing System
```css
--space-xs: 0.5rem
--space-sm: 1rem
--space-md: 1.5rem
--space-lg: 2rem
--space-xl: 3rem
--space-2xl: 4rem
```

### Border Radius
```css
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 20px
```

## 📋 Quick Update Checklist for Each HTML File

1. **Replace CSS link:**
   ```html
   <link rel="stylesheet" href="styles/cyber-noir.css">
   ```

2. **Update header:**
   ```html
   <header class="cyber-header">
   ```

3. **Update navigation:**
   ```html
   <nav class="cyber-nav">
   ```

4. **Update logo:**
   ```html
   <a href="index.html" class="cyber-logo">CyTutor</a>
   ```

5. **Update buttons:**
   - Replace custom button classes with `cyber-btn cyber-btn-primary` or `cyber-btn cyber-btn-secondary`

6. **Update cards:**
   - Replace custom card classes with `cyber-card`

7. **Add background elements** (at start of body):
   ```html
   <canvas id="particles-bg" class="cyber-bg"></canvas>
   <div class="cyber-grid"></div>
   ```

8. **Update color references:**
   - Replace custom color variables with cyber-noir variables
   - Use `var(--neon-green)` instead of `#22c55e`
   - Use `var(--text-primary)` instead of `#e5e5e5`

## 🎯 Files Requiring Updates

### High Priority
- [ ] index.html
- [ ] cytutor_redesign.html (main landing page)
- [ ] challenges.html
- [ ] domains.html

### Medium Priority
- [ ] Login.html
- [ ] signup.html
- [ ] verify-otp.html

### Low Priority
- [ ] materials.html
- [ ] CyTutor.html (if still in use)

## 💡 Benefits of Cyber-Noir System

1. **Consistency** - Unified design across all pages
2. **Maintainability** - Single source of truth for styles
3. **Performance** - Reduced CSS duplication
4. **Scalability** - Easy to add new components
5. **Accessibility** - Built-in focus states and transitions
6. **Responsive** - Mobile-first breakpoints included

## 🚀 Example: Converting a Page

### Before:
```html
<header>
  <div class="container">
    <h1>CyTutor</h1>
    <nav>
      <a href="#">Home</a>
      <a href="#" class="btn">Login</a>
    </nav>
  </div>
</header>
```

### After:
```html
<header class="cyber-header">
  <div class="container">
    <a href="index.html" class="cyber-logo">CyTutor</a>
    <nav class="cyber-nav">
      <a href="dashboard.html">Home</a>
      <a href="#" class="cyber-btn cyber-btn-primary">Login</a>
    </nav>
  </div>
</header>
```

## 📝 Notes

- The cyber-noir.css file includes all necessary animations
- Particle background JavaScript should remain in individual files
- Grid background is pure CSS (no JS needed)
- All transitions and hover effects are built into the classes
- Mobile responsive breakpoints are included
