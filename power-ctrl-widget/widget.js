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

const STOPPED = 0;
const RUNNING = 1;
const NO_RESPONSE = 2;
const WAITING = 3;
const SENDING = 4;

var status;
var received = {};      		    // Received value
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
		updateUI(NO_RESPONSE);
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
    
	var toSend = !status;

	updateUI(SENDING);

	// Send
	sendValue(OUT_VARIABLE_ID, toSend, TOKEN, function (value) {

		// Set 
		updateUI(WAITING);

		// Set timeout
		timeout = setTimeout(() => {
			updateUI(NO_RESPONSE);
		}, timeout_ms);
	});
});

// Update widget UI based on status
function updateUI(new_status) {
	status = new_status;

	if (status === 0) {
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
	} else if (status === 1) {
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
	} else if (status === 2) {
		// Button
		button.show();
		// Spinner
		spinner.hide();
		// Label
		label.text("Timeout: No response from device");
		label.removeClass();
		label.addClass("text-danger text-wrap text-monospace");
	} else if (status === 3) {
		// Button
		button.hide();
		// Spinner
		spinner.show();
		// Label
		label.text("Waiting response from device");
		label.removeClass();
		label.addClass("text-secondary text-wrap text-monospace");
	} else if (status === 4) {
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

			// Reset timeout
			clearTimeout(response_timeout);
			response_timeout = null;

			// Copy new speed ref
			received = lastValue;

			// Convert motor state to status
			if (received.value === 128) {
				status = 0;
			} else if (received.value === 131) {
				status = 1;
			} else {
				status = 1;
			}

			// Update UI
			updateUI(status);
		});
	}, update_ms);
}

// Execute update
update();