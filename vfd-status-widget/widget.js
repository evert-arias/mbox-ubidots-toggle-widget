// TOKEN
var TOKEN = '';

// INPUT VARIABLE
var STATUS_WORD_VARIABLE_ID = '';

// LAST_TRIP VARIABLE
var LAST_TRIP_VARIABLE_ID = '';

var leds = $('.leds-container');
var spinner = $('.spinner-container');
var ltrip = $('.last-trip');

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
	{ bit: 'bit-3', abbr: 'MIN FREQ', tooltip: 'Running At Or Below Minimum Frequency', active: false, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-4', abbr: 'BLW FREQ', tooltip: 'Below Set Frequency', active: false, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-5', abbr: 'AT FREQ', tooltip: 'At Frequency', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-6', abbr: 'ABV FREQ', tooltip: 'Above Set Frequency', active: false, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-7', abbr: 'MAX LOAD', tooltip: 'Rated Load Reached', active: true, on_class: 'led-warn', off_class: 'led-off' },
	{ bit: 'bit-8', abbr: 'AMP LIM', tooltip: 'Current Limit Active', active: true, on_class: 'led-danger', off_class: 'led-off' },
	{ bit: 'bit-9', abbr: 'REG ACT', tooltip: 'Regenerating', active: false, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-10', abbr: 'BRK ACT', tooltip: 'Braking IGBT Active', active: false, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-11', abbr: 'BRK RES', tooltip: 'Braking Resistor Alarm', active: true, on_class: 'led-danger', off_class: 'led-off' },
	{ bit: 'bit-12', abbr: 'REV CMD', tooltip: 'Reverse Direction Commanded', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-13', abbr: 'RUN REV', tooltip: 'Reverse Direction Running', active: true, on_class: 'led-on', off_class: 'led-off' },
	{ bit: 'bit-14', abbr: 'SUPP LOSS', tooltip: 'Supply Loss', active: true, on_class: 'led-danger', off_class: 'led-off' }
];

var trip_codes = [
	{
		"code": 1,
		"name": "rES",
		"action": "This is the action"
	},
	{
		"code": 28,
		"name": "cL.A1: Analog input 1 current loss",
		"action": "Check control wiring is correct,Check the Analog Input 1 Mode (07.007)"
	},
	{
		"code": 225,
		"name": "Cur.O: Current feedback offset error",
		"action": "Ensure that there is no possibility of current flowing in the output phases of the drive when the drive is not enabled, Hardware fault – Contact the supplier of the drive"
	},
	{
		"code": 199,
		"name": "dESt: Two or more parameters are writing to the same destination parameter ",
		"action": "Set Pr 00 to ‘dest’ or 12001 and check all visible parameters in all menus for parameter write conflicts."
	},
	{
		"code": 173,
		"name": "FAn.F: Fan fail ",
		"action": "Check that the fan is installed and connected correctly. Check that the fan is not obstructed. Contact the supplier of the drive to replace the fan."
	},
	{
		"code": 20,
		"name": "It.Ac: Output current overload timed out (I2t)",
		"action": "Ensure the load is not jammed / sticking. Check the load on the motor has not changed. Ensure the motor rated current is not zero"
	},
	{
		"code": 19,
		"name": "It.br: Braking resistor overload timed out (I2t)",
		"action": "Ensure the values entered in Pr 10.030, Pr 10.031 and Pr 10.061 are correct. Check resistor value and power rating."
	},
	{
		"code": 236,
		"name": "no.PS: No power board. No communication between the power and control boards.",
		"action": "Hardware fault - contact the supplier of the drive."
	},
	{
		"code": 26,
		"name": "O.Ld1: Digital output overload. This trip indicates that the total current drawn from the AI Adaptor 24 V or from the digital output has exceeded the limit.",
		"action": "Check total loads on digital outputs and 24 V. Check control wiring is correct. Check output wiring is undamaged"
	},
	{
		"code": 7,
		"name": "O.SPd: Motor frequency has exceeded the over frequency threshold",
		"action": "Check that a mechanical load is not driving motor. Reduce Current Controller Ki Gain (04.014)."
	},
	{
		"code": 219,
		"name": "Oht.C: Control stage over temperature",
		"action": "Increase ventilation by setting Cooling Fan control (06.045) > 0."
	},
	{
		"code": 21,
		"name": "Oht.I: Inverter over temperature based on thermal model",
		"action": "Reduce the selected drive switching frequency. Reduce duty cycle. Increase acceleration / deceleration rates. Reduce motor load. Ensure all three input phases are present and balanced"
	},
	{
		"code": 22,
		"name": "Oht.P: Power stage over temperature",
		"action": "Check enclosure / drive fans are still functioning correctly. Check enclosure ventilation paths. Check enclosure door filters. Increase ventilation. Reduce motor load.Use a drive with larger current / power rating"
	},
	{
		"code": 189,
		"name": "OI.A1: Analog input 1 over-current, Current input on analog input 1 exceeds 24 mA.",
		"action": "Check signal coming in to analog input 1"
	},
	{
		"code": 3,
		"name": "OI.AC: Instantaneous output over current detected",
		"action": "Check for short circuit on the output cabling. Check integrity of the motor insulation using an insulation tester. Increase acceleration/deceleration rate "
	},
	{
		"code": 4,
		"name": "OI.br: Braking IGBT over current detected: short circuit protection for the braking IGBT activated",
		"action": "Check brake resistor wiring. Check braking resistor insulation. Check braking resistor value is greater than or equal to the minimum resistance value"
	},
	{
		"code": 228,
		"name": "OI.SC: Output phase short-circuit",
		"action": "Over-current detected on drive output when enabled. Possible motor earth fault. Check for short circuit on the output cabling. Check integrity of the motor insulation using an insulation tester"
	},
	{
		"code": 92,
		"name": "OI.Sn: Snubber over-current detected",
		"action": "Ensure the motor cable length does not exceed the maximum for selected switching frequency. Ensure the internal EMC filter is installed. Check for supply disturbance such as notching from a DC drive"
	},
	{
		"code": 98,
		"name": "Out.P: Output phase loss detected",
		"action": "Check motor and drive connections"
	},
	{
		"code": 2,
		"name": "OV: DC bus voltage has exceeded the peak level or maximum continuous level for 15 seconds",
		"action": "Check nominal AC supply level. Increase deceleration ramp (Pr 04). Check motor insulation using an insulation tester"
	},
	{
		"code": 6,
		"name": "ET: External trip",
		"action": "Check input that has triggered the parameter 10.032 (External trip)"
	},
	{
		"code": 5,
		"name": "PSU: Internal power supply fault",
		"action": "Remove the option module and perform a reset. Hardware fault within the drive – return the drive to the supplier"
	},
	{
		"code": 33,
		"name": "rS: Measured resistance has exceeded the parameter range",
		"action": "Ensure the stator resistance of the motor falls within the range of the drive model. The most likely cause of this trip is trying to measure a motor much smaller than the drive rating"
	},
	{
		"code": 202,
		"name": "SL.Er: Option module in option slot 1 has detected a fault",
		"action": "See relevant option module User Guide for details of the trip"
	},
	{
		"code": 200,
		"name": "SL.HF: Option module 1 hardware fault",
		"action": "Ensure the option module is installed correctly. Replace the option module.Replace the drive"
	},
	{
		"code": 226,
		"name": "So.St Soft start relay failed to close, soft start monitor failed",
		"action": "Hardware fault – Contact the supplier of the drive"
	},
	{
		"code": 24,
		"name": "th: Motor thermistor over-temperature",
		"action": "Check motor temperature, Check threshold level (Pr 07.048). Check thermistor continuity"
	},
	{
		"code": 10,
		"name": "th.br: Brake resistor over temperature",
		"action": ""
	},
	{
		"code": 218,
		"name": "tH.Fb: Internal thermistor has failed",
		"action": "Hardware fault – Contact the supplier of the drive"
	},
	{
		"code": 25,
		"name": "thS: Motor thermistor short circuit",
		"action": "Check thermistor continuity. Replace motor / motor thermistor "
	},
	{
		"code": 32,
		"name": "PH.Lo: Supply phase loss",
		"action": "Check the AC supply voltage balance and level at full load. Reduce the motor load. Disable the phase loss detection, set Pr 06.047 to 2."
	}
]

