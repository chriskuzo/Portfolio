/* ============================================================
	 TYPED TEXT ANIMATION
	 ============================================================ */
const TYPED_STRINGS = ['Software Developer', 'Full-Stack Engineer', 'Backend Developer', 'Mobile Developer', 'Problem Solver'];
let tIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function tick() {
	const word = TYPED_STRINGS[tIdx];
	typedEl.textContent = deleting ? word.slice(0, cIdx - 1) : word.slice(0, cIdx + 1);
	deleting ? cIdx-- : cIdx++;
	let delay = deleting ? 55 : 110;
	if (!deleting && cIdx === word.length)  { deleting = true; delay = 2000; }
	else if (deleting && cIdx === 0)        { deleting = false; tIdx = (tIdx + 1) % TYPED_STRINGS.length; delay = 350; }
	setTimeout(tick, delay);
}
tick();

/* ============================================================
	 NAVBAR — scroll + mobile menu
	 ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');
const sections  = Array.from(document.querySelectorAll('section[id]'));

window.addEventListener('scroll', () => {
	navbar.classList.toggle('scrolled', window.scrollY > 50);
	// Active nav link based on scroll position
	const scrollMid = window.scrollY + window.innerHeight / 2.5;
	sections.forEach(sec => {
		const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
		if (!link) return;
		const inView = scrollMid >= sec.offsetTop && scrollMid < sec.offsetTop + sec.offsetHeight;
		link.classList.toggle('active', inView);
	});
}, { passive: true });

hamburger.addEventListener('click', () => {
	const open = hamburger.classList.toggle('open');
	navLinks.classList.toggle('open', open);
	document.body.style.overflow = open ? 'hidden' : '';
});

allNavLinks.forEach(l => l.addEventListener('click', () => {
	hamburger.classList.remove('open');
	navLinks.classList.remove('open');
	document.body.style.overflow = '';
}));

/* ============================================================
	 DARK / LIGHT MODE
	 ============================================================ */
const htmlEl     = document.documentElement;
const themeBtn   = document.getElementById('theme-toggle');
const themeIcon  = document.getElementById('theme-icon');

const savedTheme = localStorage.getItem('theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);
setThemeIcon(savedTheme);

themeBtn.addEventListener('click', () => {
	const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
	htmlEl.setAttribute('data-theme', next);
	localStorage.setItem('theme', next);
	setThemeIcon(next);
});

function setThemeIcon(theme) {
	themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ============================================================
	 SCROLL REVEAL — IntersectionObserver
	 ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
	entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Apply reveal class and observe repeated card-type elements
document.querySelectorAll(
	'.project-card, .blog-card, .testimonial-card, .tl-card, .stat-card, .section-header'
).forEach((el, i) => {
	el.classList.add('reveal');
	el.style.transitionDelay = `${(i % 4) * 80}ms`;
	revealObserver.observe(el);
});

/* ============================================================
	 SKILL BARS — animate progress on tab show / scroll into view
	 ============================================================ */
function animateBars(panel) {
	(panel || document.querySelector('.skills-panel.active'))
		?.querySelectorAll('.skill-progress')
		.forEach(bar => {
			bar.style.width = '0';
			requestAnimationFrame(() => {
				requestAnimationFrame(() => { bar.style.width = bar.dataset.width + '%'; });
			});
		});
}

const skillsSection = document.getElementById('skills');
const skillsVisible = new IntersectionObserver(entries => {
	if (entries[0].isIntersecting) { animateBars(); skillsVisible.disconnect(); }
}, { threshold: 0.3 });
if (skillsSection) skillsVisible.observe(skillsSection);

/* ============================================================
	 SKILLS TABS
	 ============================================================ */
document.querySelectorAll('.pill-tab[data-tab]').forEach(tab => {
	tab.addEventListener('click', () => {
		document.querySelectorAll('.pill-tab[data-tab]').forEach(t => {
			t.classList.remove('active');
			t.setAttribute('aria-selected', 'false');
		});
		document.querySelectorAll('.skills-panel').forEach(p => {
			p.classList.remove('active');
			p.hidden = true;
		});
		tab.classList.add('active');
		tab.setAttribute('aria-selected', 'true');
		const panel = document.getElementById('tab-' + tab.dataset.tab);
		panel.classList.add('active');
		panel.hidden = false;
		animateBars(panel);
	});
});

/* ============================================================
	 PROJECT FILTER
	 ============================================================ */
document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
	btn.addEventListener('click', () => {
		document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
		btn.classList.add('active');
		const f = btn.dataset.filter;
		document.querySelectorAll('.project-card').forEach(card => {
			card.classList.toggle('filtered-out', f !== 'all' && card.dataset.category !== f);
		});
	});
});

