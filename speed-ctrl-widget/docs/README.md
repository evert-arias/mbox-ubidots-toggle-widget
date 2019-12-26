# Speed Control Widget

Ubidots Speed Control Widget for ModbusBox devices

![widget](widget.gif)

### Description

The speed control widget allows the user to control the drive's speed and show the current drive's speed based on the response received from the device. 

### Third party libraries

This widget uses the jQuery and Bootstrap libraries. Add the following URL's to the 3rd party libraries section in  the HTML canvas properties window.

* https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
* https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js

![3rd-party-libraries](libraries.png)

### Setup

The following three variable must be fill out to be able to use the widget.

![variables](variables.png)

`TOKEN` : A valid Ubidots token

`IN_VARIABLE_ID` : ID of the variable that carries the widget's input data

`OUT_VARIABLE_ID` : ID of the variable that holds the widget's value to be sent

> The variable ID can be found in the variable's details section as shown in the image below

 ![variable-id](variable-id.png)



## Copyright

2019 © [IOTBITS](https://iotbits.net/)

