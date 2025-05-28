// Search result page JavaScript functions
let price1 = 0;
let price2 = 0;
let total_price = 0;
let cnt = 0;

let flightInfo;
let firstFlightInfo;
let secondFlightInfo;

async function showInfo() {
    const response = await fetch('/api/flight');
    const data = await response.json();
    console.log(data);
    let display = '';
    let totalPrice = 0;

    // Assigning flight data
    firstFlight = data.first_flight;
    secondFlight = data.second_flight;

    // Basic extracted info
    const first_depart_date = firstFlight.departDate.split(" ")[0];
    const first_depart_time = firstFlight.departDate.split(" ")[1];
    const second_depart_date = secondFlight.departDate.split(" ")[0];
    const second_depart_time = secondFlight.departDate.split(" ")[1];
    console.log(second_depart_date, second_depart_time);
    const first_arrive_time = firstFlight.returnDate.split(" ")[1];
    const second_arrive_time = secondFlight.returnDate.split(" ")[1];

    // Optional: aggregate all important info into objects
    firstFlightInfo = {
        flight_class: 'DNF', 
        airline: firstFlight.airline,
        departDate: first_depart_date.toString(),
        departTime: first_depart_time.toString(),
        departPlace: firstFlight.departPlace,
        duration: firstFlight.duration,
        flight_number: firstFlight.flight_number,
        arriveDate: first_depart_date.toString(),
        arriveTime: first_arrive_time.toString(),
        arrivePlace: firstFlight.returnPlace,
        price: price1,
    };

    secondFlightInfo = {
        flight_class: 'DNF',
        airline: secondFlight.airline,
        departDate: second_depart_date.toString(),
        departTime: second_depart_time.toString(),
        departPlace: secondFlight.departPlace,
        duration: secondFlight.duration,
        flight_number: secondFlight.flight_number,
        arriveDate: second_depart_date.toString(),
        arriveTime: second_arrive_time.toString(),
        arrivePlace: secondFlight.returnPlace,
        price: price2,
    };

    // Update UI elements
    document.getElementById('city11').textContent = firstFlight.departPlace;
    document.getElementById('city12').textContent = firstFlight.returnPlace;
    document.getElementById('city13').textContent = firstFlight.departPlace;
    document.getElementById('city14').textContent = firstFlight.returnPlace;
    document.getElementById('first_depart_date').textContent = first_depart_date;
    document.getElementById('first_depart_time').textContent = first_depart_time;
    document.getElementById('first_arrive_time').textContent = first_arrive_time;
    document.getElementById('first_flight_number').textContent = '✈ ' + firstFlight.flight_number;
    document.getElementById('duration1').textContent = '⏱ Duration: ' + firstFlight.duration;

    document.getElementById('city21').textContent = secondFlight.departPlace;
    document.getElementById('city22').textContent = secondFlight.returnPlace;
    document.getElementById('city23').textContent = secondFlight.departPlace;
    document.getElementById('city24').textContent = secondFlight.returnPlace;
    document.getElementById('first_depart_date2').textContent = first_depart_date;
    document.getElementById('second_depart_date2').textContent = second_depart_date;
    document.getElementById('second_depart_time').textContent = second_depart_time;
    document.getElementById('second_arrive_time').textContent = second_arrive_time;
    document.getElementById('second_flight_number').textContent = '✈ ' + secondFlight.flight_number;
    document.getElementById('duration2').textContent = '⏱ Duration: ' + secondFlight.duration;
}

function departTrip(event) {
    document.getElementById('departView').style.display = 'block';
    document.getElementById('returnView').style.display = 'none';
    
    // Remove active class from all buttons in both views
    const allButtons = document.querySelectorAll('.selectors button');
    allButtons.forEach(button => button.classList.remove('active'));
    
    // Add active class to the depart button in departView
    const departButton = document.querySelector('#departView .selectors button:first-child');
    departButton.classList.add('active');
}

function returnTrip(event) {
    document.getElementById('departView').style.display = 'none';
    document.getElementById('returnView').style.display = 'block';
    
    // Remove active class from all buttons in both views
    const allButtons = document.querySelectorAll('.selectors button');
    allButtons.forEach(button => button.classList.remove('active'));
    
    // Add active class to the return button in returnView
    const returnButton = document.querySelector('#returnView .selectors button:nth-child(2)');
    returnButton.classList.add('active');
}

function updatePrice1(element) {
    const classes = document.querySelectorAll('#departView .class');
    classes.forEach(cls => cls.classList.remove('selected'));
    element.classList.add('selected');
    
    price1 = parseFloat(element.querySelector('.price').textContent);
    total_price = price1 + price2;
    document.getElementById('totalPrice').textContent = total_price.toFixed(2) + ' AUD';
    
    firstFlightInfo.flight_class = element.querySelector('div').textContent;
    firstFlightInfo.price = price1;
}

function updatePrice2(element) {
    const classes = document.querySelectorAll('#returnView .class');
    classes.forEach(cls => cls.classList.remove('selected'));
    element.classList.add('selected');
    
    price2 = parseFloat(element.querySelector('.price').textContent);
    total_price = price1 + price2;
    document.getElementById('totalPrice2').textContent = total_price.toFixed(2) + ' AUD';
    
    secondFlightInfo.flight_class = element.querySelector('div').textContent;
    secondFlightInfo.price = price2;
}

async function saveData() {
    if (price1 === 0 || price2 === 0) {
        alert('Please select flight classes for both depart and return flights');
        return;
    }
    
    const flightData = {
        flightInfo: {
            firstFlight: firstFlightInfo,
            secondFlight: secondFlightInfo,
            totalPrice: total_price
        }
    };
    
    const response = await fetch('/api/flight_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(flightData)
    });
    
    const result = await response.json();
    if (result) {
        window.location.href = '/passenger';
    } else {
        alert('Error saving flight data');
    }
}

// Initialize the page
window.onload = showInfo; 