/* ============================================================
	 BLOG FILTER
	 ============================================================ */
document.querySelectorAll('.filter-btn[data-blog-filter]').forEach(btn => {
	btn.addEventListener('click', () => {
		document.querySelectorAll('.filter-btn[data-blog-filter]').forEach(b => b.classList.remove('active'));
		btn.classList.add('active');
		const f = btn.dataset.blogFilter;
		document.querySelectorAll('.blog-card').forEach(card => {
			card.classList.toggle('filtered-out', f !== 'all' && card.dataset.blogCategory !== f);
		});
	});
});

/* ============================================================
	 EXPERIENCE TIMELINE TABS
	 ============================================================ */
document.querySelectorAll('.pill-tab[data-timeline]').forEach(tab => {
	tab.addEventListener('click', () => {
		document.querySelectorAll('.pill-tab[data-timeline]').forEach(t => {
			t.classList.remove('active');
			t.setAttribute('aria-selected', 'false');
		});
		tab.classList.add('active');
		tab.setAttribute('aria-selected', 'true');
		document.getElementById('timeline-work').classList.toggle('hidden', tab.dataset.timeline !== 'work');
		document.getElementById('timeline-education').classList.toggle('hidden', tab.dataset.timeline !== 'education');
	});
});

/* ============================================================
	 MODAL — project + blog
	 ============================================================ */
const overlay   = document.getElementById('modal-overlay');
const modalBody = document.getElementById('modal-body');
const modalClose= document.getElementById('modal-close');

function openModal(html) {
	modalBody.innerHTML = html;
	overlay.classList.add('active');
	document.body.style.overflow = 'hidden';
	modalClose.focus();
}
function closeModal() {
	overlay.classList.remove('active');
	document.body.style.overflow = '';
}

overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---- Project data ---- */
const PROJECTS = {
	'vr-rubiks': {
		title: "VR Rubik's Game",
		subtitle: 'VR / Game Development · Unity · C#',
		bg: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
		icon: 'fa-vr-cardboard',
		tags: ['C#', 'Unity', 'VR', 'Game Dev', '3D'],
		desc: "An immersive virtual reality Rubik's Cube puzzle game developed in Unity with C#. Players use VR motion controllers to physically interact with the cube in 3D space — twisting, rotating, and solving the puzzle with natural hand movements.",
		features: [
			'Full VR controller support with haptic feedback',
			'Realistic physics-based cube interactions',
			'Multiple cube sizes and difficulty modes',
			'Solve timer, move counter, and personal best tracking'
		],
		github: 'https://github.com/chriskuzo'
	},
	'breast-cancer': {
		title: 'Breast Cancer Detection',
		subtitle: 'Machine Learning · Healthcare · Python',
		bg: 'linear-gradient(135deg,#059669,#10B981)',
		icon: 'fa-brain',
		tags: ['Python', 'Scikit-learn', 'Machine Learning', 'Healthcare'],
		desc: 'A machine learning system for early breast cancer detection trained on the Wisconsin Diagnostic dataset. The model applies multiple classification algorithms — Random Forest, SVM, and kNN — to analyse tumour characteristics and predict malignancy with high accuracy.',
		features: [
			'Data preprocessing, normalisation, and feature engineering',
			'Multi-algorithm comparison (RF, SVM, kNN, Logistic Regression)',
			'5-fold cross-validation and hyperparameter tuning',
			'Evaluation: accuracy ~97%, high recall on malignant class'
		],
		github: 'https://github.com/chriskuzo'
	},
	'museum-search': {
		title: 'Museum Collection Search Engine',
		subtitle: 'Full-Stack Web Development · PHP · MySQL',
		bg: 'linear-gradient(135deg,#0284C7,#06B6D4)',
		icon: 'fa-search',
		tags: ['JavaScript', 'PHP', 'MySQL', 'HTML/CSS', 'Full-Stack'],
		desc: 'A full-stack web application allowing users to search, filter, and explore museum artefact collections. Built with a PHP backend, MySQL relational database, and a dynamic JavaScript frontend delivering real-time search results.',
		features: [
			'Real-time dynamic search with debounced input',
			'PHP RESTful backend with parameterised SQL queries',
			'MySQL relational schema with optimised indexing',
			'Responsive UI with paginated, filterable results'
		],
		github: 'https://github.com/chriskuzo'
	},
	'home-workout': {
		title: 'Home Workout App',
		subtitle: 'Android Mobile Development · Java',
		bg: 'linear-gradient(135deg,#D97706,#F59E0B)',
		icon: 'fa-dumbbell',
		tags: ['Java', 'Android Studio', 'SQLite', 'Mobile'],
		desc: 'A native Android application providing guided home workout routines for all fitness levels. Users can browse an exercise library, build custom plans, and track their progress — all stored locally for full offline support via SQLite.',
		features: [
			'Exercise library with step-by-step instructions',
			'Custom workout plan builder and schedule',
			'Workout history and progress tracking via SQLite',
			'Material Design UI with smooth transitions'
		],
		github: 'https://github.com/chriskuzo'
	}
};

