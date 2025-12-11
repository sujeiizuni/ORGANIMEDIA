// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Variables globales
let currentUser = null;
let currentDate = new Date();
let selectedDate = new Date();
let tasks = [];
let authToken = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay token de autenticación
    const token = localStorage.getItem('organimedia_token');
    const userData = localStorage.getItem('organimedia_user');
    
    if (token && userData) {
        authToken = token;
        currentUser = JSON.parse(userData);
        showCalendar();
        loadUserTasks();
    }
    
    setupEventListeners();
    setupTabs();
    setTodayDate();
});

// Configurar tabs
function setupTabs() {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        clearMessages();
    });
    
    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        clearMessages();
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Login
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Navegación del calendario
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    document.getElementById('today-btn').addEventListener('click', () => {
        currentDate = new Date();
        selectedDate = new Date();
        renderCalendar();
        setTodayDate();
        loadTodayTasks();
    });
    
    // Panel lateral
    document.getElementById('add-task-btn').addEventListener('click', showTaskForm);
    document.getElementById('settings-btn').addEventListener('click', showSettings);
    document.getElementById('close-panel').addEventListener('click', closePanel);
    
    // Formulario de tarea
    document.getElementById('task-form').addEventListener('submit', handleAddTask);
    
    // Configuración
    document.getElementById('save-settings').addEventListener('click', saveSettings);
}

// Manejar login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        showMessage('login-message', 'Por favor, completa todos los campos', 'error');
        return;
    }
    
    try {
        showMessage('login-message', 'Iniciando sesión...', 'success');
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al iniciar sesión');
        }
        
        // Guardar token y datos del usuario
        authToken = data.token;
        currentUser = data.user;
        
        localStorage.setItem('organimedia_token', authToken);
        localStorage.setItem('organimedia_user', JSON.stringify(currentUser));
        
        // Mostrar calendario
        showCalendar();
        loadUserTasks();
        showNotification('¡Bienvenido a ORGANIMEDIA!', 'success');
        
    } catch (error) {
        showMessage('login-message', error.message, 'error');
        console.error('Login error:', error);
    }
}

// Manejar registro
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const phone = document.getElementById('register-phone').value;
    
    if (!username || !password || !phone) {
        showMessage('register-message', 'Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('register-message', 'La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    try {
        showMessage('register-message', 'Creando cuenta...', 'success');
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, phone })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al crear la cuenta');
        }
        
        // Guardar token y datos del usuario
        authToken = data.token;
        currentUser = data.user;
        
        localStorage.setItem('organimedia_token', authToken);
        localStorage.setItem('organimedia_user', JSON.stringify(currentUser));
        
        // Mostrar calendario
        showCalendar();
        showNotification('¡Cuenta creada exitosamente!', 'success');
        
        // Cambiar a pestaña de login
        document.getElementById('login-tab').click();
        
    } catch (error) {
        showMessage('register-message', error.message, 'error');
        console.error('Register error:', error);
    }
}

// Manejar logout
function handleLogout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('organimedia_token');
        localStorage.removeItem('organimedia_user');
        authToken = null;
        currentUser = null;
        tasks = [];
        showLogin();
        showNotification('Sesión cerrada exitosamente', 'success');
    }
}

// Mostrar formulario de tarea
function showTaskForm() {
    document.getElementById('panel-title').textContent = 'Nueva Tarea';
    document.getElementById('task-form-section').style.display = 'block';
    document.getElementById('tasks-list-section').style.display = 'none';
    document.getElementById('settings-section').style.display = 'none';
    openPanel();
}

// Mostrar configuración
function showSettings() {
    document.getElementById('panel-title').textContent = 'Configuración';
    document.getElementById('task-form-section').style.display = 'none';
    document.getElementById('tasks-list-section').style.display = 'none';
    document.getElementById('settings-section').style.display = 'block';
    
    // Cargar configuración actual
    if (currentUser) {
        document.getElementById('settings-phone').value = currentUser.phone || '';
        document.getElementById('reminder-time').value = currentUser.reminderTime || '11:00';
    }
    
    openPanel();
}

// Abrir panel lateral
function openPanel() {
    document.getElementById('side-panel').classList.add('active');
}

// Cerrar panel lateral
function closePanel() {
    document.getElementById('side-panel').classList.remove('active');
}

