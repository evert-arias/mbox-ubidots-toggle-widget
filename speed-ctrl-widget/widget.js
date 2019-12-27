// TOKEN
var TOKEN = '';

// INPUT VARIABLE
var IN_VARIABLE_ID = '';

// OUTPUT VARIABLE
var OUT_VARIABLE_ID = '';

// HTML elements
var button25hz = $('#mbox-btn-25hz');
var button35hz = $('#mbox-btn-35hz');
var button45hz = $('#mbox-btn-45hz');
var button60hz = $('#mbox-btn-60hz');
var label = $('#mbox-widget-label');
var spinner = $('#mbox-widget-spinner');
var buttonGroup = $('#mbox-button-group');

// UI Status
const UI_NO_RESPONSE = 0; 	// Status: No reponse
const UI_DONE = 1; 			// Status: Done
const UI_SENDING = 2; 			// Status: Sending
const UI_WAITING = 3; 			// Status: Waiting

var ui_status;						// Variable that holds the current UI status
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
		// Update UI
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

// Handle button25Hz click
button25hz.on('click', function () {
	// Update UI
	updateUI(UI_SENDING);
	// Send
	sendValue(OUT_VARIABLE_ID, 2500, TOKEN, function (value) {
		// Update UI
		updateUI(UI_WAITING);
	});
});

// Handle button35Hz click
button35hz.on('click', function () {
	// Update UI
	updateUI(UI_SENDING);
	// Send
	sendValue(OUT_VARIABLE_ID, 3500, TOKEN, function (value) {
		// Update UI
		updateUI(UI_WAITING);
	});
});

// Handle button45Hz click
button45hz.on('click', function () {
	// Update UI
	updateUI(UI_SENDING);
	// Send
	sendValue(OUT_VARIABLE_ID, 4500, TOKEN, function (value) {
		// Update UI
		updateUI(UI_WAITING);
	});
});

// Handle button60Hz click
button60hz.on('click', function () {
	// Update UI
	updateUI(UI_SENDING);
	// Send
	sendValue(OUT_VARIABLE_ID, 6000, TOKEN, function (value) {
		// Update UI
		updateUI(UI_WAITING);
	});
});

// Update widget UI based on status
function updateUI(status) {
	ui_status = status;

	if (ui_status === UI_NO_RESPONSE) {
		// Button Group
		buttonGroup.show();
		// Spinner
		spinner.hide();
		// Label
		label.text("Timeout: No response from device");
		label.removeClass();
		label.addClass("text-danger text-wrap text-monospace");
	} else if (status === UI_DONE) {
		// Button Group
		buttonGroup.show();
		// Spinner
		spinner.hide();
		// Label
		label.text("Selected frequency: " + received.value + "Hz");
		label.removeClass();
		label.addClass("text-success text-wrap text-monospace");
	} else if (status === UI_SENDING) {
		// Button Group
		buttonGroup.hide();
		// Spinner
		spinner.show();
		// Label
		label.text("Sending...");
		label.removeClass();
		label.addClass("text-primary text-wrap text-monospace");
	} else if (status === UI_WAITING) {
		// Button Group
		buttonGroup.hide();
		// Spinner
		spinner.show();
		// Label
		label.text("Waiting for response");
		label.removeClass();
		label.addClass("text-secondary text-wrap text-monospace");
	}
}

// Periodically read data from variable
function update() {
	var interval = 1000;

	// Get data from variable every 1000 ms
	setInterval(() => {
		getDataFromVariable(IN_VARIABLE_ID, TOKEN, function (values) {
			var lastValue = values[0];

			// Ignore if same state 
			if (received.timestamp === lastValue.timestamp) {
				return;
			}

			// Copy new value
			received = lastValue;

			// Reset timeout
			clearTimeout(response_timeout);
			response_timeout = null;

			updateUI(UI_DONE);

		});
	}, update_ms);
}

// Execute update
update();