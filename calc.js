const jexl = require('Jexl');

let exp = "";
let reset = false;
let out;

window.onload = init;
            
function init() {
	//Get output field
	out = document.getElementById('output');
	//Initialize exp to 0
	exp = "0";
	out.value = exp;
}

function clr() {
	//Reset display to 0
	exp = "0";
	out.value = exp;
}
function clrHistory() {
	document.getElementById("historyDisplay").innerHTML="";
}

function del() {
	//Remove last character of output
	if (/[A-Z]/.test(exp[0])) {
		//If exp is error message, change to 0
		exp = "0";
	} else {
		exp = exp.substring(0, exp.length - 1);
	}
	if (exp == "") {
		//If left with nothing, replace with 0
		exp = "0";
	}
	out.value = exp;
}

function put(char, contin) {
	if (/[A-Z]/.test(exp[0])) {
		//If exp is error message, change to 0
		exp = "0";
	}
	if ((contin || !reset) && exp != "0") {
		//If char is operator, or reset=false, concatenate
		exp += char;
	} else if (contin && exp == "0") {
		//If exp = 0 and char is operator, concatenate
		exp += char;
	} else {
		//If char is digit and reset=true, or if exp = 0, replace
		exp = char;
	}
	if (exp[0] == '.') {
		//If expression begins with '.', add leading 0
		exp = "0" + exp;
	}
	reset = false;
	//Update display
	out.value = exp;
}

function calculate() {
	//Store original expression for history bar
	let lastExp = exp;
	//Calculate
	let success = false;
	jexl.eval(exp).then(function(result) {
		exp = result.toString();
		//Display result
		out.value = exp;
		//Reset display if next input is a number
		reset = true;
		success = true;
		//Add to history
		document.getElementById("historyDisplay").innerHTML+=lastExp+" = "+exp+"<br>";
	});
	if (!success) {
		//If evaluation failed, give error message
		exp = "Syntax Error";
		out.value = exp;
	}
}