<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ORGANIMEDIA - Sistema de Gestión</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-red: #d62828;
            --primary-yellow: #fcbf49;
            --dark-red: #b02323;
            --light-yellow: #fde8b3;
            --dark-yellow: #e0a82b;
            --light-red: #f8d7da;
            --white: #ffffff;
            --black: #212529;
            --gray-light: #f8f9fa;
            --gray-medium: #6c757d;
            --gray-dark: #343a40;
            --border-radius: 10px;
            --box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            --transition: all 0.3s ease;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .hidden {
            display: none !important;
        }
        
        /* Contenedor principal de login */
        .login-container {
            width: 100%;
            max-width: 400px;
            background: var(--white);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            overflow: hidden;
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Header del login */
        .login-header {
            background: linear-gradient(135deg, var(--primary-red) 0%, var(--dark-red) 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .login-header h1 {
            font-size: 2.2rem;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        
        .login-header h1 i {
            color: var(--primary-yellow);
        }
        
        .login-header p {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        /* Formulario */
        .login-form {
            padding: 30px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--gray-dark);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .form-control {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            transition: var(--transition);
        }
        
        .form-control:focus {
            outline: none;
            border-color: var(--primary-yellow);
            box-shadow: 0 0 0 3px rgba(252, 191, 73, 0.2);
        }
        
        .phone-input-container {
            position: relative;
        }
        
        .phone-input-container i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray-medium);
        }
        
        .phone-input-container input {
            padding-left: 40px;
        }
        
        /* Botones */
        .btn {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            font-size: 1rem;
        }
        
        .btn-primary {
            background: var(--primary-red);
            color: white;
        }
        
        .btn-primary:hover {
            background: var(--dark-red);
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: var(--primary-yellow);
            color: var(--black);
        }
        
        .btn-secondary:hover {
            background: var(--dark-yellow);
            transform: translateY(-2px);
        }
        
        /* Tabs */
        .tabs {
            display: flex;
            background: var(--gray-light);
            border-bottom: 1px solid #dee2e6;
        }
        
        .tab-btn {
            flex: 1;
            padding: 15px;
            background: none;
            border: none;
            font-weight: 600;
            color: var(--gray-medium);
            cursor: pointer;
            transition: var(--transition);
            position: relative;
        }
        
        .tab-btn.active {
            color: var(--primary-red);
            background: white;
        }
        
        .tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--primary-red);
        }
        
        /* Formularios */
        .form-content {
            padding: 20px 0;
        }
        
        .form-content form {
            display: none;
        }
        
        .form-content form.active {
            display: block;
        }
        
        /* Footer del login */
        .login-footer {
            padding: 20px;
            text-align: center;
            border-top: 1px solid #eee;
            color: var(--gray-medium);
            font-size: 0.9rem;
        }
        
        .login-footer a {
            color: var(--primary-red);
            text-decoration: none;
            font-weight: 600;
        }
        
        .login-footer a:hover {
            text-decoration: underline;
        }
        
        /* Mensajes */
        .message {
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: 500;
            display: none;
        }
        
        .message.success {
            background: rgba(76, 175, 80, 0.1);
            color: #2e7d32;
            border: 1px solid #a5d6a7;
            display: block;
        }
        
        .message.error {
            background: rgba(244, 67, 54, 0.1);
            color: #c62828;
            border: 1px solid #ef9a9a;
            display: block;
        }
        
        /* Calendario (oculto inicialmente) */
        .calendar-container {
            width: 100%;
            max-width: 1200px;
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            overflow: hidden;
            display: none;
        }
        
        .calendar-container.active {
            display: block;
            animation: fadeIn 0.5s ease;
        }
        
        /* Header del calendario */
        .calendar-header {
            background: linear-gradient(135deg, var(--primary-red) 0%, var(--dark-red) 100%);
            color: white;
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .calendar-title {
            font-size: 1.8rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .user-details {
            text-align: right;
        }
        
        .user-name {
            font-weight: 600;
            font-size: 1rem;
        }
        
        .user-phone {
            font-size: 0.85rem;
            opacity: 0.9;
        }
        
        .btn-logout {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .btn-logout:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }
        
        /* Contenido principal */
        .calendar-content {
            padding: 30px;
        }
        
        .calendar-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .current-month {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--dark-red);
        }
        
        .nav-buttons {
            display: flex;
            gap: 10px;
        }
        
        .nav-btn {
            background: var(--gray-light);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .nav-btn:hover {
            background: var(--primary-yellow);
            color: var(--black);
        }
        
        /* Calendario grid */
        .calendar-grid {
            background: white;
            border-radius: var(--border-radius);
            overflow: hidden;
            border: 1px solid #eee;
        }
        
        .weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            background: var(--gray-light);
            border-bottom: 1px solid #eee;
        }
        
        .weekday {
            padding: 15px;
            text-align: center;
            font-weight: 600;
            color: var(--gray-dark);
        }
        
        .days-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 1px;
            background: #eee;
        }
        
        .day {
            background: white;
            min-height: 120px;
            padding: 10px;
            cursor: pointer;
            transition: var(--transition);
            position: relative;
        }
        
        .day:hover {
            background: #f9f9f9;
            transform: scale(1.02);
            z-index: 1;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        .day-number {
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--gray-dark);
        }
        
        .day.today {
            background: rgba(252, 191, 73, 0.1);
        }
        
        .day.today .day-number {
            color: var(--dark-yellow);
            font-weight: 800;
        }
        
        .day.selected {
            background: rgba(214, 40, 40, 0.05);
            border: 2px solid var(--primary-red);
        }
        
        .day.other-month {
            background: #f8f9fa;
            color: #adb5bd;
        }
        
        .day.other-month .day-number {
            color: #adb5bd;
        }
        
        .tasks-preview {
            margin-top: 8px;
        }
        
        .task-preview {
            font-size: 0.75rem;
            padding: 3px 6px;
            border-radius: 4px;
            margin-bottom: 3px;
            background: var(--gray-light);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .task-preview.high {
            background: rgba(214, 40, 40, 0.1);
            border-left: 3px solid var(--primary-red);
        }
        
        .task-preview.medium {
            background: rgba(252, 191, 73, 0.1);
            border-left: 3px solid var(--primary-yellow);
        }
        
        .task-preview.low {
            background: rgba(108, 117, 125, 0.1);
            border-left: 3px solid var(--gray-medium);
        }
        
        .tasks-count {
            font-size: 0.7rem;
            color: var(--gray-medium);
            margin-top: 5px;
        }
        
        /* Panel lateral (inicialmente oculto) */
        .side-panel {
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background: white;
            box-shadow: -5px 0 20px rgba(0,0,0,0.1);
            transition: right 0.3s ease;
            z-index: 1000;
            display: flex;
            flex-direction: column;
        }
        
        .side-panel.active {
            right: 0;
        }
        
        .panel-header {
            background: linear-gradient(135deg, var(--primary-yellow) 0%, var(--dark-yellow) 100%);
            color: var(--black);
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .panel-header h3 {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .close-panel {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--black);
        }
        
        .panel-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }
        
        .panel-section {
            margin-bottom: 30px;
        }
        
        .panel-section h4 {
            color: var(--gray-dark);
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        /* Formulario de tarea */
        .task-form {
            background: var(--gray-light);
            padding: 20px;
            border-radius: var(--border-radius);
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .checkbox-group input {
            width: 18px;
            height: 18px;
            accent-color: var(--primary-red);
        }
        
        /* Lista de tareas */
        .tasks-list {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .task-item {
            background: white;
            padding: 15px;
            border-radius: var(--border-radius);
            margin-bottom: 10px;
            border-left: 4px solid var(--primary-red);
            transition: var(--transition);
        }
        
        .task-item:hover {
            transform: translateX(5px);
            box-shadow: var(--box-shadow);
        }
        
        .task-item.completed {
            opacity: 0.7;
            background: #f8f9fa;
        }
        
        .task-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }
        
        .task-title {
            font-weight: 600;
            color: var(--gray-dark);
        }
        
        .task-priority {
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .priority-high {
            background: var(--primary-red);
            color: white;
        }
        
        .priority-medium {
            background: var(--primary-yellow);
            color: var(--black);
        }
        
        .priority-low {
            background: var(--gray-medium);
            color: white;
        }
        
        .task-description {
            color: var(--gray-medium);
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        
        .task-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
        }
        
        .task-date {
            color: var(--gray-medium);
        }
        
        .task-actions {
            display: flex;
            gap: 5px;
        }
        
        .task-action-btn {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
            background: var(--gray-light);
            color: var(--gray-dark);
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .task-action-btn:hover {
            transform: scale(1.1);
        }
        
        .complete-btn:hover {
            background: #28a745;
            color: white;
        }
        
        .delete-btn:hover {
            background: var(--primary-red);
            color: white;
        }
        
        /* Notificaciones */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: var(--border-radius);
            background: var(--primary-red);
            color: white;
            font-weight: 600;
            box-shadow: var(--box-shadow);
            z-index: 2000;
            display: none;
        }
        
        .notification.success {
            background: var(--primary-yellow);
            color: var(--black);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .calendar-header {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            
            .user-info {
                flex-direction: column;
                gap: 10px;
            }
            
            .user-details {
                text-align: center;
            }
            
            .side-panel {
                width: 100%;
                right: -100%;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .day {
                min-height: 80px;
            }
            
            .task-preview {
                display: none;
            }
        }
        
        @media (max-width: 480px) {
            .login-container {
                margin: 10px;
            }
            
            .calendar-content {
                padding: 15px;
            }
            
            .day {
                padding: 5px;
                min-height: 60px;
            }
            
            .weekday {
                padding: 10px 5px;
                font-size: 0.9rem;
            }
        }
    </style>
</head>
<body>
    <!-- Pantalla de Login/Registro -->
    <div class="login-container" id="login-screen">
        <div class="login-header">
            <h1><i class="fas fa-calendar-alt"></i> ORGANIMEDIA</h1>
            <p>Sistema de Gestión de Tareas y Calendario</p>
        </div>
        
        <div class="tabs">
            <button class="tab-btn active" id="login-tab">Iniciar Sesión</button>
            <button class="tab-btn" id="register-tab">Registrarse</button>
        </div>
        
        <div class="login-form">
            <div class="form-content">
                <!-- Formulario de Login -->
                <form id="login-form" class="active">
                    <div class="message" id="login-message"></div>
                    
                    <div class="form-group">
                        <label for="login-username"><i class="fas fa-user"></i> Usuario</label>
                        <input type="text" id="login-username" class="form-control" placeholder="Ingresa tu usuario" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="login-password"><i class="fas fa-lock"></i> Contraseña</label>
                        <input type="password" id="login-password" class="form-control" placeholder="Ingresa tu contraseña" required>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                    </button>
                </form>
                
                <!-- Formulario de Registro -->
                <form id="register-form">
                    <div class="message" id="register-message"></div>
                    
                    <div class="form-group">
                        <label for="register-username"><i class="fas fa-user"></i> Usuario</label>
                        <input type="text" id="register-username" class="form-control" placeholder="Crea un nombre de usuario" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="register-password"><i class="fas fa-lock"></i> Contraseña</label>
                        <input type="password" id="register-password" class="form-control" placeholder="Crea una contraseña segura" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="register-phone"><i class="fas fa-phone"></i> Teléfono</label>
                        <div class="phone-input-container">
                            <i class="fas fa-phone"></i>
                            <input type="tel" id="register-phone" class="form-control" placeholder="Ej: 612345678" required>
                        </div>
                        <small style="display: block; margin-top: 5px; color: var(--gray-medium);">
                            <i class="fas fa-info-circle"></i> Recibirás recordatorios 24h antes de cada tarea
                        </small>
                    </div>
                    
                    <button type="submit" class="btn btn-secondary">
                        <i class="fas fa-user-plus"></i> Crear Cuenta
                    </button>
                </form>
            </div>
            
            <div class="login-footer">
                <p>© 2024 ORGANIMEDIA - Sistema de Gestión</p>
            </div>
        </div>
    </div>
    
    <!-- Calendario Principal -->
    <div class="calendar-container" id="calendar-screen">
        <header class="calendar-header">
            <div class="calendar-title">
                <i class="fas fa-calendar-alt"></i>
                <span>ORGANIMEDIA - Calendario</span>
            </div>
            
            <div class="user-info">
                <div class="user-details">
                    <div class="user-name" id="user-name">Usuario</div>
                    <div class="user-phone" id="user-phone">Teléfono</div>
                </div>
                <button class="btn-logout" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </header>
        
        <main class="calendar-content">
            <div class="calendar-nav">
                <div class="current-month" id="month-year">Mayo 2024</div>
                <div class="nav-buttons">
                    <button class="nav-btn" id="prev-month" title="Mes anterior">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="nav-btn" id="today-btn" title="Ir a hoy">Hoy</button>
                    <button class="nav-btn" id="next-month" title="Mes siguiente">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <button class="nav-btn" id="add-task-btn" title="Nueva tarea">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="nav-btn" id="settings-btn" title="Configuración">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </div>
            
            <div class="calendar-grid">
                <div class="weekdays">
                    <div class="weekday">Lun</div>
                    <div class="weekday">Mar</div>
                    <div class="weekday">Mié</div>
                    <div class="weekday">Jue</div>
                    <div class="weekday">Vie</div>
                    <div class="weekday">Sáb</div>
                    <div class="weekday">Dom</div>
                </div>
                
                <div class="days-grid" id="calendar-days">
                    <!-- Los días se generarán con JavaScript -->
                </div>
            </div>
        </main>
    </div>
    
    <!-- Panel Lateral de Tareas/Configuración -->
    <div class="side-panel" id="side-panel">
        <div class="panel-header">
            <h3><i class="fas fa-tasks"></i> <span id="panel-title">Tareas de Hoy</span></h3>
            <button class="close-panel" id="close-panel">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="panel-content">
            <!-- Formulario de Nueva Tarea -->
            <div class="panel-section" id="task-form-section">
                <h4><i class="fas fa-plus-circle"></i> Nueva Tarea</h4>
                <form id="task-form" class="task-form">
                    <div class="form-group">
                        <input type="text" id="task-title" class="form-control" placeholder="Título de la tarea" required>
                    </div>
                    
                    <div class="form-group">
                        <textarea id="task-description" class="form-control" placeholder="Descripción (opcional)" rows="3"></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Fecha</label>
                            <input type="date" id="task-date" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Prioridad</label>
                            <select id="task-priority" class="form-control">
                                <option value="low">Baja</option>
                                <option value="medium" selected>Media</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="checkbox-group">
                        <input type="checkbox" id="task-reminder" checked>
                        <label for="task-reminder">Enviar recordatorio 24h antes</label>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Guardar Tarea
                    </button>
                </form>
            </div>
            
            <!-- Lista de Tareas -->
            <div class="panel-section" id="tasks-list-section">
                <h4><i class="fas fa-list-check"></i> Tareas de Hoy</h4>
                <div class="tasks-list" id="today-tasks-list">
                    <!-- Las tareas se cargarán aquí -->
                </div>
            </div>
            
            <!-- Configuración -->
            <div class="panel-section" id="settings-section">
                <h4><i class="fas fa-cog"></i> Configuración</h4>
                <div class="task-form">
                    <div class="form-group">
                        <label>Teléfono para recordatorios</label>
                        <div class="phone-input-container">
                            <i class="fas fa-phone"></i>
                            <input type="tel" id="settings-phone" class="form-control" placeholder="Tu número de teléfono">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Hora de recordatorios</label>
                        <select id="reminder-time" class="form-control">
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00" selected>11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                            <option value="20:00">8:00 PM</option>
                        </select>
                    </div>
                    
                    <button class="btn btn-secondary" id="save-settings">
                        <i class="fas fa-save"></i> Guardar Configuración
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Notificación -->
    <div class="notification" id="notification"></div>
    
    <script>
        // Variables globales
        let currentUser = null;
        let currentDate = new Date();
        let selectedDate = new Date();
        let tasks = [];
        let isTaskFormVisible = true;
        
        // API Configuration (simulada para el frontend)
        const API_BASE_URL = 'http://localhost:3000/api';
        
        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            // Verificar si hay usuario en localStorage
            const savedUser = localStorage.getItem('organimedia_user');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                showCalendar();
            }
            
            setupEventListeners();
            setupTabs();
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
            document.getElementById('add-task-btn').addEventListener('click', () => {
                showTaskForm();
            });
            
            document.getElementById('settings-btn').addEventListener('click', () => {
                showSettings();
            });
            
            document.getElementById('close-panel').addEventListener('click', closePanel);
            
            // Formulario de tarea
            document.getElementById('task-form').addEventListener('submit', handleAddTask);
            
            // Configuración
            document.getElementById('save-settings').addEventListener('click', saveSettings);
            
            // Configurar fecha de hoy por defecto
            setTodayDate();
        }
        
        // Manejar login
        async function handleLogin(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            // Validación simple
            if (!username || !password) {
                showMessage('login-message', 'Por favor, completa todos los campos', 'error');
                return;
            }
            
            try {
                // Simular llamada a la API
                showMessage('login-message', 'Iniciando sesión...', 'success');
                
                // En un entorno real, esto sería una llamada fetch a tu backend
                // const response = await fetch(`${API_BASE_URL}/login`, {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ username, password })
                // });
                
                // Por ahora, simulamos una respuesta exitosa
                setTimeout(() => {
                    // Usuario de ejemplo (en producción vendría del backend)
                    currentUser = {
                        id: 1,
                        username: username,
                        phone: '+34612345678',
                        reminderTime: '11:00'
                    };
                    
                    // Guardar en localStorage
                    localStorage.setItem('organimedia_user', JSON.stringify(currentUser));
                    
                    // Mostrar calendario
                    showCalendar();
                    showNotification('¡Bienvenido a ORGANIMEDIA!', 'success');
                }, 1000);
                
            } catch (error) {
                showMessage('login-message', 'Error al iniciar sesión. Intenta nuevamente.', 'error');
                console.error('Login error:', error);
            }
        }
        
        // Manejar registro
        async function handleRegister(e) {
            e.preventDefault();
            
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const phone = document.getElementById('register-phone').value;
            
            // Validación
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
                
                // Simular llamada a la API
                setTimeout(() => {
                    // Usuario de ejemplo
                    currentUser = {
                        id: Date.now(),
                        username: username,
                        phone: `+34${phone}`,
                        reminderTime: '11:00'
                    };
                    
                    // Guardar en localStorage
                    localStorage.setItem('organimedia_user', JSON.stringify(currentUser));
                    
                    // Mostrar calendario
                    showCalendar();
                    showNotification('¡Cuenta creada exitosamente!', 'success');
                    
                    // Cambiar a pestaña de login
                    document.getElementById('login-tab').click();
                }, 1000);
                
            } catch (error) {
                showMessage('register-message', 'Error al crear la cuenta. Intenta nuevamente.', 'error');
                console.error('Register error:', error);
            }
        }
        
        // Manejar logout
        function handleLogout() {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                localStorage.removeItem('organimedia_user');
                currentUser = null;
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
            
            if (!currentUser) return;
            
            const title = document.getElementById('task-title').value;
            const description = document.getElementById('task-description').value;
            const date = document.getElementById('task-date').value;
            const priority = document.getElementById('task-priority').value;
            const reminder = document.getElementById('task-reminder').checked;
            
            if (!title || !date) {
                showNotification('Por favor, completa el título y la fecha', 'error');
                return;
            }
            
            // Crear objeto de tarea
            const task = {
                id: Date.now(),
                userId: currentUser.id,
                title,
                description,
                date,
                priority,
                reminder,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            // Agregar a la lista (en producción sería una llamada POST a la API)
            tasks.push(task);
            
            // Limpiar formulario
            e.target.reset();
            setTodayDate();
            
            // Actualizar calendario
            renderCalendar();
            loadTodayTasks();
            
            // Cerrar panel y mostrar notificación
            closePanel();
            showNotification('Tarea agregada exitosamente', 'success');
        }
        
        // Guardar configuración
        function saveSettings() {
            const phone = document.getElementById('settings-phone').value;
            const reminderTime = document.getElementById('reminder-time').value;
            
            if (!phone) {
                showNotification('Por favor, ingresa un número de teléfono', 'error');
                return;
            }
            
            // Actualizar usuario
            currentUser.phone = phone;
            currentUser.reminderTime = reminderTime;
            
            // Guardar en localStorage
            localStorage.setItem('organimedia_user', JSON.stringify(currentUser));
            
            // Actualizar UI
            document.getElementById('user-phone').textContent = phone;
            
            // Cerrar panel y mostrar notificación
            closePanel();
            showNotification('Configuración guardada exitosamente', 'success');
        }
        
        // Mostrar calendario
        function showCalendar() {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('calendar-screen').classList.add('active');
            
            // Actualizar información del usuario
            if (currentUser) {
                document.getElementById('user-name').textContent = currentUser.username;
                document.getElementById('user-phone').textContent = currentUser.phone || 'Sin teléfono';
            }
            
            // Renderizar calendario y cargar tareas
            renderCalendar();
            loadTodayTasks();
        }
        
        // Mostrar login
        function showLogin() {
            document.getElementById('login-screen').classList.remove('hidden');
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
            
            return tasks.filter(task => {
                const taskDate = new Date(task.date);
                return taskDate.getDate() === day && 
                       taskDate.getMonth() === currentDate.getMonth() && 
                       taskDate.getFullYear() === currentDate.getFullYear() &&
                       task.userId === currentUser.id;
            });
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
                                <div class="task-date">${formatDate(new Date(task.date))}</div>
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
        
        // Cargar tareas de hoy
        function loadTodayTasks() {
            const today = new Date();
            const todayTasks = tasks.filter(task => {
                if (!currentUser || task.userId !== currentUser.id) return false;
                
                const taskDate = new Date(task.date);
                return taskDate.getDate() === today.getDate() && 
                       taskDate.getMonth() === today.getMonth() && 
                       taskDate.getFullYear() === today.getFullYear();
            });
            
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
        function toggleTaskCompletion(taskId) {
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
                renderCalendar();
                loadTodayTasks();
                showNotification(`Tarea ${tasks[taskIndex].completed ? 'completada' : 'marcada como pendiente'}`, 'success');
            }
        }
        
        // Eliminar tarea
        function deleteTask(taskId) {
            if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                const taskIndex = tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    tasks.splice(taskIndex, 1);
                    renderCalendar();
                    loadTodayTasks();
                    showNotification('Tarea eliminada', 'success');
                }
            }
        }
        
        // Establecer fecha de hoy en el formulario
        function setTodayDate() {
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            document.getElementById('task-date').value = formattedDate;
        }
        
        // Formatear fecha
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
    </script>
    <script src="js/app.js"></script>
</body>

</html>