// Manejar agregar tarea
async function handleAddTask(e) {
    e.preventDefault();
    
    if (!currentUser || !authToken) {
        showNotification('Debes iniciar sesión para agregar tareas', 'error');
        return;
    }
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const date = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;
    const reminder = document.getElementById('task-reminder').checked;
    
    if (!title || !date) {
        showNotification('Por favor, completa el título y la fecha', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                title,
                description,
                task_date: date,
                priority,
                reminder
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al crear la tarea');
        }
        
        // Agregar tarea a la lista local
        tasks.push(data.task);
        
        // Limpiar formulario
        e.target.reset();
        setTodayDate();
        
        // Actualizar calendario
        renderCalendar();
        loadTodayTasks();
        
        // Cerrar panel y mostrar notificación
        closePanel();
        showNotification('Tarea agregada exitosamente', 'success');
        
    } catch (error) {
        showNotification(error.message, 'error');
        console.error('Error adding task:', error);
    }
}

// Guardar configuración
async function saveSettings() {
    const phone = document.getElementById('settings-phone').value;
    const reminderTime = document.getElementById('reminder-time').value;
    
    if (!phone) {
        showNotification('Por favor, ingresa un número de teléfono', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ phone, reminder_time: reminderTime })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al actualizar la configuración');
        }
        
        // Actualizar usuario local
        currentUser.phone = phone;
        currentUser.reminderTime = reminderTime;
        
        // Guardar en localStorage
        localStorage.setItem('organimedia_user', JSON.stringify(currentUser));
        
        // Actualizar UI
        document.getElementById('user-phone').textContent = phone;
        
        // Cerrar panel y mostrar notificación
        closePanel();
        showNotification('Configuración guardada exitosamente', 'success');
        
    } catch (error) {
        showNotification(error.message, 'error');
        console.error('Error saving settings:', error);
    }
}

// Cargar tareas del usuario
async function loadUserTasks() {
    if (!currentUser || !authToken) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al cargar las tareas');
        }
        
        tasks = data;
        renderCalendar();
        loadTodayTasks();
        
    } catch (error) {
        console.error('Error loading tasks:', error);
        showNotification('Error al cargar las tareas', 'error');
    }
}

