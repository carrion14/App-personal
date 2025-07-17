// Función para formatear fecha a YYYY-MM-DD sin desfase por zona horaria
function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Cargar tareas del calendario para hoy desde LocalStorage
function loadTodayTasksFromCalendar() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  const todayStr = formatDateToYYYYMMDD(new Date());
  const events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

  // Filtrar eventos para hoy y ordenar por hora
  const todayEvents = events.filter(ev => ev.date === todayStr);
  todayEvents.sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    if (a.allDay && b.allDay) return 0;
    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  if (todayEvents.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No hay tareas para hoy.';
    list.appendChild(li);
    return;
  }

  todayEvents.forEach(ev => {
    const li = document.createElement('li');
    const timeText = ev.allDay ? 'Todo el día' : `${ev.startTime} - ${ev.endTime}`;
    li.textContent = `${timeText} - ${ev.title}`;
    list.appendChild(li);
  });
}

// Configurar eventos de botones
function setupButtons() {
  document.getElementById('btnCalendar').addEventListener('click', () => {
    window.location.href = 'calendario.html'; // Cambia la ruta si es necesario
  });
  document.getElementById('btnToDo').addEventListener('click', () => {
    window.location.href = 'todo.html';
  });
  document.getElementById('btnTOC').addEventListener('click', () => {
    window.location.href = 'toc.html';
  });
  document.getElementById('btnFinanzas').addEventListener('click', () => {
    window.location.href = 'finanzas.html';
  });
}

// Inicialización al cargar la página
window.onload = () => {
  loadTodayTasksFromCalendar();
  setupButtons();
};