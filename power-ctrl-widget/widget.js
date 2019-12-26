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

// Global variables
var status = 0;  // 0:Stopped, 1:Running, 2:Waiting response from device
var motorState;  // Motor state

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
            callback(res.value);
        }
    });
}

// Handle button's click
button.on('click', function () {

    // Do not continue if waiting for response
    if (status === 2) {
        return;
    }

    // Update status label
    label.text("Sending...");
    label.removeClass();
    label.addClass("text-primary text-wrap text-monospace");

    // Send
    sendValue(OUT_VARIABLE_ID, !status, TOKEN, function (value) {
        // Set status = waiting
        status = 2;
        // Update UI
        updateUI(status);
    });
});

// Update widget UI based on status
function updateUI(status) {
    if (status === 0) {
        // Button
        button.text("Start");
        button.removeClass();
        button.addClass("btn btn-lg btn-success btn-block round ");
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
        button.addClass("btn btn-lg btn-danger btn-block round ");
        button.show();
        // Spinner
        spinner.hide();
        // Label
        label.text("Motor running");
        label.removeClass();
        label.addClass("text-success text-wrap text-monospace");
    } else if (status === 2) {
        // Hide button
        button.hide();
        // Spinner
        spinner.show();
        // Label
        label.text("Waiting response from device");
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
            var value = values[0].value;

            // Ignore if same state 
            if (motorState === value) {
                return;
            }

            // Copy new state
            motorState = value;

            // Convert motor state to status
            if (motorState === 128) {
                status = 0;
            } else if (motorState === 131) {
                status = 1
            } else {
                status = 0;
            }

            // Update UI
            updateUI(status);
        });
    }, interval);
}

// Execute update
update();