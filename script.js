document.addEventListener('DOMContentLoaded', () => {
    // Login System
    const loginForm = document.querySelector('.login-form');
    const desktop = document.getElementById('desktop');
    
    // Testbenutzer erstellen
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify({ test: 'test123' }));
    }

    loginForm.addEventListener('submit', handleLogin);

    function toggleRegister() {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const isRegistering = submitBtn.textContent === 'Registrieren';
        
        submitBtn.textContent = isRegistering ? 'Anmelden' : 'Registrieren';
        loginForm.querySelector('button[type="button"]').textContent = 
            isRegistering ? 'Registrieren' : 'Zurück zum Login';
    }

    function handleLogin(e) {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users'));
        const [usernameInput, passwordInput] = e.target.elements;
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            alert('Bitte alle Felder ausfüllen!');
            return;
        }

        const isRegistering = e.submitter.textContent === 'Registrieren';

        if (isRegistering) {
            if (users[username]) {
                alert('Benutzer existiert bereits!');
                return;
            }
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registrierung erfolgreich!');
            toggleRegister();
        } else {
            if (users[username] === password) {
                document.getElementById('login-container').style.display = 'none';
                desktop.style.display = 'block';
                initializeDesktop();
            } else {
                alert('Falsche Anmeldedaten!');
            }
        }

        loginForm.reset();
    }

    // Desktop System
    function initializeDesktop() {
        updateTime();
        setInterval(updateTime, 1000);
        
        document.querySelectorAll('.app-icon').forEach(icon => {
            icon.addEventListener('click', () => openApp(icon.dataset.app));
        });
    }

    function updateTime() {
        document.getElementById('clock').textContent = 
            new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    }

    // App Management
    const apps = {
        settings: {
            title: 'Einstellungen',
            html: `<h2>Systemeinstellungen</h2>`
        },
        calculator: {
            title: 'Rechner',
            html: `
                <div class="calculator">
                    <input type="text" readonly>
                    <div class="buttons">
                        ${['7','8','9','+','4','5','6','-','1','2','3','*','0','.','=','/'].map(b => 
                            `<button>${b}</button>`).join('')}
                    </div>
                </div>
            `
        },
        pong: {
            title: 'Pong',
            html: `<canvas width="400" height="300"></canvas>`
        }
    };

    function openApp(appName) {
        const app = apps[appName];
        if (!app) return;

        const window = document.createElement('div');
        window.className = 'window';
        window.innerHTML = `
            <h3>${app.title}</h3>
            ${app.html}
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(window);
        window.style.left = `${Math.random() * 100}px`;
        window.style.top = `${Math.random() * 100}px`;
    }
});