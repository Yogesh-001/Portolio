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

    /* === INTERACTIVE FOUNDATION MODEL LIFECYCLE CORE & KNOWLEDGE GRAPH === */
    function initFoundationCore() {
        const heroRight = document.querySelector(".hero-right");
        const svgNeural = document.getElementById("svg-neural-links");
        const infoPanel = document.getElementById("info-panel");
        const infoTitle = document.getElementById("info-title");
        const infoCluster = document.getElementById("info-cluster");
        const infoIcon = document.getElementById("info-icon");
        const infoList = document.getElementById("info-list");
        const coreHalo = document.getElementById("core-volumetric-halo");

        if (!heroRight || !svgNeural) return;

        const nodes = Array.from(document.querySelectorAll(".node-capsule"));
        let activeHoverNodeId = null;

        // Technical details for floating HUD info panel (with checkmarks)
        const NODE_DETAILS = {
            "n-dataset": {
                title: "DATASET",
                cluster: "DATA",
                icon: "📂",
                techs: ["✓ Data Cleaning & Filtering", "✓ Deduplication & Quality Heuristics", "✓ RedPajama & FineWeb Pipelines", "✓ Synthetic Data Generation"]
            },
            "n-tokenizer": {
                title: "TOKENIZER",
                cluster: "DATA",
                icon: "🔤",
                techs: ["✓ Byte-Pair Encoding (BPE)", "✓ SentencePiece & WordPiece", "✓ Vocabulary Size Optimization", "✓ Compression Ratio Tuning"]
            },
            "n-transformer": {
                title: "TRANSFORMER",
                cluster: "MODEL",
                icon: "🧠",
                techs: ["✓ Grouped-Query Attention (GQA)", "✓ Rotary Position Embedding (RoPE)", "✓ SwiGLU Activation Function", "✓ RMSNorm & Layer Scaling"]
            },
            "n-pretraining": {
                title: "PRETRAINING",
                cluster: "MODEL",
                icon: "⚡",
                techs: ["✓ Rotary Embeddings", "✓ Flash Attention", "✓ FSDP & DeepSpeed", "✓ Mixed Precision (BF16 / FP8)", "✓ Curriculum Learning"]
            },
            "n-sft": {
                title: "SUPERVISED FINE-TUNING",
                cluster: "ALIGNMENT",
                icon: "🧪",
                techs: ["✓ Instruction Tuning", "✓ LoRA / QLoRA Adaptation", "✓ Multi-Turn Chat Formatting", "✓ Parameter-Efficient SFT"]
            },
            "n-dpo": {
                title: "DIRECT PREFERENCE",
                cluster: "ALIGNMENT",
                icon: "🎯",
                techs: ["✓ Direct Preference Optimization", "✓ Reference Model Loss", "✓ Implicit Reward Modeling", "✓ KL Penalty Calibration"]
            },
            "n-rlhf": {
                title: "RLHF",
                cluster: "ALIGNMENT",
                icon: "🧬",
                techs: ["✓ Reward Model Training", "✓ PPO / GRPO Optimization", "✓ Human Preference Alignment", "✓ Safety Policy Guardrails"]
            },
            "n-mmlu": {
                title: "MMLU BENCHMARK",
                cluster: "EVALUATION",
                icon: "📊",
                techs: ["✓ Multi-Task Knowledge Scoring", "✓ 5-Shot Prompt Reasoning", "✓ Cross-Domain Subject Auditing", "✓ Automated Eval Harness"]
            },
            "n-humaneval": {
                title: "HUMANEVAL CODE",
                cluster: "EVALUATION",
                icon: "💻",
                techs: ["✓ Pass@1 & Pass@10 Metrics", "✓ Python Code Generation", "✓ Unit Test Execution", "✓ Syntax & Logic Verification"]
            },
            "n-arena": {
                title: "CHATBOT ARENA",
                cluster: "EVALUATION",
                icon: "🏆",
                techs: ["✓ LMSYS Crowdsourced Elo", "✓ Blind Pairwise Preference", "✓ LLM-as-a-Judge Evaluation", "✓ Win-Rate Matrix Analysis"]
            },
            "n-inference": {
                title: "INFERENCE ENGINE",
                cluster: "INFERENCE",
                icon: "🚀",
                techs: ["✓ vLLM", "✓ Continuous Batching", "✓ KV Cache", "✓ Tensor Parallelism", "✓ Quantization"]
            },
            "n-vllm": {
                title: "vLLM SERVING",
                cluster: "INFERENCE",
                icon: "⚙️",
                techs: ["✓ PagedAttention Memory", "✓ High Throughput Generation", "✓ Speculative Decoding", "✓ OpenAI-Compatible API"]
            },
            "n-tensorrt": {
                title: "TENSORRT-LLM",
                cluster: "INFERENCE",
                icon: "⚡",
                techs: ["✓ TensorRT Kernel Fusion", "✓ FP8 / INT4 Quantization", "✓ In-Flight Batching", "✓ Low-Latency Execution"]
            },
            "n-serving": {
                title: "MODEL SERVING",
                cluster: "DEPLOYMENT",
                icon: "☁️",
                techs: ["✓ Docker & Kubernetes Scaling", "✓ FastAPI & Triton Server", "✓ Model Context Protocol (MCP)", "✓ Enterprise Load Balancing"]
            },
            "n-monitoring": {
                title: "OBSERVABILITY",
                cluster: "DEPLOYMENT",
                icon: "📡",
                techs: ["✓ Hallucination & Drift Tracing", "✓ Token & Latency Telemetry", "✓ Faithfulness & Safety Scoring", "✓ Token Cost Observability"]
            }
        };

        // Cluster groupings for 6 lifecycle stages
        const CLUSTER_BRANCHES = {
            "DATA": ["n-dataset", "n-tokenizer"],
            "MODEL": ["n-transformer", "n-pretraining"],
            "ALIGNMENT": ["n-sft", "n-dpo", "n-rlhf"],
            "EVALUATION": ["n-mmlu", "n-humaneval", "n-arena"],
            "INFERENCE": ["n-inference", "n-vllm", "n-tensorrt"],
            "DEPLOYMENT": ["n-serving", "n-monitoring"]
        };

        function getCoreCenter() {
            return { x: 400, y: 400 };
        }

        function getNodeSvgPos(id) {
            const el = document.getElementById(id);
            if (!el) return null;
            const er = el.getBoundingClientRect();
            const hr = heroRight.getBoundingClientRect();

            // Convert viewport pixel coordinates to SVG viewBox (800x800) coordinates
            const px = er.left - hr.left + er.width / 2;
            const py = er.top - hr.top + er.height / 2;

            return {
                x: (px / hr.width) * 800,
                y: (py / hr.height) * 800
            };
        }

        // Draw curved neural link SVG paths
        function renderNeuralLinks() {
            svgNeural.innerHTML = "";
            const core = getCoreCenter();

            // 1. Intra-cluster links
            Object.values(CLUSTER_BRANCHES).forEach(clusterNodes => {
                for (let i = 0; i < clusterNodes.length - 1; i++) {
                    const idA = clusterNodes[i];
                    const idB = clusterNodes[i + 1];
                    const posA = getNodeSvgPos(idA);
                    const posB = getNodeSvgPos(idB);
                    if (!posA || !posB) continue;

                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    const mx = (posA.x + posB.x) / 2;
                    const my = (posA.y + posB.y) / 2;

                    path.setAttribute("d", `M ${posA.x} ${posA.y} Q ${mx} ${my} ${posB.x} ${posB.y}`);
                    path.setAttribute("class", "neural-link-path");
                    path.setAttribute("id", `link-${idA}-${idB}`);
                    svgNeural.appendChild(path);
                }
            });

            // 2. Radial links connecting every node to the central Foundation Core
            nodes.forEach((n, idx) => {
                const pos = getNodeSvgPos(n.id);
                if (!pos) return;

                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                const mx = (pos.x + core.x) / 2 + Math.sin(idx) * 18;
                const my = (pos.y + core.y) / 2 + Math.cos(idx) * 18;

                path.setAttribute("d", `M ${pos.x} ${pos.y} Q ${mx} ${my} ${core.x} ${core.y}`);
                path.setAttribute("class", "neural-link-path");
                path.setAttribute("id", `core-link-${n.id}`);
                svgNeural.appendChild(path);
            });
        }

        // Handle window resize
        window.addEventListener("resize", () => {
            renderNeuralLinks();
        });
        setTimeout(renderNeuralLinks, 100);

        // Node Hover Handlers & Info Panel Update
        nodes.forEach(n => {
            n.addEventListener("mouseenter", (e) => {
                activeHoverNodeId = n.id;
                heroRight.classList.add("has-hover");

                const detail = NODE_DETAILS[n.id];
                const clusterName = n.getAttribute("data-cluster");
                const clusterNodeIds = CLUSTER_BRANCHES[clusterName] || [n.id];

                // 1. Highlight active cluster nodes & links
                nodes.forEach(node => {
                    if (clusterNodeIds.includes(node.id)) {
                        node.classList.add("active-branch");
                    } else {
                        node.classList.remove("active-branch");
                    }
                });

                document.querySelectorAll(".neural-link-path").forEach(link => {
                    const isBranchLink = clusterNodeIds.some(id => link.id.includes(id));
                    if (isBranchLink) {
                        link.classList.add("active-branch");
                    } else {
                        link.classList.remove("active-branch");
                    }
                });

                // 2. Brighten Core Volumetric Halo
                if (coreHalo) {
                    coreHalo.setAttribute("r", "310");
                    coreHalo.style.transition = "all 0.4s ease";
                }

                // 3. Populate & position HUD Info Panel
                if (detail && infoPanel) {
                    infoTitle.textContent = detail.title;
                    infoCluster.textContent = detail.cluster;
                    infoIcon.textContent = detail.icon;
                    infoList.innerHTML = detail.techs.map(t => `<li>${t}</li>`).join("");

                    // Position panel adjacent to node
                    const rect = n.getBoundingClientRect();
                    const heroRect = heroRight.getBoundingClientRect();

                    let leftPos = rect.left - heroRect.left + rect.width + 12;
                    let topPos = rect.top - heroRect.top - 10;

                    // Ensure panel doesn't overflow container bounds
                    if (leftPos + 240 > heroRect.width) {
                        leftPos = rect.left - heroRect.left - 252;
                    }
                    if (topPos + 180 > heroRect.height) {
                        topPos = heroRect.height - 190;
                    }
                    if (topPos < 10) topPos = 10;

                    infoPanel.style.left = `${leftPos}px`;
                    infoPanel.style.top = `${topPos}px`;
                    infoPanel.classList.remove("hidden");
                }
            });

            n.addEventListener("mouseleave", () => {
                activeHoverNodeId = null;
                heroRight.classList.remove("has-hover");

                nodes.forEach(node => node.classList.remove("active-branch"));
                document.querySelectorAll(".neural-link-path").forEach(link => link.classList.remove("active-branch"));

                if (coreHalo) {
                    coreHalo.setAttribute("r", "270");
                }

                if (infoPanel) {
                    infoPanel.classList.add("hidden");
                }
            });
        });

        // Story-Driven Sequential Lifecycle Pulse Animation Loop
        const STORY_SEQUENCE = ["n-dataset", "n-tokenizer", "n-transformer", "n-pretraining", "n-sft", "n-dpo", "n-mmlu", "n-inference", "n-vllm", "n-serving", "n-monitoring"];
        let storyStep = 0;
        const pulseGroup = document.getElementById("svg-story-pulses");

        function spawnStoryPulse() {
            if (!pulseGroup) return;
            const fromId = STORY_SEQUENCE[storyStep];
            const toId = STORY_SEQUENCE[(storyStep + 1) % STORY_SEQUENCE.length];
            storyStep = (storyStep + 1) % STORY_SEQUENCE.length;

            const posA = getNodeSvgPos(fromId);
            const posB = getNodeSvgPos(toId);
            if (!posA || !posB) return;

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("r", "3.5");
            circle.setAttribute("class", "story-pulse");
            circle.setAttribute("cx", posA.x);
            circle.setAttribute("cy", posA.y);
            pulseGroup.appendChild(circle);

            let startTime = null;
            const duration = 1200;

            function animatePulse(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const curX = posA.x + (posB.x - posA.x) * progress;
                const curY = posA.y + (posB.y - posA.y) * progress;

                circle.setAttribute("cx", curX);
                circle.setAttribute("cy", curY);

                if (progress < 1) {
                    requestAnimationFrame(animatePulse);
                } else {
                    if (circle.parentNode) circle.parentNode.removeChild(circle);
                }
            }

            requestAnimationFrame(animatePulse);
        }

        setInterval(spawnStoryPulse, 1600);
    }

    /* Initialize Foundation Core */
    initFoundationCore();
});
