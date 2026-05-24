lucide.createIcons();

/* ===== EMAILJS CONFIG ===== */
const EMAILJS_PUBLIC_KEY = "OPBZfewXmH_zGF6td";
const EMAILJS_SERVICE_ID = "service_ehwnj8s";
const EMAILJS_TEMPLATE_ID = "template_az51r74";

emailjs.init(EMAILJS_PUBLIC_KEY);

/* ===== TOAST ===== */
const SVG_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const SVG_ERROR = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.querySelector(".toast-icon").innerHTML = type === "error" ? SVG_ERROR : SVG_CHECK;
    toast.querySelector(".toast-text").textContent = message;
    toast.className = "toast " + (type === "error" ? "toast-error" : "toast-success");

    requestAnimationFrame(() => toast.classList.add("show"));

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 4000);
}

/* ===== FORM SUBMIT ===== */
document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submit-btn");
    const btnText = document.getElementById("btn-text");
    const btnLoading = document.getElementById("btn-loading");

    // Validate message length
    const message = this.querySelector("textarea[name='message']").value.trim();
    if (message.length < 20) {
        showToast("Message must be at least 20 characters.", "error");
        return;
    }

    btnText.style.display = "none";
    btnLoading.style.display = "inline";
    submitBtn.disabled = true;

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
        .then(() => {
            showToast("Message sent successfully!");
            this.reset();
        })
        .catch(() => {
            showToast("Something went wrong. Please try again.", "error");
        })
        .finally(() => {
            btnText.style.display = "inline";
            btnLoading.style.display = "none";
            submitBtn.disabled = false;
        });
});

/* ===== THEME ===== */
const toggle = document.getElementById("toggle");

function setIcon(mode) {
    toggle.innerHTML = mode === "dark"
        ? '<i data-lucide="sun" stroke-width="1.5"></i>'
        : '<i data-lucide="moon" stroke-width="1.5"></i>';
    lucide.createIcons();
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    setIcon("dark");
} else {
    setIcon("light");
}

toggle.onclick = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setIcon(isDark ? "dark" : "light");
    const active = document.querySelector(".menu a.active");
    if (active) moveHighlight(active);
};

/* ===== NAVBAR ===== */
const links = document.querySelectorAll(".navbar a");
const highlight = document.querySelector(".highlight");

function moveHighlight(el) {
    highlight.style.width = el.offsetWidth + "px";
    highlight.style.left = el.offsetLeft + "px";
}

function setActive(link) {
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    moveHighlight(link);
}

links.forEach(link => {
    link.addEventListener("click", () => setActive(link));
});

function onScroll() {
    const scrollY = window.scrollY + window.innerHeight / 3;
    let currentId = null;
    links.forEach(link => {
        const href = link.getAttribute("href");
        if (!href.startsWith("#")) return;
        const section = document.querySelector(href);
        if (section && section.offsetTop <= scrollY) currentId = href;
    });
    if (currentId) {
        const activeLink = document.querySelector(`.navbar a[href="${currentId}"]`);
        if (activeLink && !activeLink.classList.contains("active")) setActive(activeLink);
    }
}

window.addEventListener("scroll", onScroll);
window.addEventListener("load", () => {
    onScroll();
    const active = document.querySelector(".navbar a.active");
    if (active) moveHighlight(active);
});
window.addEventListener("resize", () => {
    const active = document.querySelector(".navbar a.active");
    if (active) moveHighlight(active);
});
const observer2 = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.bar').forEach(bar => {
                bar.style.width = bar.style.getPropertyValue('--w');
            });
        }
    });
}, { threshold: 0.3 });
const skillsSection = document.querySelector('#skills');
if (skillsSection) observer2.observe(skillsSection);