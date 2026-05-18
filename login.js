// ===== ЗАЩИТА СТРАНИЦЫ =====
// Закомментировано: теперь дневник открывается напрямую без логина
// if (localStorage.getItem('isAuth') !== 'true') {
//     window.location.href = 'index.html';
// }

document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('isAuth');
    window.location.href = 'index.html';
});

// ===== КАЛЕНДАРЬ =====
const calendarGrid = document.getElementById("calendarGrid");
const monthYear = document.getElementById("monthYear");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

let currentDate = new Date();

const events = {
    "2026-05-31": "exam",
    "2026-05-18": "homework",
};

function renderCalendar(date) {
    calendarGrid.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay() || 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = date.toLocaleString("ru", {
        month: "long",
        year: "numeric",
    });

    for (let i = 1; i < firstDay; i++) {
        calendarGrid.innerHTML += `<div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const div = document.createElement("div");
        div.classList.add("day");
        div.textContent = day;

        const today = new Date();
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            div.classList.add("today");
        }

        if (events[fullDate]) {
            div.classList.add(events[fullDate]);
        }

        calendarGrid.appendChild(div);
    }
}

prevBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
};

nextBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
};

renderCalendar(currentDate);

// ===== АНИМИРОВАННАЯ ДАТА =====
const dateEl = document.getElementById("currentDate");

function getFormattedDate() {
    const now = new Date();
    return now.toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

let currentText = "";

function updateDateAnimated() {
    const newText = getFormattedDate();
    if (newText === currentText) return;

    dateEl.classList.add("date-exit");

    setTimeout(() => {
        dateEl.textContent = newText;
        dateEl.classList.remove("date-exit");
        dateEl.classList.add("date-enter");

        requestAnimationFrame(() => {
            dateEl.classList.add("date-enter-active");
        });

        setTimeout(() => {
            dateEl.classList.remove("date-enter", "date-enter-active");
        }, 400);

        currentText = newText;
    }, 200);
}

updateDateAnimated();
setInterval(updateDateAnimated, 60000);