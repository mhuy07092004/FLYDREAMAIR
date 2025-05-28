from flask import Flask, json, jsonify, redirect, render_template, request, session
import os
import mysql.connector
from dotenv import load_dotenv
from serpapi import GoogleSearch

app = Flask(__name__) 
app.config['SECRET_KEY'] = 'ascbsajcbjs'
load_dotenv()

conn = None
cursor = None
user_id = None

try:
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        autocommit=True
    )
    cursor = conn.cursor(buffered=True)
    print("Success")
except mysql.connector.Error as err:
    print(f"Failed to connect: {err}")  

# cursor.execute("DROP TABLE saveCart2")

@app.route('/') 
def welcome(): 
    return render_template('login.html')

@app.route('/api/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data['email']
        password = data['password']
        cursor.execute("SELECT * FROM users WHERE email = '{}' AND " \
        "password = '{}'".format(email, password))
        result = cursor.fetchall()
        print(result)
        print(result[0][0])
        if len(result) != 0:
            status = 'ok'
            session['user_id'] = result[0][0]
        else:
            status = 'fail'
    return jsonify({'status': status})

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/api/signup', methods=['POST'])
def create_account():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        fullName = data['fullName']
        email = data['email']
        phone = data['phone']
        password = data['password']
        cursor.execute("SELECT * FROM users WHERE email = '{}'".format(email))
        result = cursor.fetchall()
        print(result)
        if len(result) == 0:
            cursor.execute("INSERT INTO users (fullname, phone, email, password) " \
            "VALUES ('{}', '{}', '{}', '{}')".format(fullName, phone, email, password))
    return jsonify({})

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/api/flight_search', methods = ['POST'])
def flight_search():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
    params = {
    "engine": "google_flights",
    "departure_id": data['departPlace'],
    "arrival_id": data['returnPlace'],
    "outbound_date": data['departDate'],
    "return_date": data['returnDate'],
    "currency": "AUD",
    "hl": "en",
    "api_key": os.getenv("API_KEY")
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    with open("results.txt", "w", encoding="utf-8") as f:
        f.write(json.dumps(results, indent=4))
    print(type(results['best_flights'][0]))

    first_airline = results['best_flights'][0]['flights'][0]['airline']
    first_departPlace = results['best_flights'][0]['flights'][0]['departure_airport']['id']
    first_departDate = results['best_flights'][0]['flights'][0]['departure_airport']['time']
    first_returnPlace = results['best_flights'][0]['flights'][0]['arrival_airport']['id']
    first_returnDate = results['best_flights'][0]['flights'][0]['arrival_airport']['time']
    first_fnumber = results['best_flights'][0]['flights'][0]['flight_number']
    first_duration = results['best_flights'][0]['flights'][0]['duration']


    params = {
    "engine": "google_flights",
    "departure_id": data['returnPlace'],
    "arrival_id": data['departPlace'],
    "outbound_date": data['returnDate'],
    "return_date": data['returnDate'],
    "currency": "AUD",
    "hl": "en",
    "api_key": os.getenv("API_KEY")
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    second_airline = results['best_flights'][0]['flights'][0]['airline']
    second_departPlace = results['best_flights'][0]['flights'][0]['departure_airport']['id']
    second_departDate = results['best_flights'][0]['flights'][0]['departure_airport']['time']
    second_returnPlace = results['best_flights'][0]['flights'][0]['arrival_airport']['id']
    second_returnDate = results['best_flights'][0]['flights'][0]['arrival_airport']['time']
    second_fnumber = results['best_flights'][0]['flights'][0]['flight_number']
    second_duration = results['best_flights'][0]['flights'][0]['duration']
    # second_departPlace, second_returnPlace = second_returnPlace, second_departPlace

    flight_info = {
        "first_flight": {
            "airline": first_airline,
            "departPlace": first_departPlace,
            "departDate": first_departDate,
            "returnPlace": first_returnPlace,
            "returnDate": first_returnDate,
            "flight_number": first_fnumber,
            "duration": first_duration
        },
        "second_flight": {
            "airline": second_airline,
            "departPlace": second_departPlace,
            "departDate": second_departDate,
            "returnPlace": second_returnPlace,
            "returnDate": second_returnDate,
            "flight_number": second_fnumber,
            "duration": second_duration
        }
    }
    session['flight_info'] = json.dumps(flight_info)
    print(session['flight_info'])
    # Now return it as JSON
    return jsonify(flight_info)

@app.route('/api/flight')
def get_flight_info():
    print(0)
    print(session['flight_info'])
    print(1)
    flight_info = json.loads(session.get('flight_info', '{}'))
    print(flight_info)
    return jsonify(flight_info)


@app.route('/displaySearch')
def displaySearch():
    return render_template('search_result.html')

@app.route('/api/flight_order', methods = ['POST'])
def flight_order():
    if request.method == 'POST':
        if 'currentTrip' not in session:
            session['currentTrip'] = []
        if 'bnumber' not in session:
            session['bnumber'] = []
        data = request.get_json()
        session['totalPrice'] = data['flightInfo']['totalPrice']
        # print(session['totalPrice'])
        # print(data)
        for key in ['firstFlight', 'secondFlight']:
            flight = data['flightInfo'][key]
            print(flight)
            print(flight['departDate'], type(flight['departDate']))
            cursor.execute("SELECT * FROM flight_order WHERE departDate = %s", (flight['departDate'], ))
            existing = cursor.fetchone()

            # if existing:
            #     print(f"Flight {flight['flight_number']} already exists. Skipping insert.")
            # else:
            cursor.execute('''
            INSERT INTO flight_order (
                            user_id, 
                airline, departDate, departTime, departPlace,
                duration, flight_number, arriveDate, arriveTime, arrivePlace, flight_class, price
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            session['user_id'],
            flight['airline'],
            flight['departDate'],
            flight['departTime'],
            flight['departPlace'],
            flight['duration'],
            flight['flight_number'],
            flight['arriveDate'],
            flight['arriveTime'],
            flight['arrivePlace'],
            flight['flight_class'],
            flight['price']
        ))
            cursor.execute("SELECT LAST_INSERT_ID()")
            new_bnumber = cursor.fetchone()[0]
            session['bnumber'].append(new_bnumber)
        session['currentTrip'].append(data['flightInfo']['firstFlight']['departPlace'])
        session['currentTrip'].append(data['flightInfo']['firstFlight']['arrivePlace'])
        print(session['bnumber'])
        return jsonify({})

@app.route('/api/cancelFlight')
def cancel_flight():
    print(session['user_id'])
    cursor.execute("DELETE FROM flight_order WHERE user_id = %s", (session['user_id'], ))
    session['bnumber'] = []
    session['currentTrip'] = []
    return jsonify({})

@app.route('/api/passenger', methods=['POST'])
def api_passenger():
    if request.method == 'POST':
        print(session['bnumber'])
        data = request.get_json()
        print(data)
        for bnumber in session['bnumber']:
            # bnumber = bnumber_list
            print('-----------', bnumber)
            cursor.execute("SELECT * FROM flight_order WHERE bnumber = %s", (bnumber,))
            result = cursor.fetchall()
            print(result)
            flight_data = result[0]
            print(flight_data)
            depart_place = flight_data[4]
            arrive_place = flight_data[9] 
            depart_time = flight_data[3] + " " + flight_data[2]
            arrive_time = flight_data[8] + " " + flight_data[7]
            airline = flight_data[1]
            flight_number = flight_data[6]
            flight_class = flight_data[10]
            cursor.execute("INSERT INTO booking(depart_place, arrive_place, depart_time, arrive_time, airline, flight_number, passenger_num, flight_class, user_id, fullname) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}'" \
            ")".format(depart_place, arrive_place, depart_time, arrive_time,
                        airline, flight_number, 1, flight_class,
                        session['user_id'], data['fullName']))
        cursor.execute("DELETE FROM flight_order WHERE user_id = %s", (session['user_id'], ))
        session['bnumber'] = []
        session['currentTrip'] = []
    return jsonify({})

@app.route('/passenger')
def passenger():
    return render_template('passenger.html', price = session['totalPrice'], depart = session['currentTrip'][0], arrive = session['currentTrip'][1])

@app.route('/api/quick_user_flight_search')
def quick():
    cursor.execute('SELECT booking_number, fullname from booking WHERE user_id = %s', (session['user_id'], ))
    result = cursor.fetchall()
    print(result)
    return jsonify(result)


@app.route('/api/user_flight_search', methods=['POST'])
def user_flight_search():
    if request.method == 'POST':
        data = request.get_json()
        print(data['bnumber'])
        booking_number = data['bnumber']
        fullname = data['surname']
        print(booking_number, fullname)
        cursor.execute("SELECT * FROM booking WHERE booking_number = '{}' " 
        "AND fullname = '{}' AND user_id = '{}'".format(booking_number, fullname, session['user_id']))
        result = cursor.fetchall()

        (booking_number, depart_place, arrive_place, depart_time, arrive_time,
        airline, flight_number, passenger_num, flight_class, user_id, fullname
        ) = result[0][0:11]

        if 'current_bnumber_for_flight_order' not in session:
            session['current_bnumber_for_flight_order'] = booking_number
        else:
            session['current_bnumber_for_flight_order'] = booking_number

        return jsonify({
            "booking_number": booking_number,
            "depart_place": depart_place,
            "arrive_place": arrive_place,
            "depart_time": depart_time,
            "arrive_time": arrive_time,
            "airline": airline,
            "flight_number": flight_number,
            "passenger_num": passenger_num,
            "flight_class": flight_class,
            "user_id": user_id,
            "fullname": fullname
        })

    return jsonify({})


@app.route('/manage_booking')
def manage_booking():
    cursor.execute("SELECT * FROM booking WHERE user_id = %s AND booking_number = %s", (session['user_id'], session['current_bnumber_for_flight_order']))
    booking = cursor.fetchone()
    print(booking)
    if (booking[13] and booking[14]):
        seat_info = str(booking[12]) + booking[13] + ' ' + booking[14]

    else:
        seat_info = 'No seat selected'
    print(seat_info)
    return render_template('manage_booking.html',
        booking_number=booking[0],
        from_code=booking[1],
        from_name=booking[1],
        to_code=booking[2],
        to_name=booking[2],
        # depart_date=booking,
        # arrive_date=booking,
        departure_time=booking[3],
        arrival_time=booking[4],
        fullname=booking[10],
        food=booking[11],
        seat_status=seat_info,
        # seat_class=booking[14],
        carry_baggage="7kg luggages",
        checked_baggage="40kg luggages"
    )


@app.route('/api/payment_data')
def payment_data():
    cursor.execute("SELECT * FROM saveCart WHERE user_id = '{}' AND bnumber = '{}'".format(session['user_id'], session['current_bnumber_for_flight_order']))
    result = cursor.fetchall()
    cursor.execute("SELECT * FROM seat_manage WHERE user_id = '{}'  AND bnumber = '{}'".format(session['user_id'], session['current_bnumber_for_flight_order']))
    result2 = cursor.fetchall()
    return jsonify({
        'cart': result,
        'seats': result2
    })

@app.route('/payment')
def payment():
    return render_template('payment_1.html')

@app.route('/api/confirm_cart', methods=['POST'])
def confirm_cart():
    if request.method == 'POST':
        data = request.get_json()

        print(data)
        
        
        if 'seats' in data:
            print(data['seats'])
            cursor.execute("UPDATE booking SET row_num = %s, seat = %s, seat_class = %s WHERE booking_number = %s", (data['seats'][1], data['seats'][2], data['seats'][3], session['current_bnumber_for_flight_order']))
            cursor.execute("DELETE FROM seat_manage WHERE user_id = '{}' and bnumber = '{}'".format(session['user_id'], session['current_bnumber_for_flight_order']))
        if 'cart' in data:
            print(data['cart'])
            cursor.execute("UPDATE booking SET foodName = %s WHERE booking_number = %s", (data['cart'][2], session['current_bnumber_for_flight_order']))
            cursor.execute("DELETE FROM saveCart WHERE user_id = '{}' and bnumber = '{}'".format(session['user_id'], session['current_bnumber_for_flight_order']))
    return jsonify({})

@app.route('/cancel')
def cancel():
    cursor.execute("DELETE FROM saveCart WHERE user_id = '{}' and bnumber = '{}'".format(session['user_id'], session['current_bnumber_for_flight_order']))
    cursor.execute("DELETE FROM seat_manage WHERE user_id = '{}' and bnumber = '{}'".format(session['user_id'], session['current_bnumber_for_flight_order']))
    return redirect('/manage_booking')

@app.route('/meals')
def meals():
    return render_template('meal.html')

@app.route('/api/saveCart', methods=['POST'])
def saveCart():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
    for i in range(len(data['itemList'])):
        cursor.execute("INSERT INTO saveCart(user_id, itemName, itemPrice, bnumber) VALUE ('{}', '{}', '{}', '{}')".format(session['user_id'], data['itemList'][i], data['priceList'][i], session['current_bnumber_for_flight_order']))
    return jsonify({})

@app.route('/seat')
def seat_selection():
    return render_template("airplane.html")

@app.route('/api/seat_management', methods = ['POST'])
def seat_management():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        cursor.execute("INSERT INTO seat_manage(row_num, seat, seat_class, price, user_id, bnumber) VALUES('{}', '{}', '{}', '{}', '{}', '{}')".format(data['row_int'], data['seat'], data['seat_class'], data['price'], session['user_id'], session['current_bnumber_for_flight_order']))
    return jsonify({})


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.clear()
    return redirect('/')

@app.route('/support')
def support():
    return render_template('support.html')

if __name__ == "__main__": 
    app.run(debug=True) 
    # flight_search()