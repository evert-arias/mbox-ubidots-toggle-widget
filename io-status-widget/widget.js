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
	{ bit: 'bit-0', abbr: 'DI/O 01', tooltip: 'Digital I/O 01', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-1', abbr: 'DI 02', tooltip: 'Digital Input 02', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-2', abbr: 'DI 03', tooltip: 'Digital Input 03', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-3', abbr: 'DI 04', tooltip: 'Digital Input 04', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-4', abbr: 'DI 05', tooltip: 'Digital Input 05', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-5', abbr: 'DI 06', tooltip: 'Digital Input 06', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-6', abbr: 'N/A', tooltip: 'Reserved', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-7', abbr: 'N/A', tooltip: 'Reserved', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-8', abbr: 'N/A', tooltip: 'Reserved', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-9', abbr: 'Relay', tooltip: 'Relay Status', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-10', abbr: 'N/A', tooltip: 'Reserved', active: false, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-11', abbr: 'N/A', tooltip: 'Reserved', active: false, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-12', abbr: 'N/A', tooltip: 'Reserved', active: false, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-13', abbr: 'N/A', tooltip: 'Reserved', active: false, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-14', abbr: 'N/A', tooltip: 'Reserved', active: false, on_class: 'led-on', off_class: 'led-off' }
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
