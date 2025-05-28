// Login page JavaScript functions
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const img = button.querySelector('img');
    
    if (input.type === 'password') {
        input.type = 'text';
        img.src = "/static/assets/password_show.png";
    } else {
        input.type = 'password';
        img.src = "/static/assets/password_hide.png";
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (password.length < 8) {
                alert('Password must be at least 8 characters long!');
                return;
            }
            
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            });
            const answer = await response.json();
            console.log(answer['status']);
            if (answer['status'] == 'ok') {
                window.location.href = '/home';
            } else {
                alert('Incorrect email or password');
                window.location.href = '/';
            }
        });
    }
}); 