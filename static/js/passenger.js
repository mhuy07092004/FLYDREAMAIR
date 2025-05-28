// Passenger page JavaScript functions
async function createFlight() {
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const fullName = fname + " " + lname;
    
    const response = await fetch('/api/passenger', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({fullName})
    });
    
    const answer = await response.json();
    console.log(answer);
    alert('Finish');
    window.location.href = '/home';
}

async function cancel() {
    const response = await fetch('/api/cancelFlight');
    const answer = await response.json();
    alert('Cancel successfully!');
    window.location.href = '/home';
} 