// TOKEN
var TOKEN = '';

// INPUT VARIABLE
var IN_VARIABLE_ID = '';

// OUTPUT VARIABLE
var OUT_VARIABLE_ID = '';

// HTML elements
var button = $('#mbox-widget-button');
var label = $('#mbox-widget-label');
var spinner = $('#mbox-widget-spinner');

// Motor status
const MOTOR_STOPPED = 0;
const MOTOR_RUNNING = 1;

// UI status
const UI_STOPPED = 0;
const UI_RUNNING = 1;
const UI_NO_RESPONSE = 2;
const UI_WAITING = 3;
const UI_SENDING = 4;

var ui_status;		// Variable that holds the current UI status
var motor_status;   // Variable that holds the current motor status
var received = {};      		    // Received object
var update_ms = 1000; 				// Update interval in ms
var response_timeout;      			// Timeout object
var response_timeout_ms = 30000; 	// Timeout value in ms

// Get data from variable
function getDataFromVariable(variable, token, callback) {
	var url = 'https://industrial.api.ubidots.com/api/v1.6/variables/' + variable + '/values';
	var headers = {
		'X-Auth-Token': token,
		'Content-Type': 'application/json'
	};

	$.ajax({
		url: url,
		method: 'GET',
		headers: headers,
		success: function (res) {
			callback(res.results);
		}
	});
}

// Set response timeout
function setResponseTimeout() {
	if (response_timeout) {
		clearTimeout(response_timeout);
		response_timeout = null;
	}
	response_timeout = setTimeout(() => {
		updateUI(UI_NO_RESPONSE);
	}, response_timeout_ms);
}

// Send value
function sendValue(variable, valueToSend, token, callback) {
	var url = 'https://industrial.api.ubidots.com/api/v1.6/variables/' + variable + '/values';
	var headers = {
		'Content-Type': 'application/json',
		'X-Auth-Token': TOKEN
	};

	$.ajax({
		data: JSON.stringify({
			value: valueToSend
		}),
		method: 'POST',
		url: url,
		headers: headers,
		success: function (res) {
			// Start response timeout
			setResponseTimeout();
			// Callback
			callback(res.value);
		}
	});
}

// Handle button's click
button.on('click', function () {
	updateUI(UI_SENDING);
	// Send
	sendValue(OUT_VARIABLE_ID, !motor_status, TOKEN, function (value) {
		updateUI(UI_WAITING);
	});
});

// Update widget UI based on status
function updateUI(status) {

	ui_status = status;

	if (ui_status === UI_STOPPED) {
		// Button
		button.text("Start");
		button.removeClass();
		button.addClass("btn btn-lg btn-success btn-block round");
		button.show();
		// Spinner
		spinner.hide();
		// Label
		label.text("Motor stopped");
		label.removeClass();
		label.addClass("text-danger text-wrap text-monospace");
	} else if (status === UI_RUNNING) {
		// Button
		button.text("Stop");
		button.removeClass();
		button.addClass("btn btn-lg btn-danger btn-block round");
		button.show();
		// Spinner
		spinner.hide();
		// Label
		label.text("Motor running");
		label.removeClass();
		label.addClass("text-success text-wrap text-monospace");
	} else if (status === UI_NO_RESPONSE) {
		// Button
		button.show();
		// Spinner
		spinner.hide();
		// Label
		label.text("Timeout: No response from device");
		label.removeClass();
		label.addClass("text-danger text-wrap text-monospace");
	} else if (status === UI_WAITING) {
		// Button
		button.hide();
		// Spinner
		spinner.show();
		// Label
		label.text("Waiting response from device");
		label.removeClass();
		label.addClass("text-secondary text-wrap text-monospace");
	} else if (status === UI_SENDING) {
		// Button
		button.hide();
		// Spinner
		spinner.show();
		// Label
		label.text("Sending...");
		label.removeClass();
		label.addClass("text-primary text-wrap text-monospace");
	}
}

// Periodically read data from variable
function update() {

	// Get data from variable every 1000 ms
	setInterval(() => {
		getDataFromVariable(IN_VARIABLE_ID, TOKEN, function (values) {
			var lastValue = values[0];

			// Ignore if same state 
			if (received.timestamp === lastValue.timestamp) {
				return;
			}

			// Copy new speed ref
			received = lastValue;

			// Reset timeout
			clearTimeout(response_timeout);
			response_timeout = null;

			// Convert motor state to status
			if (received.value === 128) {
				// Set motor status
				motor_status = MOTOR_STOPPED;
				// Update UI
				updateUI(UI_STOPPED);
			} else if (received.value === 131 || received.value === 137 || received.value === 641 || received.value === 133) {
				// Set motor status
				motor_status = MOTOR_RUNNING;
				// Update UI
				updateUI(UI_RUNNING);
			} else {
				// Set motor status
				motor_status = MOTOR_STOPPED;
				// Update UI
				updateUI(UI_STOPPED);
			}
		});
	}, update_ms);
}

// Execute update
update();