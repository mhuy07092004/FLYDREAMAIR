// Function to get booking data from data attributes
function getBookingData() {
    const bookingData = document.getElementById('booking-data');
    return {
        tripTitle: bookingData.dataset.tripTitle,
        bookingNumber: bookingData.dataset.bookingNumber,
        fromCode: bookingData.dataset.fromCode,
        fromName: bookingData.dataset.fromName,
        toCode: bookingData.dataset.toCode,
        toName: bookingData.dataset.toName,
        departureDate: bookingData.dataset.departureDate,
        arrivalDate: bookingData.dataset.arrivalDate,
        flightDuration: bookingData.dataset.flightDuration,
        departureTime: bookingData.dataset.departureTime,
        arrivalTime: bookingData.dataset.arrivalTime,
        fullname: bookingData.dataset.fullname,
        seatStatus: bookingData.dataset.seatStatus,
        food: bookingData.dataset.food,
        carryBaggage: bookingData.dataset.carryBaggage,
        checkedBaggage: bookingData.dataset.checkedBaggage
    };
}

// Function to update booking information
function updateBookingInfo() {
    const data = getBookingData();
    
    // Update all elements with the data
    document.getElementById('trip-title').textContent = data.tripTitle;
    document.getElementById('booking-number').textContent = data.bookingNumber;
    document.getElementById('from-code').textContent = data.fromCode;
    document.getElementById('from-name').textContent = data.fromName;
    document.getElementById('to-code').textContent = data.toCode;
    document.getElementById('to-name').textContent = data.toName;
    document.getElementById('departure-date').textContent = data.departureDate;
    document.getElementById('arrival-date').textContent = data.arrivalDate;
    document.getElementById('duration').textContent = data.flightDuration;
    document.getElementById('departure-time').textContent = data.departureTime;
    document.getElementById('arrival-time').textContent = data.arrivalTime;
    document.getElementById('passenger-name').textContent = data.fullname;
    document.getElementById('seat-status').textContent = data.seatStatus;
    document.getElementById('meal-status').textContent = data.food;
    document.getElementById('carry-baggage-status').textContent = data.carryBaggage;
    document.getElementById('checked-baggage-status').textContent = data.checkedBaggage;
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    updateBookingInfo();
});
