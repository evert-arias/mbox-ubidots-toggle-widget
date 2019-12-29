
// TOKEN
var TOKEN = 'BBFF-Ujy6Z4GF2Ks8MP4FeUKpaJj9zwMrUc';

// INPUT VARIABLE
var IN_VARIABLE_ID = '5e026af30ff4c3598b7421ca';

// HTML elements
var table = $('.table-container');
var spinner = $('.spinner-container');

var ui_status;
var update_ms = 1000;

// UI status
const UI_NO_RESPONSE = 0;
const UI_DONE = 1;
const UI_WAITING = 2;

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

function updateUI(status) {
    ui_status = status;

    if (ui_status === UI_NO_RESPONSE) {

    } else if (status === UI_DONE) {
        // Table
        table.show();
        // Spinner
        spinner.hide();
    } else if (status === UI_WAITING) {
        // Table
        table.hide();
        // Spinner
        spinner.show();
    }
}

function update() {
    getDataFromVariable(IN_VARIABLE_ID, TOKEN, function (values) {
        var in_trips = _.uniqBy(values, 'value');
        in_trips = _.take(in_trips, 5);
        in_trips.map((trip) => {
            trip.name = trip_codes[_.findIndex(trip_codes, ['code', trip.value])].name;
            trip.action = trip_codes[_.findIndex(trip_codes, ['code', trip.value])].action;
            trip.datetime = moment(trip.timestamp).calendar();
        })
        $('.table-container').html(`
		<table class="table">
			<tr>
				<th>TRIP CODE</th>
				<th>TRIP NAME</th>
				<th>TIME</th>
				<th>RECOMMENDED ACTION</th>
			</tr>
		</table>
		`);
        in_trips.forEach((trip) => {
            var tr = `<tr>
			    <td>${trip.value}</td>
				<td>${trip.name}</td>
				<td>${trip.datetime}</td>
				<td>${trip.action}</td>
			</tr>`;
            $('.table').append(tr);
        })

        updateUI(UI_DONE);
    });
}

$(document).ready(function () {
    updateUI(UI_WAITING);
    setInterval(() => {
        update();
    }, update_ms);
})