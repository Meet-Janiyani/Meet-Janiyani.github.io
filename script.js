// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const navLinks = document.querySelectorAll('.nav-link');
const currentYearEl = document.getElementById('current-year');
const canvas = document.getElementById('game-background');


// Set current year in footer
currentYearEl.textContent = new Date().getFullYear();

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    
    // Toggle icon
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileNav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Active navigation based on scroll position
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 100;
    
    // Get all sections
    const sections = ['home', 'projects', 'skills', 'contact'];
    
    // Check which section is currently in view
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                document.querySelectorAll(`.nav-link[href="#${sectionId}"]`).forEach(link => {
                    link.classList.add('active');
                });
            }
        }
    });
});

// Scroll animation for elements
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.9) {
            element.classList.add('visible');
        }
    });
};

// Run animation on scroll
window.addEventListener('scroll', animateOnScroll);
// Run once on page load
window.addEventListener('load', animateOnScroll);

// Game Background Canvas
const initGameBackground = () => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    };
    
    // Mouse position tracking
    let mouseX = 0;
    let mouseY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Particles array
    let particles = [];
    
    // Initialize particles
    const initParticles = () => {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: getRandomColor(),
                alpha: Math.random() * 0.5 + 0.1,
                growing: Math.random() > 0.5
            });
        }
    };
    
    // Get random color
    const getRandomColor = () => {
        const colors = [
            '#8b5cf6', // Purple
            '#ec4899', // Pink
            '#10b981', // Green
            '#3b82f6', // Blue
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };
    
    // Draw grid
    const drawGrid = () => {
        ctx.strokeStyle = 'rgba(75, 0, 130, 0.1)';
        ctx.lineWidth = 0.5;
        
        const gridSize = 50;
        
        // Vertical lines
        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    };
    
    // Update and draw particles
    const updateParticles = () => {
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX *= -1;
            }
            
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY *= -1;
            }
            
            // Pulse size effect
            if (particle.growing) {
                particle.size += 0.02;
                if (particle.size > 3) {
                    particle.growing = false;
                }
            } else {
                particle.size -= 0.02;
                if (particle.size < 1) {
                    particle.growing = true;
                }
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Attract particles to mouse
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (200 - distance) / 200;
                
                particle.speedX += forceDirectionX * force * 0.02;
                particle.speedY += forceDirectionY * force * 0.02;
                
                // Limit speed
                const maxSpeed = 2;
                const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                
                if (speed > maxSpeed) {
                    particle.speedX = (particle.speedX / speed) * maxSpeed;
                    particle.speedY = (particle.speedY / speed) * maxSpeed;
                }
            }
        });
    };
    
    // Draw connections between particles
    const drawConnections = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 92, 246, ${(100 - distance) / 500})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };
    
    // Animation loop
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        drawGrid();
        
        // Update and draw particles
        updateParticles();
        
        // Draw connections
        drawConnections();
        
        // Continue animation
        requestAnimationFrame(animate);
    };
    
    // Initialize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
};

// Initialize game background
initGameBackground();