// Cargar tareas de hoy
function loadTodayTasks() {
    const today = new Date();
    const todayStr = formatDateForAPI(today);
    
    const todayTasks = tasks.filter(task => task.task_date === todayStr);
    
    const tasksList = document.getElementById('today-tasks-list');
    
    if (todayTasks.length === 0) {
        tasksList.innerHTML = '<p style="text-align: center; color: var(--gray-medium); padding: 20px;">No hay tareas para hoy</p>';
    } else {
        let tasksHTML = '';
        todayTasks.forEach(task => {
            const priorityClass = `priority-${task.priority}`;
            const completedClass = task.completed ? 'completed' : '';
            
            tasksHTML += `
                <div class="task-item ${completedClass}">
                    <div class="task-header">
                        <div class="task-title">${task.title}</div>
                        <span class="task-priority ${priorityClass}">
                            ${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                    </div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                    <div class="task-footer">
                        <div class="task-date">Hoy</div>
                        <div class="task-actions">
                            <button class="task-action-btn complete-btn" onclick="toggleTaskCompletion(${task.id})">
                                <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                            </button>
                            <button class="task-action-btn delete-btn" onclick="deleteTask(${task.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        tasksList.innerHTML = tasksHTML;
    }
}

// Alternar completado de tarea
async function toggleTaskCompletion(taskId) {
    try {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ completed: !task.completed })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al actualizar la tarea');
        }
        
        // Actualizar tarea local
        task.completed = !task.completed;
        
        // Actualizar UI
        renderCalendar();
        loadTodayTasks();
        
        showNotification(`Tarea ${task.completed ? 'completada' : 'marcada como pendiente'}`, 'success');
        
    } catch (error) {
        showNotification(error.message, 'error');
        console.error('Error toggling task completion:', error);
    }
}

// Eliminar tarea
async function deleteTask(taskId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al eliminar la tarea');
        }
        
        // Eliminar tarea local
        tasks = tasks.filter(task => task.id !== taskId);
        
        // Actualizar UI
        renderCalendar();
        loadTodayTasks();
        
        showNotification('Tarea eliminada exitosamente', 'success');
        
    } catch (error) {
        showNotification(error.message, 'error');
        console.error('Error deleting task:', error);
    }
}

// Mostrar calendario
function showCalendar() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('calendar-screen').classList.add('active');
    
    // Actualizar información del usuario
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.username;
        document.getElementById('user-phone').textContent = currentUser.phone || 'Sin teléfono';
    }
    
    // Renderizar calendario
    renderCalendar();
}

// Mostrar login
function showLogin() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('calendar-screen').classList.remove('active');
    
    // Limpiar formularios
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
    clearMessages();
}

// Renderizar calendario
function renderCalendar() {
    const monthYearElement = document.getElementById('month-year');
    const calendarDaysElement = document.getElementById('calendar-days');
    
    // Obtener primer y último día del mes
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Ajustar para que la semana empiece en lunes
    let firstDayOfWeek = firstDayOfMonth.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Actualizar título del mes
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    monthYearElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Limpiar calendario
    calendarDaysElement.innerHTML = '';
    
    // Días del mes anterior
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = 0; i < firstDayOfWeek; i++) {
        const day = document.createElement('div');
        day.className = 'day other-month';
        const dayNumber = prevMonthLastDay - firstDayOfWeek + i + 1;
        day.innerHTML = `<div class="day-number">${dayNumber}</div>`;
        calendarDaysElement.appendChild(day);
    }
    
    // Días del mes actual
    const today = new Date();
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        
        // Verificar si es hoy
        if (day === today.getDate() && 
            currentDate.getMonth() === today.getMonth() && 
            currentDate.getFullYear() === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Obtener tareas para este día
        const dayTasks = getTasksForDay(day);
        const completedTasks = dayTasks.filter(task => task.completed).length;
        
        // Generar preview de tareas
        let tasksPreview = '';
        dayTasks.slice(0, 2).forEach(task => {
            const completedClass = task.completed ? 'completed' : '';
            tasksPreview += `
                <div class="task-preview ${task.priority} ${completedClass}">
                    ${task.title}
                </div>
            `;
        });
        
        // Si hay más tareas, mostrar indicador
        if (dayTasks.length > 2) {
            tasksPreview += `<div class="task-preview">+${dayTasks.length - 2} más</div>`;
        }
        
        dayElement.innerHTML = `
            <div class="day-number">${day}</div>
            <div class="tasks-preview">${tasksPreview}</div>
            <div class="tasks-count">${dayTasks.length} tareas (${completedTasks} completadas)</div>
        `;
        
        // Evento click para ver detalles del día
        dayElement.addEventListener('click', () => {
            selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            showDayDetails(day);
        });
        
        calendarDaysElement.appendChild(dayElement);
    }
    
    // Días del mes siguiente
    const totalCells = 42;
    const daysInMonth = lastDayOfMonth.getDate();
    const nextMonthDays = totalCells - (firstDayOfWeek + daysInMonth);
    
    for (let i = 1; i <= nextMonthDays; i++) {
        const day = document.createElement('div');
        day.className = 'day other-month';
        day.innerHTML = `<div class="day-number">${i}</div>`;
        calendarDaysElement.appendChild(day);
    }
}

// Obtener tareas para un día específico
function getTasksForDay(day) {
    if (!currentUser) return [];
    
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return tasks.filter(task => task.task_date === dateStr);
}

// Mostrar detalles del día
function showDayDetails(day) {
    const dayTasks = getTasksForDay(day);
    const dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][selectedDate.getDay()];
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    document.getElementById('panel-title').textContent = `${dayName} ${day} de ${monthNames[selectedDate.getMonth()]}`;
    document.getElementById('task-form-section').style.display = 'none';
    document.getElementById('tasks-list-section').style.display = 'block';
    document.getElementById('settings-section').style.display = 'none';
    
    // Cargar tareas del día seleccionado
    const tasksList = document.getElementById('today-tasks-list');
    
    if (dayTasks.length === 0) {
        tasksList.innerHTML = '<p style="text-align: center; color: var(--gray-medium); padding: 20px;">No hay tareas para este día</p>';
    } else {
        let tasksHTML = '';
        dayTasks.forEach(task => {
            const priorityClass = `priority-${task.priority}`;
            const completedClass = task.completed ? 'completed' : '';
            
            tasksHTML += `
                <div class="task-item ${completedClass}">
                    <div class="task-header">
                        <div class="task-title">${task.title}</div>
                        <span class="task-priority ${priorityClass}">
                            ${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                    </div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                    <div class="task-footer">
                        <div class="task-date">${formatDate(new Date(task.task_date))}</div>
                        <div class="task-actions">
                            <button class="task-action-btn complete-btn" onclick="toggleTaskCompletion(${task.id})">
                                <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                            </button>
                            <button class="task-action-btn delete-btn" onclick="deleteTask(${task.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        tasksList.innerHTML = tasksHTML;
    }
    
    // Configurar fecha en el formulario de tarea
    const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    document.getElementById('task-date').value = formattedDate;
    
    openPanel();
}

// Establecer fecha de hoy en el formulario
function setTodayDate() {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    document.getElementById('task-date').value = formattedDate;
}

// Formatear fecha para la API
function formatDateForAPI(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Formatear fecha para mostrar
function formatDate(date) {
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Mostrar mensaje en formulario
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${type}`;
}

// Limpiar mensajes
function clearMessages() {
    document.getElementById('login-message').className = 'message';
    document.getElementById('register-message').className = 'message';
}

// Mostrar notificación
function showNotification(message, type = '') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Hacer funciones disponibles globalmente
window.toggleTaskCompletion = toggleTaskCompletion;
window.deleteTask = deleteTask;