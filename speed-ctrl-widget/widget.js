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

// Global variables
var isWaiting = false;
var motorSpeedRef;      // Motor Speed Reference
var update_ms = 1000; 	// Update interval in ms
var timeout;            // Timeout object
var timeout_ms = 60000; // Timeout value in ms

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

// Button 25Hz Click
button25hz.on('click', function () {

    // Update status label
    label.text("Sending...");
    label.removeClass();
    label.addClass("text-primary text-wrap text-monospace");

    // Send
    sendValue(OUT_VARIABLE_ID, 2500, TOKEN, function (value) {
        // Set status = waiting
        isWaiting = true;
        updateUI(true);
        // Set timeout
        timeout = setTimeout(() => {
            updateUI(false);
            label.text("Timeout: No response from device");
            label.removeClass();
            label.addClass("text-danger text-wrap text-monospace");
        }, timeout_ms);
    });
});

// Button 35Hz Click
button35hz.on('click', function () {

    // Update status label
    label.text("Sending...");
    label.removeClass();
    label.addClass("text-primary text-wrap text-monospace");

    // Send
    sendValue(OUT_VARIABLE_ID, 3500, TOKEN, function (value) {
        // Set status = waiting
        isWaiting = true;
        updateUI(true);
        // Set timeout
        timeout = setTimeout(() => {
            updateUI(false);
            label.text("Timeout: No response from device");
            label.removeClass();
            label.addClass("text-danger text-wrap text-monospace");
        }, timeout_ms);
    });
});

// Button 45Hz Click
button45hz.on('click', function () {

    // Update status label
    label.text("Sending...");
    label.removeClass();
    label.addClass("text-primary text-wrap text-monospace");

    // Send
    sendValue(OUT_VARIABLE_ID, 4500, TOKEN, function (value) {
        // Set status = waiting
        isWaiting = true;
        updateUI(true);
        // Set timeout
        timeout = setTimeout(() => {
            updateUI(false);
            label.text("Timeout: No response from device");
            label.removeClass();
            label.addClass("text-danger text-wrap text-monospace");
        }, timeout_ms);
    });
});

// Button 60Hz Click
button60hz.on('click', function () {

    // Update status label
    label.text("Sending...");
    label.removeClass();
    label.addClass("text-primary text-wrap text-monospace");

    // Send
    sendValue(OUT_VARIABLE_ID, 6000, TOKEN, function (value) {
        // Set status = waiting
        isWaiting = true;
        updateUI(true);
        // Set timeout
        timeout = setTimeout(() => {
            updateUI(false);
            label.text("Timeout: No response from device");
            label.removeClass();
            label.addClass("text-danger text-wrap text-monospace");
        }, timeout_ms);
    });
});

// Update widget UI based on status
function updateUI(waiting) {
    if (waiting) {
        // Button Group
        buttonGroup.hide();
        // Spinner
        spinner.show();
        // Status label
        label.text("Waiting for response");
        label.removeClass();
        label.addClass("text-secondary text-wrap text-monospace");
    } else {
        // Button Group
        buttonGroup.show();
        // Spinner
        spinner.hide();
        // Status label
        label.text("Selected frequency: " + motorSpeedRef + "Hz");
        label.removeClass();
        label.addClass("text-success text-wrap text-monospace");
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
            if (motorSpeedRef === value) {
                return;
            }
            
            // Reset timeout
            clearTimeout(timeout);

            // Copy new speed ref
            motorSpeedRef = value;

            isWaiting = false;
            updateUI(false);
        });
    }, update_ms);
}

// Execute update
update();