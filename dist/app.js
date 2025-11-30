"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ModalManager {
    constructor(modalId, openBtnId) {
        var _a;
        this.modal = document.getElementById(modalId);
        this.closeBtn = (_a = this.modal) === null || _a === void 0 ? void 0 : _a.querySelector(".close");
        this.openBtn = document.getElementById(openBtnId);
        this.init();
    }
    init() {
        if (!this.modal || !this.openBtn)
            return;
        this.openBtn.addEventListener("click", () => this.open());
        if (this.closeBtn) {
            this.closeBtn.addEventListener("click", () => this.close());
        }
        this.modal.addEventListener("click", (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        document.addEventListener("keydown", (e) => {
            var _a;
            if (e.key === "Escape" && ((_a = this.modal) === null || _a === void 0 ? void 0 : _a.classList.contains("show"))) {
                this.close();
            }
        });
    }
    open() {
        if (this.modal) {
            this.modal.classList.add("show");
            document.body.style.overflow = "hidden";
        }
    }
    close() {
        if (this.modal) {
            this.modal.classList.remove("show");
            document.body.style.overflow = "";
        }
    }
}
class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll(".section");
        this.init();
    }
    init() {
        window.addEventListener("scroll", () => this.checkVisibility());
        this.checkVisibility();
    }
    checkVisibility() {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.75;
        this.sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < triggerPoint && rect.bottom > 0;
            if (isVisible) {
                section.classList.add("visible");
            }
        });
    }
}
class PostsManager {
    constructor(loadBtnId, containerId, spinnerId) {
        this.apiUrl = "https://jsonplaceholder.typicode.com/posts";
        this.loadedPosts = [];
        this.loadBtn = document.getElementById(loadBtnId);
        this.container = document.getElementById(containerId);
        this.spinner = document.getElementById(spinnerId);
        this.init();
    }
    init() {
        if (!this.loadBtn)
            return;
        this.loadBtn.addEventListener("click", () => this.loadPosts());
    }
    loadPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.container || !this.spinner || !this.loadBtn)
                return;
            this.spinner.classList.remove("hidden");
            this.loadBtn.setAttribute("disabled", "true");
            this.container.innerHTML = "";
            try {
                const response = yield fetch(this.apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const posts = yield response.json();
                this.loadedPosts = posts.slice(0, 9);
                this.displayPosts(this.loadedPosts);
            }
            catch (error) {
                console.error("Помилка при завантаженні постів:", error);
                if (this.container) {
                    this.container.innerHTML =
                        '<p style="color: red; text-align: center;">Помилка при завантаженні даних. Спробуйте ще раз.</p>';
                }
            }
            finally {
                this.spinner.classList.add("hidden");
                if (this.loadBtn) {
                    this.loadBtn.removeAttribute("disabled");
                }
            }
        });
    }
    displayPosts(posts) {
        if (!this.container)
            return;
        posts.forEach((post, index) => {
            const postCard = document.createElement("div");
            postCard.className = "post-card";
            postCard.style.animationDelay = `${index * 0.1}s`;
            postCard.innerHTML = `
                <h3>${this.escapeHtml(post.title)}</h3>
                <p>${this.escapeHtml(post.body)}</p>
                <p style="margin-top: 1rem; color: #667eea; font-weight: bold;">ID: ${post.id} | User ID: ${post.userId}</p>
            `;
            postCard.addEventListener("click", () => this.handlePostClick(post));
            postCard.addEventListener("mouseenter", () => (postCard.style.transform = "translateY(-5px) scale(1.02)"));
            postCard.addEventListener("mouseleave", () => (postCard.style.transform = "translateY(0) scale(1)"));
            if (this.container) {
                this.container.appendChild(postCard);
            }
        });
    }
    handlePostClick(post) {
        console.log("Клік на пост:", post);
        alert(`Пост #${post.id}\n\n${post.title}\n\n${post.body}`);
    }
    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
}
class SmoothScroll {
    constructor() {
        this.init();
    }
    init() {
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const targetId = link.getAttribute("href");
                if (targetId && targetId.startsWith("#")) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 80;
                        window.scrollTo({ top: offsetTop, behavior: "smooth" });
                    }
                }
            });
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new ModalManager("modal", "openModalBtn");
    new ScrollAnimations();
    new PostsManager("loadPostsBtn", "postsContainer", "loadingSpinner");
    new SmoothScroll();
    const header = document.querySelector(".header");
    if (header) {
        window.addEventListener("scroll", () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 100) {
                header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
            }
            else {
                header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
            }
        });
    }
    console.log("Всі компоненти ініціалізовано успішно!");
});
