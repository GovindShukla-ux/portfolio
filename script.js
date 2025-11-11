let isMenuOpen = false;
let particles = [];
let animationId;
let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;
let mouseTimeout;

document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

document.addEventListener('DOMContentLoaded', () => {
  const burger  = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');

    burger.setAttribute('aria-expanded',
      burger.classList.contains('active'));
  });

  navMenu.querySelectorAll('.nav-link').forEach(link =>
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navMenu.classList.remove('active');
      burger.setAttribute('aria-expanded','false');
    })
  );
});

function initializePortfolio() {
    setupParticles();
    setupCursorTrail();
    setupScrollAnimations();
    setupTypewriter();
    setupSkillBars();
    setupStatsCounter();
    setupContactForm();
    setupFloatingElements();
    setupSmoothScrolling();
    setupMouseEffects();
    setupRotatingBox();
}


function setupParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) {
        console.log('Particles canvas not found, creating one...');
        createParticlesCanvas();
        return;
    }

    if (canvas.tagName !== 'CANVAS') {
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'particles-canvas';
        newCanvas.style.position = 'fixed';
        newCanvas.style.top = '0';
        newCanvas.style.left = '0';
        newCanvas.style.width = '100%';
        newCanvas.style.height = '100%';
        newCanvas.style.pointerEvents = 'none';
        newCanvas.style.zIndex = '-1';
        
        canvas.parentNode.replaceChild(newCanvas, canvas);
        initParticleSystem(newCanvas);
        return;
    }

    initParticleSystem(canvas);
}

function createParticlesCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    
    document.body.appendChild(canvas);
    initParticleSystem(canvas);
}

