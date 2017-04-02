function fill_email() {
	var addr = "Y29scmRhdmlkc29uQGdtYWlsLmNvbQ==";
	document.getElementById("emaila").innerHTML = atob(addr);
	document.getElementById("emaila").href = "mailto:" + atob(addr);
	document.getElementById("emaila2").innerHTML = atob(addr);
	document.getElementById("emaila2").href = "mailto:" + atob(addr);
}
