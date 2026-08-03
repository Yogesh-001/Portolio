document.addEventListener("DOMContentLoaded", () => {
    let globeAngle = 0;
    let hoveredNodeId = null;
    let activePulses = [];
    let impactRings = [];

    /* === THEME TOGGLE === */
    const themeBtn  = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const html      = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        html.setAttribute("data-theme", savedTheme);
        if (savedTheme === "light") themeIcon.classList.replace("fa-sun","fa-moon");
    }
    themeBtn.addEventListener("click", () => {
        const isDark = html.getAttribute("data-theme") !== "light";
        html.setAttribute("data-theme", isDark ? "light" : "dark");
        themeIcon.classList.replace(isDark ? "fa-sun" : "fa-moon", isDark ? "fa-moon" : "fa-sun");
        localStorage.setItem("theme", isDark ? "light" : "dark");
    });

    /* === HAMBURGER NAV === */
    const burger   = document.getElementById("hamburger");
    const navLinks = document.querySelector(".nav-links");
    if (burger && navLinks) {
        burger.addEventListener("click", () => {
            burger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });
        document.querySelectorAll(".nav-links a").forEach(a => {
            a.addEventListener("click", () => {
                burger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }

    /* === STICKY HEADER === */
    const header   = document.getElementById("header");
    const sections = document.querySelectorAll("section[id]");
    const navAs    = document.querySelectorAll(".nav-links a");
    window.addEventListener("scroll", () => {
        if (header) header.classList.toggle("scrolled", window.scrollY > 50);
        let cur = "";
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 220) cur = s.id; });
        navAs.forEach(a => { a.classList.toggle("active", a.getAttribute("href") === "#"+cur); });
    });

    /* === TYPING EFFECT === */
    const typedEl = document.getElementById("typed-text");
    if (typedEl) {
        const phrases = ["AI Engineer","Generative AI","LLM Systems","Autonomous Agents","Multi-Agent Architect"];
        let pi=0, ci=0, deleting=false, speed=80;
        function type() {
            const phrase = phrases[pi];
            typedEl.textContent = deleting ? phrase.substring(0,ci-1) : phrase.substring(0,ci+1);
            deleting ? ci-- : ci++;
            if (!deleting && ci===phrase.length)  { speed=2200; deleting=true; }
            else if (deleting && ci===0)           { deleting=false; pi=(pi+1)%phrases.length; speed=400; }
            else                                   { speed=deleting?45:80; }
            setTimeout(type, speed);
        }
        type();
    }

    /* === SCROLL REVEAL === */
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { 
            if (e.isIntersecting) { 
                e.target.classList.add("show", "visible"); 
                io.unobserve(e.target); 
            } 
        });
    }, { threshold: 0.08, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll(".fade-up").forEach(el => io.observe(el));

    /* === STATS COUNTER ANIMATION === */
    function animateCounters() {
        const counters = document.querySelectorAll(".count");
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            if (!target) return;
            let count = 0;
            const step = Math.max(1, Math.ceil(target / 25));
            const updateCount = () => {
                count += step;
                if (count < target) {
                    counter.innerText = count;
                    setTimeout(updateCount, 50);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }
    setTimeout(animateCounters, 300);

    /* === SMOOTH SCROLL === */
    document.querySelectorAll("a[href^=\"#\"]").forEach(a => {
        a.addEventListener("click", e => {
            e.preventDefault();
            const tgt = document.querySelector(a.getAttribute("href"));
            if (tgt && header) window.scrollTo({ top: tgt.offsetTop - header.offsetHeight - 16, behavior: "smooth" });
        });
    });

    /* === 3D CARD TILT === */
    document.querySelectorAll(".tilt-card").forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const rx = ((e.clientY - rect.top - rect.height/2) / (rect.height/2)) * -6;
            const ry = ((e.clientX - rect.left - rect.width/2) / (rect.width/2)) * 6;
            card.style.transform = "perspective(1000px) rotateX("+rx+"deg) rotateY("+ry+"deg) translateY(-8px)";
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
            card.style.transition = "transform 0.5s ease";
        });
        card.addEventListener("mouseenter", () => { card.style.transition = "transform 0.1s ease"; });
    });

    /* === FOUNDATION MODEL CORE (Hero Right AI Reactor Visualization) === */
    function initFoundationCore() {
        const heroRight = document.querySelector(".hero-right");
        const canvas = document.getElementById("core-canvas");
        const svgNeural = document.getElementById("svg-neural-links");
        if (!heroRight || !canvas || !svgNeural) return;

        const ctx = canvas.getContext("2d");
        const nodes = Array.from(document.querySelectorAll(".node-capsule"));
        let hoveredNodeId = null;

        function resizeCanvas() {
            canvas.width = heroRight.offsetWidth;
            canvas.height = heroRight.offsetHeight;
        }
        window.addEventListener("resize", () => {
            resizeCanvas();
            updateNeuralLinks();
        });
        resizeCanvas();

        function getCoreCenter() {
            return {
                x: canvas.width / 2,
                y: canvas.height / 2
            };
        }

        function getNodeCenter(id) {
            const el = document.getElementById(id);
            if (!el) return null;
            const er = el.getBoundingClientRect();
            const hr = heroRight.getBoundingClientRect();
            return {
                x: er.left - hr.left + er.width / 2,
                y: er.top - hr.top + er.height / 2
            };
        }

        // Neural network connections topology (Node to Node pairs)
        const NODE_CONNECTIONS = [
            ["n-tokenizer", "n-pytorch"],
            ["n-pytorch", "n-transformers"],
            ["n-transformers", "n-pretraining"],
            ["n-pretraining", "n-posttraining"],
            ["n-posttraining", "n-evaluation"],
            ["n-evaluation", "n-inference"],
            ["n-inference", "n-deployment"],
            ["n-deployment", "n-vllm"],
            ["n-vllm", "n-agents"],
            ["n-agents", "n-mlops"],
            ["n-mlops", "n-tokenizer"],
            ["n-tokenizer", "n-pretraining"],
            ["n-pytorch", "n-evaluation"],
            ["n-agents", "n-posttraining"],
            ["n-transformers", "n-inference"]
        ];

        // Store active energy pulses & particles
        let activePulses = [];
        let particles = [];
        let coreRipples = [];

        // Initialize 50 floating ambient energy particles
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 0.8 + Math.random() * 1.8,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                alpha: 0.2 + Math.random() * 0.6,
                hue: Math.random() > 0.5 ? 270 : 195, // purple or blue/cyan
                pulseSpeed: 0.01 + Math.random() * 0.02
            });
        }

        // Render SVG neural link paths between nodes and to core center
        function updateNeuralLinks() {
            svgNeural.innerHTML = "";
            const core = getCoreCenter();

            // 1. Inter-node links
            NODE_CONNECTIONS.forEach(([a, b], idx) => {
                const pa = getNodeCenter(a);
                const pb = getNodeCenter(b);
                if (!pa || !pb) return;

                const isHovered = (hoveredNodeId === a || hoveredNodeId === b);
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

                // Control point for smooth curved neural path
                const mx = (pa.x + pb.x) / 2 + (Math.sin(idx) * 25);
                const my = (pa.y + pb.y) / 2 + (Math.cos(idx) * 25);

                path.setAttribute("d", `M ${pa.x} ${pa.y} Q ${mx} ${my} ${pb.x} ${pb.y}`);
                path.setAttribute("class", isHovered ? "neural-link-path active-link" : "neural-link-path");
                path.setAttribute("id", `link-${a}-${b}`);
                svgNeural.appendChild(path);
            });

            // 2. Direct Radial Links from each Node to the Central AI Core
            nodes.forEach((n, idx) => {
                const pos = getNodeCenter(n.id);
                if (!pos) return;

                const isHovered = (hoveredNodeId === n.id);
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

                const mx = (pos.x + core.x) / 2 + Math.sin(idx * 1.5) * 20;
                const my = (pos.y + core.y) / 2 + Math.cos(idx * 1.5) * 20;

                path.setAttribute("d", `M ${pos.x} ${pos.y} Q ${mx} ${my} ${core.x} ${core.y}`);
                path.setAttribute("class", isHovered ? "neural-link-path active-link" : "neural-link-path");
                path.setAttribute("id", `core-link-${n.id}`);
                path.style.strokeOpacity = isHovered ? "0.95" : "0.22";
                svgNeural.appendChild(path);
            });
        }

        // Attach Node Hover Event Listeners
        nodes.forEach(n => {
            n.addEventListener("mouseenter", () => {
                hoveredNodeId = n.id;
                n.classList.add("active-hover");
                updateNeuralLinks();

                // Burst of energy packets toward center on hover
                for (let i = 0; i < 4; i++) {
                    activePulses.push({
                        fromNode: n.id,
                        toCore: true,
                        progress: i * -0.15,
                        speed: 0.012 + Math.random() * 0.008,
                        color: n.style.getPropertyValue("--accent") || "#c084fc"
                    });
                }
            });

            n.addEventListener("mouseleave", () => {
                hoveredNodeId = null;
                n.classList.remove("active-hover");
                updateNeuralLinks();
            });
        });

        // Spawn periodic background energy pulses along radial neural links toward center core
        function spawnPeriodicPulses() {
            if (activePulses.length < 8 && Math.random() < 0.04) {
                const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
                activePulses.push({
                    fromNode: randomNode.id,
                    toCore: true,
                    progress: 0,
                    speed: 0.006 + Math.random() * 0.006,
                    color: randomNode.style.getPropertyValue("--accent") || "#38bdf8"
                });
            }
        }

        let time = 0;
        function animate() {
            time += 0.015;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const core = getCoreCenter();

            // 1. Draw Floating Ambient Energy Particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Subtle orbital drift inward towards core
                const dx = core.x - p.x;
                const dy = core.y - p.y;
                p.vx += (dx * 0.00003);
                p.vy += (dy * 0.00003);

                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                const currentAlpha = Math.max(0.1, p.alpha + Math.sin(time * 2 + p.pulseSpeed * 100) * 0.25);

                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${currentAlpha})`;
                ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, 0.8)`;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.restore();
            });

            // 2. Animate Energy Pulses traveling along neural paths
            spawnPeriodicPulses();

            for (let i = activePulses.length - 1; i >= 0; i--) {
                const pulse = activePulses[i];
                pulse.progress += pulse.speed;

                if (pulse.progress >= 1) {
                    // Pulse arrived at central reactor core -> trigger core ripple
                    coreRipples.push({
                        r: 65,
                        maxR: 110 + Math.random() * 30,
                        alpha: 0.8,
                        color: pulse.color
                    });
                    activePulses.splice(i, 1);
                    continue;
                }

                if (pulse.progress > 0) {
                    const nodePos = getNodeCenter(pulse.fromNode);
                    if (nodePos) {
                        // Interpolate along path to core center
                        const curX = nodePos.x + (core.x - nodePos.x) * pulse.progress;
                        const curY = nodePos.y + (core.y - nodePos.y) * pulse.progress;

                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(curX, curY, 3, 0, Math.PI * 2);
                        ctx.fillStyle = pulse.color;
                        ctx.shadowColor = pulse.color;
                        ctx.shadowBlur = 14;
                        ctx.fill();

                        // Glowing tail
                        const tailX = nodePos.x + (core.x - nodePos.x) * Math.max(0, pulse.progress - 0.08);
                        const tailY = nodePos.y + (core.y - nodePos.y) * Math.max(0, pulse.progress - 0.08);
                        const grad = ctx.createLinearGradient(tailX, tailY, curX, curY);
                        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
                        grad.addColorStop(1, pulse.color);

                        ctx.beginPath();
                        ctx.moveTo(tailX, tailY);
                        ctx.lineTo(curX, curY);
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }

            // 3. Animate Core Energy Ripples
            for (let i = coreRipples.length - 1; i >= 0; i--) {
                const r = coreRipples[i];
                r.r += 0.8;
                r.alpha -= 0.015;

                if (r.alpha <= 0 || r.r >= r.maxR) {
                    coreRipples.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.beginPath();
                ctx.arc(core.x, core.y, r.r, 0, Math.PI * 2);
                ctx.strokeStyle = r.color;
                ctx.globalAlpha = r.alpha;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = r.color;
                ctx.shadowBlur = 10;
                ctx.stroke();
                ctx.restore();
            }

            // 4. Subtle Electrical Arcs around reactor inner boundary
            if (Math.random() < 0.08) {
                const arcAngle = Math.random() * Math.PI * 2;
                const arcR = 64 + Math.random() * 8;
                const ax1 = core.x + Math.cos(arcAngle) * arcR;
                const ay1 = core.y + Math.sin(arcAngle) * arcR;
                const ax2 = core.x + Math.cos(arcAngle + 0.3) * (arcR + (Math.random() - 0.5) * 12);
                const ay2 = core.y + Math.sin(arcAngle + 0.3) * (arcR + (Math.random() - 0.5) * 12);

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(ax1, ay1);
                ctx.lineTo(ax2, ay2);
                ctx.strokeStyle = Math.random() > 0.5 ? "rgba(192, 132, 252, 0.8)" : "rgba(56, 189, 248, 0.8)";
                ctx.lineWidth = 1.2;
                ctx.shadowColor = "#ffffff";
                ctx.shadowBlur = 8;
                ctx.stroke();
                ctx.restore();
            }

            requestAnimationFrame(animate);
        }

        setTimeout(() => {
            updateNeuralLinks();
            animate();
        }, 150);
    }

    initFoundationCore();
});