function initParticleSystem(canvas) {
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            originalVx: (Math.random() - 0.5) * 0.5,
            originalVy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.6 + 0.2,
            hue: Math.random() * 60 + 160 // Blue-green range
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {

            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 150;
            
            if (distance < maxDistance && isMouseMoving) {

                const force = (maxDistance - distance) / maxDistance;
                const angle = Math.atan2(dy, dx);
                particle.vx -= Math.cos(angle) * force * 0.5;
                particle.vy -= Math.sin(angle) * force * 0.5;
                
                particle.opacity = Math.min(1, particle.opacity + force * 0.3);
                particle.size = Math.min(5, particle.size + force);
            } else {
                particle.vx += (particle.originalVx - particle.vx) * 0.02;
                particle.vy += (particle.originalVy - particle.vy) * 0.02;
                particle.opacity = Math.max(0.2, particle.opacity - 0.01);
                particle.size = Math.max(1, particle.size - 0.02);
            }
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            const distanceRatio = Math.min(1, distance / maxDistance);
            const hue = particle.hue + (1 - distanceRatio) * 30;
            const saturation = 70 + (1 - distanceRatio) * 30;
            const lightness = 50 + (1 - distanceRatio) * 20;
            
            ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${particle.opacity})`;
            ctx.fill();
            
            if (distance < maxDistance / 2) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
        
        animationId = requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

function setupMouseEffects() {
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;
        
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
        
        document.documentElement.style.setProperty('--mouse-x', mouseX + 'px');
        document.documentElement.style.setProperty('--mouse-y', mouseY + 'px');
    });
}

function setupRotatingBox() {
    const codeCube = document.querySelector('.code-cube');
    if (!codeCube) return;
    
    let rotationX = 0;
    let rotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    document.addEventListener('mousemove', function(e) {
        const rect = codeCube.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        // Convert to rotation degrees (limit the rotation range)
        targetRotationY = (deltaX / window.innerWidth) * 60; // Max 60 degrees
        targetRotationX = -(deltaY / window.innerHeight) * 60; // Max 60 degrees (negative for natural feel)
    });
    
    function animateBox() {
        // Smooth interpolation to target rotation
        rotationX += (targetRotationX - rotationX) * 0.1;
        rotationY += (targetRotationY - rotationY) * 0.1;
        
        codeCube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        
        requestAnimationFrame(animateBox);
    }
    
    animateBox();
    
    // Add hover effects to cube faces
    const cubeFaces = document.querySelectorAll('.cube-face');
    cubeFaces.forEach(face => {
        face.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(64, 224, 208, 0.2)';
            this.style.boxShadow = '0 0 20px rgba(64, 224, 208, 0.3)';
        });
        
        face.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.boxShadow = '';
        });
    });
}
function setupCursorTrail() {
    const trail = document.querySelector('.cursor-trail');
    if (!trail) return;

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// ==================== SCROLL ANIMATIONS ====================
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .project-card, .skill-category').forEach(el => {
        observer.observe(el);
    });
}


function setupTypewriter() {
    const typewriterText = document.querySelector('.typewriter');
    if (!typewriterText) return;

    const texts = [
        'Full-Stack Web Developer',
        'Frontend Specialist',
        'Backend Engineer',
        'Data Analyst',
        'Problem Solver'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typewrite() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typewriterText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 150;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(typewrite, typeSpeed);
    }

    typewrite();
}

// ==================== SKILL BARS ANIMATION ====================
function setupSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 300);
                
                observer.unobserve(skillBar);
            }
        });
    });

    skillBars.forEach(bar => observer.observe(bar));
}

// ==================== STATS COUNTER ====================
function setupStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const target = parseInt(statNumber.getAttribute('data-target'));
                
                animateCounter(statNumber, target);
                observer.unobserve(statNumber);
            }
        });
    });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current) + (target >= 100 ? '+' : '');
    }, 20);
}

// ==================== CONTACT FORM ====================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Form input animations
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');

        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                group.classList.remove('focused');
            }
        });

        input.addEventListener('input', () => {
            if (input.value.trim()) {
                group.classList.add('filled');
            } else {
                group.classList.remove('filled');
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // EmailJS v4 configuration
        const serviceID = 'service_oh3jp6r'; // Replace with your EmailJS service ID
        const templateID = 'template_s442wni'; // Replace with your EmailJS template ID
        const publicKey = 'PsHoF4dWMMODQ3p4-'; // Replace with your EmailJS public key

        // Using EmailJS v4 syntax
        emailjs.send(serviceID, templateID, {
            from_name: formObject.name,
            from_email: formObject.email,
            subject: formObject.subject,
            message: formObject.message,
            to_name: 'Govind Shukla'
        }, publicKey)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            formGroups.forEach(group => {
                group.classList.remove('focused', 'filled');
            });
        })
        .catch(function(error) {
            console.error('Email send failed:', error);
            showNotification('Failed to send message. Please try again later.', 'error');
        })
        .finally(function() {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto hide after 5 seconds
    setTimeout(() => hideNotification(notification), 5000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
}

// ==================== FLOATING ELEMENTS ====================
function setupFloatingElements() {
    const floatingElements = document.querySelectorAll('.float-element');
    
    floatingElements.forEach((element, index) => {
        const randomDelay = Math.random() * 2000;
        const randomDuration = 3000 + Math.random() * 2000;
        
        element.style.animationDelay = randomDelay + 'ms';
        element.style.animationDuration = randomDuration + 'ms';
    });
}

// ==================== SMOOTH SCROLLING ====================
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== UTILITY FUNCTIONS ====================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function downloadResume() {
    // Create a temporary link to download resume
    const link = document.createElement('a');
    link.href = 'assets/GovindShukla_Resume.pdf'; // Replace with actual resume path
    link.download = 'GovindShukla_Resume.pdf';
    link.click();
    
    showNotification('Resume download started!', 'success');
}

// ==================== PROJECT CARD INTERACTIONS ====================
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
        
        // Add 3D tilt effect based on mouse position
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            const rotateX = (deltaY / rect.height) * 20;
            const rotateY = (deltaX / rect.width) * 20;
            
            this.style.transform = `
                perspective(1000px) 
                rotateX(${-rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-10px) 
                scale(1.02)
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

// ==================== LOGO ANIMATION ====================
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo');
    
    if (logo) {
        logo.addEventListener('click', function() {
            this.classList.add('pulse');
            scrollToSection('home');
            
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 600);
        });
    }
});

// ==================== SCROLL INDICATOR ====================
function setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            scrollToSection('about');
        });
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
}

// Initialize scroll indicator
document.addEventListener('DOMContentLoaded', setupScrollIndicator);

// ==================== PERFORMANCE OPTIMIZATION ====================
// Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll-related functions are already handled above
}, 16));

// ==================== CLEANUP ====================
window.addEventListener('beforeunload', function() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

// ==================== CONSOLE EASTER EGG ====================
console.log(`
%c╔══════════════════════════════════════╗
║     🚀 Govind Shukla's Portfolio     ║
║                                      ║
║     Thanks for checking out my code! ║
║      Want to work together? Let's    ║
║            connect! 🤝               ║
╚══════════════════════════════════════╝
`, 'color:rgb(50, 123, 225); font-family: monospace; font-size: 12px;');

console.log('✨ Portfolio crafted with passion and lots of coffee ☕');