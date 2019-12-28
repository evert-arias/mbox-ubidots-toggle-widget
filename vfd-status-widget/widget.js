// TOKEN
var TOKEN = '';

// INPUT VARIABLE
var IN_VARIABLE_ID = '';

var leds = $('.led-container');
var spinner = $('.spinner-container');

var ui_status;
var prev_bits_array = [];
var update_ms = 1000;

// UI status
const UI_NO_RESPONSE = 0;
const UI_DONE = 1;
const UI_WAITING = 2;

var bits = [
	{ bit: 'bit-0', abbr: 'VFD OK', tooltip: 'Drive Healthy', active: true, on_class: 'led-on', off_class: 'led-danger' },
	{ bit: 'bit-1', abbr: 'VFD ACT', tooltip: 'Drive Active', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-2', abbr: 'ZERO HZ', tooltip: 'Zero Frequency', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-3', abbr: 'MIN FREQ', tooltip: 'Running At Or Below Minimum Frequency', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-4', abbr: 'BLW FREQ', tooltip: 'Below Set Frequency', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-5', abbr: 'AT FREQ', tooltip: 'At Frequency', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-6', abbr: 'ABV FREQ', tooltip: 'Above Set Frequency', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-7', abbr: 'MAX LOAD', tooltip: 'Rated Load Reached', active: true, on_class: 'led-warn', off_class: 'led-off' },
	{ bit: 'bit-8', abbr: 'AMP LIM', tooltip: 'Current Limit Active', active: true, on_class: 'led-danger', off_class: 'led-off' },
	{ bit: 'bit-9', abbr: 'REG ACT', tooltip: 'Regenerating', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-10', abbr: 'BRK ACT', tooltip: 'Braking IGBT Active', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-11', abbr: 'BRK RES', tooltip: 'Braking Resistor Alarm', active: true, on_class: 'led-danger', off_class: 'led-off' },
	{ bit: 'bit-12', abbr: 'REV CMD', tooltip: 'Reverse Direction Commanded', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-13', abbr: 'RUN REV', tooltip: 'Reverse Direction Running', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-14', abbr: 'SUPP LOSS', tooltip: 'Supply Loss', active: true, on_class: 'led-danger', off_class: 'led-off' }
];

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

// Update widget UI based on status
function updateUI(status) {

	ui_status = status;

	if (ui_status === UI_NO_RESPONSE) {

	} else if (status === UI_DONE) {
		// Leds
		leds.show();
		// Spinner
		spinner.hide();
	} else if (status === UI_WAITING) {
		// Button
		leds.hide();
		// Spinner
		spinner.show();
	}

}

// Update
function update() {
	getDataFromVariable(IN_VARIABLE_ID, TOKEN, function (values) {
		var lastValue = values[0].value;

		var parsed = parseInt(lastValue);

		var bits_array = [];

		for (var i = 0; i < 16; i++) {
			bits_array[i] = { bit: 'bit-' + (15 - i), value: ((parsed & 0x8000) ? true : false) };
			parsed = parsed << 1;
		}

		if (prev_bits_array.length <= 0) {
			prev_bits_array = _.map(bits_array, _.clone);
			updateUI(UI_WAITING);
			return;
		}

		bits_array.forEach((bit, index) => {
			if (bit.value !== prev_bits_array[index]) {
				if (bit.value) {
					$(`#${bit.bit}`).removeClass();
					var obj = bits[_.findIndex(bits, function (o) { return o.bit == bit.bit; })];
					var on_class = obj ? obj.on_class : 'led-on';
					$(`#${bit.bit}`).addClass(on_class);
				} else {
					$(`#${bit.bit}`).removeClass();
					var obj = bits[_.findIndex(bits, function (o) { return o.bit == bit.bit; })];
					var off_class = obj ? obj.off_class : 'led-off';
					$(`#${bit.bit}`).addClass(off_class);
				}
			}
		})

		prev_bits_array = _.map(bits_array, _.clone);

		updateUI(UI_DONE);
	});

}

$(document).ready(function () {

	var act_bits = _.chunk(_.filter(bits, ['active', true]), 5);
	act_bits.forEach((group, grp_index) => {
		var row = `<div class="row p-4" id="led-row-${grp_index}"></div>`;
		$('.led-container').append(row);
		group.forEach((bit) => {
			var led = `<div class="led-box"><div class="led led-off" id="${bit.bit}"></div><p class="text-wrap">${bit.abbr}</p></div>`;
			$(`#led-row-${grp_index}`).append(led);
			$(`#${bit.bit}`).on('click', function () {
				$(this).tooltip('show');
			}).tooltip({ title: bit.tooltip });
		})
	});

	update();
	setInterval(() => {
		update();
	}, update_ms);
})