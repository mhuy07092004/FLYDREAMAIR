// Signup page JavaScript functions
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
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const fullName = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({fullName, email, phone, password})
            });
            const answer = await response.json();

            alert('Account created successfully!');
            window.location.href = '/';
        });
    }
}); 