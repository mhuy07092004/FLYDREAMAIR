const seatingRows = document.querySelector('.seating-rows');
const selectedSeatDiv = document.getElementById('selected-seat');
let selectedSeat = null;

// Simulated reserved seats (would come from database in real app)
const reservedSeats = [
    {row: 2, seat: 'b'},
    {row: 3, seat: 'c'},
    {row: 5, seat: 'a'},
    {row: 8, seat: 'd'},
    {row: 10, seat: 'd'},
    {row: 12, seat: 'a'},
    {row: 12, seat: 'b'},
    {row: 15, seat: 'c'},
    {row: 17, seat: 'a'},
    {row: 18, seat: 'd'}
];

// Check if seat is reserved
function isSeatReserved(row, seat) {
    return reservedSeats.some(rs => rs.row === row && rs.seat === seat);
}

// Generate 20 rows, each with seats a-d
for (let row = 1; row <= 20; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-row';
    
    // First add seats a and b
    ['a','b'].forEach(seatLetter => {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.dataset.row = row;
        seat.dataset.seat = seatLetter;
        
        // First 5 rows are business class
        if (row <= 5) {
            seat.classList.add('business');
        } else {
            seat.classList.add('standard');
        }
        
        // Check if seat is reserved
        if (isSeatReserved(row, seatLetter)) {
            seat.classList.add('unavailable');
            seat.style.pointerEvents = 'none';
        } else {
            seat.addEventListener('click', function() {
                if (selectedSeat) selectedSeat.classList.remove('selected');
                seat.classList.add('selected');
                selectedSeat = seat;
                selectedSeatDiv.textContent = `Row ${row}${seatLetter.toUpperCase()}`;
                console.log(row, seatLetter);
            });
        }
        rowDiv.appendChild(seat);
    });
    
    // Add row number in the middle
    const rowNumber = document.createElement('span');
    rowNumber.className = 'row-number';
    rowNumber.textContent = row;
    rowDiv.appendChild(rowNumber);
    
    // Then add seats c and d
    ['c','d'].forEach(seatLetter => {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.dataset.row = row;
        seat.dataset.seat = seatLetter;
        
        // First 5 rows are business class
        if (row <= 5) {
            seat.classList.add('business');
        } else {
            seat.classList.add('standard');
        }
        
        // Check if seat is reserved
        if (isSeatReserved(row, seatLetter)) {
            seat.classList.add('unavailable');
            seat.style.pointerEvents = 'none';
        } else {
            seat.addEventListener('click', function() {
                if (selectedSeat) selectedSeat.classList.remove('selected');
                seat.classList.add('selected');
                selectedSeat = seat;
                selectedSeatDiv.textContent = `Row ${row}${seatLetter.toUpperCase()}`;
            });
        }
        rowDiv.appendChild(seat);
    });
    
    seatingRows.appendChild(rowDiv);
}
 
async function selectSeat(){
    // const row = document.querySelector('.seat.standard.selected').getAttribute('data-row')
    // const seat = document.querySelector('.seat.standard.selected').getAttribute('data-seat')
    
    const seatElement = document.querySelector('.seat.selected');
    const row = seatElement.getAttribute('data-row');
    const seat = seatElement.getAttribute('data-seat');
    
    console.log(typeof(row));
    console.log(row, seat);
    const row_int = Number(row);
    console.log(typeof(row_int));
    var price;
    var seat_class;
    if (row >= 1 && row <= 5){
        price = 49;
        seat_class = "Business Class";
    } 
    else{
        price = 10;
        seat_class = "Standard Class";
    }
    const response = await fetch('/api/seat_management', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({row_int, seat, seat_class, price})
        });
        answer = await response.json()
    alert('Selecting seat successfully!');
    window.location.href='/manage_booking';
}