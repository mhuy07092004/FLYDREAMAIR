// Home page JavaScript functions
let cnt = 0;

function show1() {
    if (cnt == 0) {
        cnt += 1;
    } else {
        const navItems = document.querySelectorAll('.nav div');
        navItems.forEach(div => div.classList.remove('active'));
        event.target.classList.add('active');
    }
    
    document.getElementById("body").innerHTML = 
    '<div class="form-container">'
       + '<div class="radio-options">'
        +    '<label><input type="radio" name="trip" checked> Return</label>'
        +    '<label><input type="radio" name="trip"> One way</label>'
       + '</div>'

        +'<div class="row">'
         +   '<input type="text" placeholder="From (e.g. SYD)" id="departPlace">'
          +  '<div style="position: relative; flex: 1;">'
           + '<input type="date" id="departDate" name="departDate" class="date-input" placeholder="Depart Date">'
            +'</div>'
        +'</div>'

        +'<div class="row">'
         +   '<input type="text" placeholder="To (e.g. MEL)" id="returnPlace">'
          +  '<div style="position: relative; flex: 1;">'
           +     '<input type="date" id="returnDate" name="returnDate" class="date-input" placeholder="Return Date">'
           +' </div>'
        +'</div>'

        +'<div class="row">'
            + '<select id="passenger"> ' +
                '<option selected>Passenger</option> ' +
                '<option>Adults</option> ' +
                '<option>Children</option> ' +
                '<option>Infants</option> ' +
            '</select> ' 
           + '<input type="text" placeholder="Promotion code">'
        +'</div>'

        +'<div class="row" style="justify-content: flex-end;">'
         +   '<button class="search-button" onclick="searchflight()">Search 🔍</button>'
        +'</div>'
    +'</div>'       
}

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

async function searchflight() {
    showLoader();
    const departPlace = document.getElementById("departPlace").value;
    const departDate = document.getElementById("departDate").value;
    const returnPlace = document.getElementById("returnPlace").value;
    const returnDate = document.getElementById("returnDate").value;
    const passenger = document.getElementById("passenger").value;
    console.log(departPlace, departDate, returnPlace, returnDate, passenger);
    const response = await fetch('/api/flight_search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({departPlace, departDate, returnPlace, returnDate, passenger})
    });
    hideLoader();
    window.location.href = '/displaySearch';
}

async function show2() {
    const navItems = document.querySelectorAll('.nav div');
    navItems.forEach(div => div.classList.remove('active'));

    // Add 'active' to the clicked one
    event.target.classList.add('active');
    let display = 
    '<div class="d-flex flex-row">' + 
        '<div class="p-2">' + 
            '<p>Booking number/ Reservation code</p>' + 
            '<input type="text" id="bnumber">' + 
        '</div>' + 
        '<div class="p-2">' + 
            '<p>Full Name</p>' + 
            '<input type="text" id="surname">' + 
        '</div>' + 
        '<button class="p-2" onclick="showBooking()">Search</button>' + 
    '</div>' 
    + 'Your flights summary';

    const response = await fetch('/api/quick_user_flight_search');
    const answer = await response.json();
    console.log(answer);
    for (let i = 0; i < answer.length; i++) {
        display +=  `<div style="display: flex; gap: 20px;">
                        <p><strong>Booking Number:</strong> ${answer[i][0]}</p>
                        <p><strong>Full Name:</strong> ${answer[i][1]}</p>
                    </div>`;
    }
    document.getElementById("body").innerHTML = display;
}

function show3() {
    document.getElementById("body").innerHTML = '<p>Hello3</p>';
}

async function showBooking() {
    const bnumber = document.getElementById("bnumber").value;
    const surname = document.getElementById("surname").value;
    const response = await fetch('/api/user_flight_search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({bnumber, surname})
    });
    const answer = await response.json();
    console.log(answer);
    console.log(answer['airline']);
    const display = 
    '<div>' + 
        'Booking ' + answer['booking_number'] + 
    '</div>' + 
    '<div class="d-flex flex-row">' +
        '<div class="p-2">' + answer['depart_place'] + '<br/>' + answer['depart_time'] + '</div>' +
        '<div class="p-2">' + answer['arrive_place'] + '<br/>' + answer['arrive_time'] + '</div>' +
        '<div class="p-2">' + answer['airline'] + '<br/>' + answer['flight_number'] + '</div>' +
        '<div class="p-2">' + answer['fullname'] + '<br/>' + answer['passenger_num'] + ' passenger(s) ' + answer['flight_class'] + '</div>' +
        '<a class="p-2" href="/manage_booking"> Edit booking </a>' +
    '</div>';
    document.getElementById("body").innerHTML += display;
    console.log(display);
}

// Initialize the page
window.onload = function() {
    show1();
}; 