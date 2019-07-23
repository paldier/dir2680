/*new*/
function SOAPGetWiFiSONSettingsResponse() {
	this.WiFiSONStatus = false;
	this.WiFiSONList = new SOAPWiFiSONListResponse();
	this.WiFiSONEnabled = false;
}

function SOAPWiFiSONListResponse() {
	var wiFiSON = new SOAPWiFiSONResponse();

	this.WiFiSON = $.makeArray(wiFiSON);
}

function SOAPWiFiSONResponse() {
	this.MacAddress = "";
	this.WiFiSONRole = "";
	this.HOP = "";
	this.UplinkMacAddress = "";
	this.UplinkType = "";
	this.ErrorCode = "";
	this.VarInfo = "";
}
