document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       Theme Toggle (Dark/Light Mode)
       ========================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        htmlElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = htmlElement.getAttribute('data-theme');
        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    /* ==========================================
       Mobile Navigation Hamburger Menu
       ========================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* ==========================================
       Sticky Header + Active Nav Highlighting
       ========================================== */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Sticky header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active nav highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================
       Typing Effect for Hero Role
       ========================================== */
    const typedElement = document.getElementById('typed-text');
    const phrases = [
        'AI Engineer',
        'Generative AI',
        'LLM Systems',
        'Autonomous Agents',
        'Multi-Agent Architect'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // Pause before next phrase
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();

    /* ==========================================
       Hero Name Smooth Fade-in Reveal
       ========================================== */
    const heroName = document.getElementById('hero-name');
    if (heroName) {
        heroName.classList.add('hero-name-ready');
    }

    /* ==========================================
       Scroll Animations (Intersection Observer)
       ========================================== */
    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden, .fade-left, .scale-in');
    hiddenElements.forEach(el => observer.observe(el));

    /* ==========================================
       3D Card Tilt Effect
       ========================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });

    /* ==========================================
       Stark Arc Reactor & Quantum Grid (Canvas)
       ========================================== */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const PARTICLE_COUNT = 75;
        const CONNECTION_DISTANCE = 170;
        
        let mouse = { x: null, y: null, radius: 200 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resize);
        resize();

        class StarkParticle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2.2 + 0.6;
                // Type: 0 = Arc Cyan, 1 = Stark Gold, 2 = HUD Spark / Diamond
                const roll = Math.random();
                this.type = roll > 0.45 ? 0 : (roll > 0.1 ? 1 : 2);
                this.opacity = Math.random() * 0.6 + 0.3;
                this.pulseOffset = Math.random() * Math.PI * 2;
                this.shape = Math.random() > 0.8 ? 'diamond' : 'circle';
            }

            update(time) {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction - HUD magnetic drift
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x += (dx / dist) * force * 0.6;
                        this.y += (dy / dist) * force * 0.6;
                    }
                }

                // Subtle pulse
                this.currentOpacity = this.opacity + Math.sin(time * 0.0015 + this.pulseOffset) * 0.2;
                if (this.currentOpacity < 0.1) this.currentOpacity = 0.1;
            }

            draw() {
                const theme = document.documentElement.getAttribute('data-theme');
                let r, g, b;

                if (theme === 'light') {
                    if (this.type === 0) { r = 0; g = 180; b = 216; }
                    else if (this.type === 1) { r = 212; g = 160; b = 23; }
                    else { r = 239; g = 35; b = 60; }
                } else {
                    if (this.type === 0) { r = 0; g = 240; b = 255; }
                    else if (this.type === 1) { r = 255; g = 215; b = 0; }
                    else { r = 239; g = 35; b = 60; }
                }

                ctx.save();
                if (this.shape === 'diamond') {
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y - this.radius * 2);
                    ctx.lineTo(this.x + this.radius * 2, this.y);
                    ctx.lineTo(this.x, this.y + this.radius * 2);
                    ctx.lineTo(this.x - this.radius * 2, this.y);
                    ctx.closePath();
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.currentOpacity})`;
                    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
                    ctx.shadowBlur = 8;
                    ctx.fill();
                } else {
                    // Glow radial
                    ctx.beginPath();
                    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4.5);
                    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.currentOpacity})`);
                    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                    ctx.fillStyle = gradient;
                    ctx.arc(this.x, this.y, this.radius * 4.5, 0, Math.PI * 2);
                    ctx.fill();

                    // Core dot
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, this.currentOpacity + 0.3)})`;
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        let ringAngle1 = 0;
        let ringAngle2 = 0;

        function drawStarkHudRings() {
            ringAngle1 += 0.0004;
            ringAngle2 -= 0.0006;

            const theme = document.documentElement.getAttribute('data-theme');
            const isDark = theme !== 'light';
            const centerX = width / 2;
            const centerY = height * 0.45;

            ctx.save();
            ctx.translate(centerX, centerY);

            // Outer Dashed HUD Ring
            ctx.save();
            ctx.rotate(ringAngle1);
            ctx.beginPath();
            ctx.arc(0, 0, Math.min(width, height) * 0.38, 0, Math.PI * 2);
            ctx.setLineDash([25, 45, 10, 45]);
            ctx.strokeStyle = isDark ? 'rgba(0, 240, 255, 0.09)' : 'rgba(0, 180, 216, 0.07)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();

            // Inner Tech Ring with Degree Ticks
            ctx.save();
            ctx.rotate(ringAngle2);
            const innerR = Math.min(width, height) * 0.25;
            ctx.beginPath();
            ctx.arc(0, 0, innerR, 0, Math.PI * 2);
            ctx.setLineDash([80, 30, 15, 30]);
            ctx.strokeStyle = isDark ? 'rgba(255, 215, 0, 0.12)' : 'rgba(212, 160, 23, 0.09)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
            
            // Draw cardinal degree markers (0°, 90°, 180°, 270°)
            for (let deg = 0; deg < 360; deg += 90) {
                const rad = (deg * Math.PI) / 180;
                const x1 = Math.cos(rad) * (innerR - 6);
                const y1 = Math.sin(rad) * (innerR - 6);
                const x2 = Math.cos(rad) * (innerR + 6);
                const y2 = Math.sin(rad) * (innerR + 6);
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = isDark ? 'rgba(0, 240, 255, 0.25)' : 'rgba(0, 180, 216, 0.2)';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([]);
                ctx.stroke();
            }
            ctx.restore();

            ctx.restore();
        }

        function drawMouseHudReticle() {
            if (mouse.x === null || mouse.y === null) return;
            const theme = document.documentElement.getAttribute('data-theme');
            const isDark = theme !== 'light';
            const color = isDark ? 'rgba(0, 240, 255, 0.6)' : 'rgba(0, 180, 216, 0.6)';

            ctx.save();
            ctx.translate(mouse.x, mouse.y);

            // Target Ring
            ctx.beginPath();
            ctx.arc(0, 0, 22, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.8;
            ctx.setLineDash([6, 6]);
            ctx.stroke();

            // Center Crosshair
            ctx.beginPath();
            ctx.moveTo(-8, 0); ctx.lineTo(8, 0);
            ctx.moveTo(0, -8); ctx.lineTo(0, 8);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.setLineDash([]);
            ctx.stroke();

            // Corner Brackets
            const s = 14;
            const l = 5;
            ctx.beginPath();
            ctx.moveTo(-s, -s + l); ctx.lineTo(-s, -s); ctx.lineTo(-s + l, -s);
            ctx.moveTo(s - l, -s); ctx.lineTo(s, -s); ctx.lineTo(s, -s + l);
            ctx.moveTo(-s, s - l); ctx.lineTo(-s, s); ctx.lineTo(-s + l, s);
            ctx.moveTo(s - l, s); ctx.lineTo(s, s); ctx.lineTo(s, s - l);
            ctx.strokeStyle = isDark ? 'rgba(255, 215, 0, 0.7)' : 'rgba(212, 160, 23, 0.7)';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.restore();
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new StarkParticle());
        }

        function animate(time) {
            ctx.clearRect(0, 0, width, height);

            const theme = document.documentElement.getAttribute('data-theme');
            const isDark = theme !== 'light';

            // Draw Background HUD Telemetry Rings
            drawStarkHudRings();

            // Connect particles with Stark Energy Beams
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(time);
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONNECTION_DISTANCE) {
                        const opacity = (1 - distance / CONNECTION_DISTANCE) * (isDark ? 0.18 : 0.1);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);

                        if (particles[i].type === 0 || particles[j].type === 0) {
                            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                        } else {
                            ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
                        }

                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }

                // Connect to mouse cursor with interactive Stark Arc energy line
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const distToMouse = Math.sqrt(dx * dx + dy * dy);
                    if (distToMouse < mouse.radius) {
                        const lineOpacity = (1 - distToMouse / mouse.radius) * 0.35;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${lineOpacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
                        ctx.shadowBlur = 4;
                        ctx.stroke();
                        ctx.shadowBlur = 0;
                    }
                }
            }

            // Draw Interactive Target Reticle on Cursor
            drawMouseHudReticle();

            requestAnimationFrame(animate);
        }

        animate(0);
    }

    /* ==========================================
       Smooth Scroll for Navigation Links
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
