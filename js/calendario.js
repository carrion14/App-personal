// Función para formatear fecha a YYYY-MM-DD sin desfase por zona horaria
function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Variables globales
let selectedDate = null;
let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
let editingEventId = null;

// Mostrar u ocultar campos de hora según checkbox "todo el día"
function toggleTimeInputs() {
  const allDay = document.getElementById('allDayCheckbox').checked;
  const timeContainer = document.getElementById('timeRangeContainer');
  if (allDay) {
    timeContainer.style.display = 'none';
    document.getElementById('eventStartTime').required = false;
    document.getElementById('eventEndTime').required = false;
  } else {
    timeContainer.style.display = 'block';
    document.getElementById('eventStartTime').required = true;
    document.getElementById('eventEndTime').required = true;
  }
}

// Crear calendario del mes actual
function createCalendar(year, month) {
  const calendarDiv = document.getElementById('calendar');
  calendarDiv.innerHTML = '';

  const date = new Date(year, month, 1);
  const firstDay = date.getDay(); // domingo=0 ... sábado=6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Crear tabla
  const table = document.createElement('table');

  // Cabecera con días de la semana
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  daysOfWeek.forEach(day => {
    const th = document.createElement('th');
    th.textContent = day;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Cuerpo con días
  const tbody = document.createElement('tbody');
  let row = document.createElement('tr');
  let dayCount = 0;

  // Rellenar celdas vacías antes del primer día
  for (let i = 0; i < firstDay; i++) {
    const td = document.createElement('td');
    row.appendChild(td);
    dayCount++;
  }

  // Rellenar días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    if (dayCount % 7 === 0) {
      tbody.appendChild(row);
      row = document.createElement('tr');
    }
    const td = document.createElement('td');
    td.textContent = day;

    // Marcar hoy
    const today = new Date();
    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      td.classList.add('today');
    }

    // Marcar seleccionado
    if (selectedDate &&
        day === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear()) {
      td.classList.add('selected');
    }

    // Añadir marcas de eventos con colores
    const dateStr = formatDateToYYYYMMDD(new Date(year, month, day));
    const dayEvents = events.filter(ev => ev.date === dateStr);
    if (dayEvents.length > 0) {
      const markersDiv = document.createElement('div');
      markersDiv.classList.add('event-markers');

      // Obtener colores únicos (máximo 3)
      const uniqueColors = [...new Set(dayEvents.map(ev => ev.color || '#007aff'))].slice(0,3);

      uniqueColors.forEach(color => {
        const marker = document.createElement('span');
        marker.classList.add('event-marker');
        marker.style.backgroundColor = color;
        markersDiv.appendChild(marker);
      });

      td.appendChild(markersDiv);
    }

    td.addEventListener('click', () => {
      selectedDate = new Date(year, month, day);
      createCalendar(year, month);
      showEventsForSelectedDate();
    });

    row.appendChild(td);
    dayCount++;
  }

  // Rellenar celdas vacías al final para completar la semana
  while (dayCount % 7 !== 0) {
    const td = document.createElement('td');
    row.appendChild(td);
    dayCount++;
  }
  tbody.appendChild(row);
  table.appendChild(tbody);

  calendarDiv.appendChild(table);
}