// Get data from ubidots variable
function getDataFromVariable(variable, token, success, error) {
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
			success(res.results);
		},
		error: function (err) {
			error(err);
		}
	});
}

// Update status
function updateStatus(status) {

	ui_status = status;

	if (ui_status === UI_NO_RESPONSE) {
		// Leds
		leds.hide();
		// Spinner
		spinner.hide();
		// Label
		console.log("STATUS: NO RESPONSE");
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
var already = false;
// Update
function update() {
	getDataFromVariable(STATUS_WORD_VARIABLE_ID, TOKEN, function (values) {
		var lastValue = values[0].value;

		var parsed = parseInt(lastValue);

		var bits_array = [];

		for (var i = 0; i < 16; i++) {
			bits_array[i] = { bit: 'bit-' + (15 - i), value: ((parsed & 0x8000) ? true : false) };
			parsed = parsed << 1;
		}

		if (prev_bits_array.length <= 0) {
			prev_bits_array = _.map(bits_array, _.clone);
			updateStatus(UI_WAITING);
			return;
		}

		// Check status of last trip bit on status word. If equal to 0, retrieve last trip from
		// Ubidots and show the last trip message
		if (bits_array[15].value === false) {
			// Retrieve last trip code from Ubidots
			getDataFromVariable(LAST_TRIP_VARIABLE_ID, TOKEN, function (values) {

				var last_trip_code = values[0].value;
				var last_trip_name = trip_codes[_.findIndex(trip_codes, ['code', last_trip_code])].name;
				var last_trip_action = trip_codes[_.findIndex(trip_codes, ['code', last_trip_code])].action;
				var last_trip_msg = `
					<p>${last_trip_name}</p>
					`;
				if (!already) {
					ltrip.html(
						`
                        <h5>Last Trip Info</h5>
                        <b>Trip code: </b> ${last_trip_code}<br>
                        <b>Trip name: </b> ${last_trip_name}<br>
                        <b>Recommended action: </b> ${last_trip_action}
                        `
					)
					$('#bit-0').popover({
						content: ltrip, // set the content to be the 'blah' div
						placement: 'bottom',
						html: true,

					});

					$('#bit-0').popover('show');
					$('#bit-0').popover('hide');
					ltrip.on('click', ()=>{
						$('#bit-0').popover('hide');
					});
					ltrip.show();
					already = true;
				}

			})
		} else if (bits_array[15].value === true) {
			already = false;
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

		updateStatus(UI_DONE);
	}, (err) => {
		updateStatus(UI_NO_RESPONSE);
	});

}

$(document).ready(function () {

	var act_bits = _.chunk(_.filter(bits, ['active', true]), 5);
	act_bits.forEach((group, grp_index) => {
		var row = `<div class="row p-4" id="led-row-${grp_index}"></div>`;
		$('.leds-container').append(row);
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