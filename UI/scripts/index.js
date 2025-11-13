// Anime.js Dynamic Background
const canvas = document.getElementById('animated-bg');
const ctx = canvas.getContext('2d');
const particlesArray = [];
const particleCount = 100;

// Set canvas size
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

// Particle class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = '#22c55e';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Create particles
function init() {
  for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle());
  }
}

// Animate particles
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
    
    // Connect particles within range
    for (let j = i; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 * (1 - distance/100)})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}

// Initialize and start animation
init();
animate();

// Terminal typing effect
const terminal = document.getElementById("terminal");
const lines = [
  { prompt: "user@cytutor:~$ ", command: "whoami", output: "cuytutor_user" },
  { prompt: "user@cytutor:~$ ", command: "ls challenges/", output: "web_hacking  cryptography  reverse_engineering  forensics\nPick a challenge to start learning..." }
];

async function typeText(element, text, className) {
  for (let char of text) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = char;
    element.appendChild(span);
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
  }
}

async function simulateTerminal() {
  terminal.innerHTML = ""; // Clear existing content
  
  for (let line of lines) {
    const lineDiv = document.createElement("div");
    lineDiv.className = "terminal-line";
    terminal.appendChild(lineDiv);
    
    // Type prompt
    await typeText(lineDiv, line.prompt + " ", "terminal-prompt");
    
    // Type command
    await typeText(lineDiv, line.command, "terminal-command");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Show output
    if (line.output) {
      const outputDiv = document.createElement("div");
      outputDiv.className = "terminal-line";
      terminal.appendChild(outputDiv);
      await typeText(outputDiv, line.output, "terminal-output");
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  
  // Add final prompt with cursor
  const finalLine = document.createElement("div");
  finalLine.className = "terminal-line";
  finalLine.innerHTML = '<span class="terminal-prompt">user@cytutor:~$</span><span class="terminal-cursor"></span>';
  terminal.appendChild(finalLine);
}

// Start the terminal animation
simulateTerminal();

// Smooth scrolling
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