function openProjectModal(id) {
	const d = PROJECTS[id];
	if (!d) return;
	const tagsHtml = d.tags.map(t => `<span class="tag">${t}</span>`).join('');
	const liHtml   = d.features.map(f => `<li>${f}</li>`).join('');
	openModal(`
		<div class="modal-thumb" style="background:${d.bg}"><i class="fas ${d.icon}"></i></div>
		<h2 id="modal-title">${d.title}</h2>
		<p class="m-subtitle">${d.subtitle}</p>
		<div class="tag-row" style="margin-bottom:1rem">${tagsHtml}</div>
		<p>${d.desc}</p>
		<h4>Key Features</h4>
		<ul>${liHtml}</ul>
		<div class="modal-links">
			<a href="${d.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
				<i class="fab fa-github"></i> View on GitHub
			</a>
		</div>
	`);
}

/* ---- Blog data ---- */
const BLOGS = {
	'spring-boot': {
		title: 'Building RESTful APIs with Spring Boot',
		date: 'March 15, 2026', read: '5 min read', cat: 'Web Dev',
		intro: 'Spring Boot makes it remarkably straightforward to build production-ready REST APIs. Here are the essential patterns I use when designing backend services.',
		subhead: 'Defining your Controller',
		code: `@RestController
@RequestMapping("/api/v1/users")
public class UserController {

		@Autowired
		private UserService userService;

		@GetMapping("/{id}")
		public ResponseEntity&lt;UserDto&gt; getUser(@PathVariable Long id) {
				return ResponseEntity.ok(userService.findById(id));
		}

		@PostMapping
		public ResponseEntity&lt;UserDto&gt; createUser(
						@Valid @RequestBody CreateUserRequest req) {
				UserDto created = userService.create(req);
				URI location = URI.create("/api/v1/users/" + created.getId());
				return ResponseEntity.created(location).body(created);
		}
}`,
		outro: 'Use <code>@Valid</code> with Bean Validation annotations (<code>@NotNull</code>, <code>@Email</code>) to auto-validate request bodies. Pair with a <code>@ControllerAdvice</code> global exception handler for consistent, structured error responses. Keep controllers thin — delegate business logic to service classes.'
	},
	'ml-diagnosis': {
		title: 'Machine Learning for Medical Diagnosis',
		date: 'February 28, 2026', read: '7 min read', cat: 'ML / AI',
		intro: 'For my final year project I built a breast cancer detection model using the Wisconsin Diagnostic dataset. Here\'s what I learned about applying ML responsibly to medical data.',
		subhead: 'Model Training & Evaluation',
		code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.metrics import classification_report

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# Cross-validation
scores = cross_val_score(rf, X_train, y_train, cv=5)
print(f"CV Accuracy: {scores.mean():.3f} ± {scores.std():.3f}")

# Full evaluation
y_pred = rf.predict(X_test)
print(classification_report(y_test, y_pred))`,
		outro: 'The Random Forest model achieved ~97% accuracy with high recall on malignant cases — critical because false negatives carry serious consequences. Key insight: in medical ML, <strong>recall matters more than raw accuracy</strong>. Always evaluate models with domain-appropriate metrics.'
	},
	'internship-lessons': {
		title: 'Lessons from My First Dev Internship',
		date: 'January 10, 2026', read: '4 min read', cat: 'Career',
		intro: 'My backend internship at Beno Holding Ltd was a pivotal experience. Here are the most valuable lessons I took away.',
		subhead: 'Write atomic, descriptive commits',
		code: `# Bad: one massive commit
git commit -m "fixed stuff and added features"

# Good: small, focused, descriptive commits
git commit -m "feat(auth): add JWT refresh token endpoint"
git commit -m "fix(user): correct null check in profile update"
git commit -m "test(auth): add unit tests for token expiry"`,
		outro: 'Other key lessons: ask questions early and often (it saves everyone time), read the codebase before writing a single line, and treat code review comments as free mentorship. Your technical skills grow with time — but professional habits compound fastest.'
	}
};

function openBlogModal(id) {
	const d = BLOGS[id];
	if (!d) return;
	openModal(`
		<span class="section-tag" style="margin-bottom:.75rem;display:inline-block">${d.cat}</span>
		<h2 id="modal-title" style="margin-bottom:.35rem">${d.title}</h2>
		<div style="display:flex;gap:1rem;font-size:.76rem;color:var(--text-muted);margin-bottom:1.1rem">
			<span><i class="fas fa-calendar" style="color:var(--primary);margin-right:.3rem"></i>${d.date}</span>
			<span><i class="fas fa-clock" style="color:var(--primary);margin-right:.3rem"></i>${d.read}</span>
		</div>
		<p>${d.intro}</p>
		<h4>${d.subhead}</h4>
		<div class="code-block"><code>${d.code}</code></div>
		<p>${d.outro}</p>
	`);
}

/* ============================================================
	 CONTACT FORM VALIDATION
	 ============================================================ */
const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');

contactForm.addEventListener('submit', e => {
	e.preventDefault();
	if (!validateForm()) return;

	submitBtn.classList.add('loading');
	submitBtn.disabled = true;

	// Simulate async send (integrate a real backend/Formspree endpoint here)
	setTimeout(() => {
		submitBtn.classList.remove('loading');
		submitBtn.disabled = false;
		formSuccess.classList.remove('hidden');
		contactForm.reset();
		setTimeout(() => formSuccess.classList.add('hidden'), 6000);
	}, 1500);
});

function validateForm() {
	clearErrors();
	let ok = true;
	const name    = document.getElementById('f-name');
	const email   = document.getElementById('f-email');
	const message = document.getElementById('f-message');

	if (!name.value.trim()) {
		setError(name, 'err-name', 'Please enter your name.');
		ok = false;
	}
	if (!email.value.trim()) {
		setError(email, 'err-email', 'Please enter your email address.');
		ok = false;
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
		setError(email, 'err-email', 'Please enter a valid email address.');
		ok = false;
	}
	if (!message.value.trim()) {
		setError(message, 'err-message', 'Please enter a message.');
		ok = false;
	} else if (message.value.trim().length < 10) {
		setError(message, 'err-message', 'Message must be at least 10 characters.');
		ok = false;
	}
	return ok;
}

function setError(input, errId, msg) {
	input.classList.add('error');
	document.getElementById(errId).textContent = msg;
}

function clearErrors() {
	document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
	document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

['f-name', 'f-email', 'f-message'].forEach(id => {
	document.getElementById(id).addEventListener('input', function () {
		this.classList.remove('error');
		document.getElementById('err-' + id.replace('f-', '')).textContent = '';
	});
});