// Mostrar eventos para la fecha seleccionada
function showEventsForSelectedDate() {
  const container = document.getElementById('eventsContainer');
  container.innerHTML = '';

  if (!selectedDate) {
    container.textContent = 'Selecciona un día para ver eventos';
    return;
  }

  const dateStr = formatDateToYYYYMMDD(selectedDate);
  const dayEvents = events.filter(ev => ev.date === dateStr);

  if (dayEvents.length === 0) {
    container.textContent = 'No hay eventos para este día.';
    return;
  }

  dayEvents.sort((a,b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    if (a.allDay && b.allDay) return 0;
    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  dayEvents.forEach(ev => {
    const div = document.createElement('div');
    div.classList.add('event-item');

    let timeText = ev.allDay ? 'Todo el día' : `${ev.startTime} - ${ev.endTime}`;
    const info = document.createElement('div');
    info.textContent = `${timeText} - ${ev.title} ${ev.repeat !== 'none' ? `(Repite: ${repeatText(ev.repeat)})` : ''}`;
    info.style.color = ev.color || '#007aff';

    const actions = document.createElement('div');
    actions.classList.add('event-actions');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => openEditModal(ev.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.addEventListener('click', () => deleteEvent(ev.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(info);
    div.appendChild(actions);

    container.appendChild(div);
  });
}

// Texto legible para la opción de repetición
function repeatText(value) {
  switch(value) {
    case 'none': return 'No repetir';
    case 'daily': return 'Cada día';
    case 'every2days': return 'Cada 2 días';
    case 'weekly': return 'Cada semana';
    case 'every2weeks': return 'Cada 2 semanas';
    case 'monthly': return 'Cada mes';
    case 'yearly': return 'Cada año';
    default: return '';
  }
}

// Abrir modal para crear evento
function openCreateModal() {
  editingEventId = null;
  document.getElementById('modalTitle').textContent = 'Crear Evento';
  document.getElementById('eventTitle').value = '';
  document.getElementById('eventDate').value = selectedDate ? formatDateToYYYYMMDD(selectedDate) : '';
  document.getElementById('allDayCheckbox').checked = false;
  document.getElementById('eventStartTime').value = '';
  document.getElementById('eventEndTime').value = '';
  document.getElementById('eventColor').value = '#007aff';
  document.getElementById('repeatSelect').value = 'none';
  toggleTimeInputs();
  document.getElementById('eventModal').style.display = 'flex';
}

// Abrir modal para editar evento
function openEditModal(id) {
  const ev = events.find(e => e.id === id);
  if (!ev) return;
  editingEventId = id;
  document.getElementById('modalTitle').textContent = 'Editar Evento';
  document.getElementById('eventTitle').value = ev.title;
  document.getElementById('eventDate').value = ev.date;
  document.getElementById('allDayCheckbox').checked = ev.allDay;
  document.getElementById('eventStartTime').value = ev.startTime || '';
  document.getElementById('eventEndTime').value = ev.endTime || '';
  document.getElementById('eventColor').value = ev.color || '#007aff';
  document.getElementById('repeatSelect').value = ev.repeat || 'none';
  toggleTimeInputs();
  document.getElementById('eventModal').style.display = 'flex';
}

// Guardar evento (crear o editar)
function saveEvent(e) {
  e.preventDefault();
  const title = document.getElementById('eventTitle').value.trim();
  const date = document.getElementById('eventDate').value;
  const allDay = document.getElementById('allDayCheckbox').checked;
  const startTime = allDay ? null : document.getElementById('eventStartTime').value;
  const endTime = allDay ? null : document.getElementById('eventEndTime').value;
  const color = document.getElementById('eventColor').value;
  const repeat = document.getElementById('repeatSelect').value;

  if (!title || !date) return alert('Por favor, completa los campos obligatorios.');

  if (!allDay && (!startTime || !endTime)) {
    return alert('Por favor, completa la hora de inicio y fin.');
  }

  if (!allDay && startTime >= endTime) {
    return alert('La hora de fin debe ser posterior a la hora de inicio.');
  }

  // Función para sumar días, semanas, meses o años a una fecha
  function addToDate(dateStr, repeatType, count) {
    const d = new Date(dateStr);
    switch(repeatType) {
      case 'daily': d.setDate(d.getDate() + count); break;
      case 'every2days': d.setDate(d.getDate() + 2 * count); break;
      case 'weekly': d.setDate(d.getDate() + 7 * count); break;
      case 'every2weeks': d.setDate(d.getDate() + 14 * count); break;
      case 'monthly': d.setMonth(d.getMonth() + count); break;
      case 'yearly': d.setFullYear(d.getFullYear() + count); break;
      default: break;
    }
    return formatDateToYYYYMMDD(d);
  }

  if (editingEventId) {
    // Editar solo el evento original (no se actualizan repeticiones)
    const evIndex = events.findIndex(ev => ev.id === editingEventId);
    if (evIndex !== -1) {
      events[evIndex] = { id: editingEventId, title, date, allDay, startTime, endTime, color, repeat };
    }
  } else {
    // Crear nuevo evento y repeticiones si aplica
    const newEvent = {
      id: Date.now().toString(),
      title,
      date,
      allDay,
      startTime,
      endTime,
      color,
      repeat
    };
    events.push(newEvent);

    // Crear repeticiones (máximo 10)
    if (repeat !== 'none') {
      for (let i = 1; i <= 10; i++) {
        const newDate = addToDate(date, repeat, i);
        const repeatedEvent = {
          id: (Date.now() + i).toString(),
          title,
          date: newDate,
          allDay,
          startTime,
          endTime,
          color,
          repeat
        };
        events.push(repeatedEvent);
      }
    }
  }

  localStorage.setItem('calendarEvents', JSON.stringify(events));
  document.getElementById('eventModal').style.display = 'none';

  if (selectedDate && formatDateToYYYYMMDD(selectedDate) === date) {
    showEventsForSelectedDate();
  }
}

// Borrar evento
function deleteEvent(id) {
  if (!confirm('¿Seguro que quieres borrar este evento?')) return;
  events = events.filter(ev => ev.id !== id);
  localStorage.setItem('calendarEvents', JSON.stringify(events));
  showEventsForSelectedDate();
}

// Cerrar modal
function closeModal() {
  document.getElementById('eventModal').style.display = 'none';
}

// Inicialización
window.onload = () => {
  const today = new Date();
  selectedDate = today;
  createCalendar(today.getFullYear(), today.getMonth());
  showEventsForSelectedDate();

  document.getElementById('createEventBtn').addEventListener('click', openCreateModal);
  document.querySelector('#eventModal .cancel-btn').addEventListener('click', closeModal);
  document.getElementById('eventForm').addEventListener('submit', saveEvent);
  document.getElementById('allDayCheckbox').addEventListener('change', toggleTimeInputs);

  // Botón atrás
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'index.html'; // Cambia si tu página principal tiene otro nombre
    });
  }
};