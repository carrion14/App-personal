document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('newTaskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const backToIndexBtn = document.getElementById('backToIndexBtn');

    // Cargar tareas al iniciar
    loadTasks();

    // Evento para añadir tarea
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Evento para volver a index.html
    backToIndexBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Función para añadir una tarea
    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            const task = {
                text: taskText,
                completed: false,
                date: new Date().toDateString() // Guarda la fecha de creación
            };
            saveTask(task);
            renderTask(task);
            newTaskInput.value = '';
        }
    }

    // Función para renderizar una tarea en la lista
    function renderTask(task) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span>${task.text}</span>
        `;
        if (task.completed) {
            listItem.classList.add('completed');
        }

        // Evento para marcar/desmarcar tarea
        const checkbox = listItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            if (task.completed) {
                listItem.classList.add('completed');
            } else {
                listItem.classList.remove('completed');
            }
            updateTask(task); // Actualiza el estado en localStorage
        });

        taskList.appendChild(listItem);
    }

    // Funciones para guardar/cargar/actualizar tareas en localStorage
    function getTasks() {
        return JSON.parse(localStorage.getItem('dailyTasks')) || [];
    }

    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('dailyTasks', JSON.stringify(tasks));
    }

    function updateTask(updatedTask) {
        let tasks = getTasks();
        tasks = tasks.map(task => task.text === updatedTask.text && task.date === updatedTask.date ? updatedTask : task);
        localStorage.setItem('dailyTasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = getTasks();
        const today = new Date().toDateString();

        // Filtrar tareas: si la fecha de creación no es hoy, se eliminan las completadas
        // Si la fecha de creación es de otro día, pero no está completada, se mantiene
        const filteredTasks = tasks.filter(task => {
            if (task.date !== today && task.completed) {
                return false; // Eliminar tareas completadas de días anteriores
            }
            if (task.date !== today && !task.completed) {
                // Si es de otro día y no está completada, la "reseteamos" a no completada para hoy
                task.completed = false;
                task.date = today; // Actualizamos la fecha para que sea una tarea "nueva" para hoy
            }
            return true; // Mantener tareas no completadas o tareas de hoy
        });

        // Limpiar la lista visual antes de renderizar
        taskList.innerHTML = '';
        filteredTasks.forEach(task => renderTask(task));
        localStorage.setItem('dailyTasks', JSON.stringify(filteredTasks)); // Guardar el estado filtrado
    }
});