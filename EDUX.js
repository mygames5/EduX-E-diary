/* EDUX JS — весь интерактив, каждый пиксель анимирован */

    // 1. 3D тилт + блик на карточках
    // теперь карточки живые
    document.querySelectorAll('.news-card, .review-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            const tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
            const tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * -10;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.025, 1.025, 1.025)`;
            const glare = card.querySelector('.card-glare');
            if (glare) {
                glare.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.2) 0%, transparent 65%)`;
                glare.style.opacity = '1';
            }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            const glare = card.querySelector('.card-glare');
            if (glare) glare.style.opacity = '0';
        });
    });

    //  2. intersectionObserver — появление при скролле 
    // добавляю stagger задержку через data атрибут
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // отписываемся — не надо перезапускать
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(
        '.news-card, .review-card, .section-header, .glass-card, .footer-contact-item, .hero-stat, .hero-badge, .hero-subtitle'
    ).forEach(el => observer.observe(el));

    //  3. ripple эффект на кнопках,чисто  
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.classList.add('btn-ripple');
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top  = (e.clientY - rect.top) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    //  4. параллакс на hero картинке при скролле —
    // плавно двигает картинку чуть медленнее фона
    const heroImg = document.querySelector('.hero-image');
    if (heroImg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            heroImg.style.transform = `translateY(${scrollY * 0.12}px)`;
        }, { passive: true });
    }

    //  5. Счётчик цифр в стат карточках hero 
    // появляются с нуля до нужного числа, как на дашбордах
    // function animateCounter(el) {
    //     const target = el.dataset.target;
    //     const isPercent = target.includes('%');
    //     const isK = target.includes('K');
    //     const num = parseFloat(target);
    //     let start = 0;
    //     const duration = 1400;
    //     const startTime = performance.now();

    //     function update(now) {
    //         const elapsed = now - startTime;
    //         const progress = Math.min(elapsed / duration, 1);
    //         // ease out cubic
    //         const eased = 1 - Math.pow(1 - progress, 3);
    //         const current = Math.floor(eased * num);
    //         el.textContent = isPercent ? current + '%' : isK ? current + 'K+' : current;
    //         if (progress < 1) requestAnimationFrame(update);
    //     }
    //     requestAnimationFrame(update);
    // }

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl = entry.target.querySelector('.stat-num');
                if (numEl && numEl.dataset.target) animateCounter(numEl);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hero-stat').forEach(s => statObserver.observe(s));

    // 6. активный nav-линк при скролле
    // подсвечивает текущую секцию в меню
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('nav-link--active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('nav-link--active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => navObserver.observe(s));

    // 7. FAQ: закрывать другие при открытии нового 
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('toggle', function() {
            if (this.open) {
                document.querySelectorAll('.faq-item[open]').forEach(other => {
                    if (other !== this) other.removeAttribute('open');
                });
            }
        });
    });

    // 8. AUTH MODAL — открытие / закрытие
    const openBtn  = document.getElementById("openModal");
    const closeBtn = document.getElementById("closeModal");
    const modal    = document.getElementById("modal");

    function openModal() {
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    }
    function closeModal() {
        modal.classList.remove("open");
        document.body.style.overflow = "";
    }

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);

    // клик по оверлею (вне карточки) закрывает
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Escape закрывает
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });

    // ===== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// при загрузке — восстанавливаем сохранённую тему из localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    // меняем иконку
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';

    // плавная анимация перехода на весь экран
    themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => { themeToggle.style.transform = ''; }, 300);
});

// ===== ЛОГИКА КНОПКИ "ЗАБЫЛИ ПАРОЛЬ" =====
const forgotBtn = document.getElementById('forgotBtn');
const forgotMsg = document.getElementById('forgotMsg');

if (forgotBtn && forgotMsg) {
    forgotBtn.addEventListener('click', (e) => {
        e.preventDefault(); // отменяем стандартный прыжок страницы наверх от href="#"
        
        // переключаем класс show (показываем/скрываем сообщение)
        forgotMsg.classList.toggle('show');
    });
}