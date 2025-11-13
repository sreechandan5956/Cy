# Cyber-Noir Styling Update Plan

## Files to Update:
1. ✅ dashboard.html - DONE
2. index.html
3. challenges.html
4. domains.html
5. Login.html
6. signup.html
7. verify-otp.html
8. materials.html
9. cytutor_redesign.html

## Changes to Apply:

### 1. Replace CSS Link
FROM: `<link rel="stylesheet" href="styles/global.css">`
TO: `<link rel="stylesheet" href="styles/cyber-noir.css">`

### 2. Update Header Structure
FROM: `<header>` with custom classes
TO: `<header class="cyber-header">` with cyber-noir classes

### 3. Update Navigation
FROM: Custom nav classes
TO: `<nav class="cyber-nav">` with cyber-noir classes

### 4. Update Buttons
FROM: Custom button classes
TO: `cyber-btn cyber-btn-primary` or `cyber-btn cyber-btn-secondary`

### 5. Update Cards
FROM: Custom card classes
TO: `cyber-card` class

### 6. Add Background Elements
Add: `<canvas id="particles-bg" class="cyber-bg"></canvas>`
Add: `<div class="cyber-grid"></div>`

### 7. Update Color Variables
Use cyber-noir variables:
- --neon-green
- --cyber-purple
- --bg-void
- --text-primary
- --text-secondary
