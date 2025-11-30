interface Post {
	userId: number;
	id: number;
	title: string;
	body: string;
}

class ModalManager {
	private modal: HTMLElement | null;
	private closeBtn: HTMLElement | null;
	private openBtn: HTMLElement | null;

	constructor(modalId: string, openBtnId: string) {
		this.modal = document.getElementById(modalId);
		this.closeBtn = this.modal?.querySelector(".close") as HTMLElement | null;
		this.openBtn = document.getElementById(openBtnId);

		this.init();
	}

	private init(): void {
		if (!this.modal || !this.openBtn) return;

		this.openBtn.addEventListener("click", () => this.open());

		if (this.closeBtn) {
			this.closeBtn.addEventListener("click", () => this.close());
		}

		this.modal.addEventListener("click", (e: MouseEvent) => {
			if (e.target === this.modal) {
				this.close();
			}
		});

		document.addEventListener("keydown", (e: KeyboardEvent) => {
			if (e.key === "Escape" && this.modal?.classList.contains("show")) {
				this.close();
			}
		});
	}

	private open(): void {
		if (this.modal) {
			this.modal.classList.add("show");

			document.body.style.overflow = "hidden";
		}
	}

	private close(): void {
		if (this.modal) {
			this.modal.classList.remove("show");

			document.body.style.overflow = "";
		}
	}
}

class ScrollAnimations {
	private sections: NodeListOf<HTMLElement>;

	constructor() {
		this.sections = document.querySelectorAll(".section");

		this.init();
	}

	private init(): void {
		window.addEventListener("scroll", () => this.checkVisibility());

		this.checkVisibility();
	}

	private checkVisibility(): void {
		const windowHeight: number = window.innerHeight;
		const triggerPoint: number = windowHeight * 0.75;

		this.sections.forEach((section: HTMLElement) => {
			const rect: DOMRect = section.getBoundingClientRect();
			const isVisible: boolean = rect.top < triggerPoint && rect.bottom > 0;

			if (isVisible) {
				section.classList.add("visible");
			}
		});
	}
}

class PostsManager {
	private loadBtn: HTMLElement | null;
	private container: HTMLElement | null;
	private spinner: HTMLElement | null;
	private apiUrl: string = "https://jsonplaceholder.typicode.com/posts";
	private loadedPosts: Post[] = [];

	constructor(loadBtnId: string, containerId: string, spinnerId: string) {
		this.loadBtn = document.getElementById(loadBtnId);
		this.container = document.getElementById(containerId);
		this.spinner = document.getElementById(spinnerId);

		this.init();
	}

	private init(): void {
		if (!this.loadBtn) return;

		this.loadBtn.addEventListener("click", () => this.loadPosts());
	}

	private async loadPosts(): Promise<void> {
		if (!this.container || !this.spinner || !this.loadBtn) return;

		this.spinner.classList.remove("hidden");
		this.loadBtn.setAttribute("disabled", "true");
		this.container.innerHTML = "";

		try {
			const response: Response = await fetch(this.apiUrl);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const posts: Post[] = await response.json();
			this.loadedPosts = posts.slice(0, 9);

			this.displayPosts(this.loadedPosts);
		} catch (error: unknown) {
			console.error("Помилка при завантаженні постів:", error);

			if (this.container) {
				this.container.innerHTML =
					'<p style="color: red; text-align: center;">Помилка при завантаженні даних. Спробуйте ще раз.</p>';
			}
		} finally {
			this.spinner.classList.add("hidden");

			if (this.loadBtn) {
				this.loadBtn.removeAttribute("disabled");
			}
		}
	}

	private displayPosts(posts: Post[]): void {
		if (!this.container) return;

		posts.forEach((post: Post, index: number) => {
			const postCard: HTMLElement = document.createElement("div");

			postCard.className = "post-card";
			postCard.style.animationDelay = `${index * 0.1}s`;

			postCard.innerHTML = `
                <h3>${this.escapeHtml(post.title)}</h3>
                <p>${this.escapeHtml(post.body)}</p>
                <p style="margin-top: 1rem; color: #667eea; font-weight: bold;">ID: ${post.id} | User ID: ${
				post.userId
			}</p>
            `;

			postCard.addEventListener("click", () => this.handlePostClick(post));

			postCard.addEventListener("mouseenter", () => (postCard.style.transform = "translateY(-5px) scale(1.02)"));

			postCard.addEventListener("mouseleave", () => (postCard.style.transform = "translateY(0) scale(1)"));

			if (this.container) {
				this.container.appendChild(postCard);
			}
		});
	}

	private handlePostClick(post: Post): void {
		console.log("Клік на пост:", post);

		alert(`Пост #${post.id}\n\n${post.title}\n\n${post.body}`);
	}

	private escapeHtml(text: string): string {
		const div: HTMLDivElement = document.createElement("div");

		div.textContent = text;

		return div.innerHTML;
	}
}

class SmoothScroll {
	constructor() {
		this.init();
	}

	private init(): void {
		const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".nav-link");

		navLinks.forEach((link: HTMLAnchorElement) => {
			link.addEventListener("click", (e: MouseEvent) => {
				e.preventDefault();

				const targetId: string | null = link.getAttribute("href");

				if (targetId && targetId.startsWith("#")) {
					const targetElement: HTMLElement | null = document.querySelector(targetId);

					if (targetElement) {
						const offsetTop: number = targetElement.offsetTop - 80;

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

	const header: HTMLElement | null = document.querySelector(".header");

	if (header) {
		window.addEventListener("scroll", () => {
			const currentScroll: number = window.pageYOffset;

			if (currentScroll > 100) {
				header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
			} else {
				header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
			}
		});
	}

	console.log("Всі компоненти ініціалізовано успішно!");
});
