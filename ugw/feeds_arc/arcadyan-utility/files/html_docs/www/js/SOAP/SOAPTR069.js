function SOAPGetTR069SettingsResponse() {
	this.TR069 = false;
	this.ACSURL = "";
	this.ACSUsername = "";
	this.ACSPassword = "";
	this.ConnectionRequest = false;
	this.ConnectionRequestURL = "";
	this.ConnectionRequestUsername = "";
	this.ConnectionRequestPassword = "";
	this.PeriodInform = false;
	this.PeriodInformInterval = "";
}


SOAPGetTR069SettingsResponse.prototype = {
	get ACSPassword() {
		if(this._ACSPassword == "") {
			return "";
		}
		return AES_Decrypt128(this._ACSPassword);
	},
	set ACSPassword(val) {
		this._ACSPassword = val;
	},
	get ConnectionRequestPassword() {
		if(this._ConnectionRequestPassword == "") {
			return "";
		}
		return AES_Decrypt128(this._ConnectionRequestPassword);
	},
	set ConnectionRequestPassword(val) {
		this._ConnectionRequestPassword = val;
	}	
}


function SOAPGetSTUNSettingsResponse() {
	this.STUN = false;
	this.STUNServerAddress = "";
	this.STUNServerPort = "";
	this.STUNUsername = "";
	this.STUNPassword = "";
	this.STUNMaxKeepAlive = "";
	this.STUNMinKeepAlive = "";
}


SOAPGetSTUNSettingsResponse.prototype = {
	get STUNPassword() {
		if(this._STUNPassword == "") {
			return "";
		}
		return AES_Decrypt128(this._STUNPassword);
	},
	set STUNPassword(val) {
		this._STUNPassword = val;
	}	
}


function SOAPSetTR069SettingsResponse() {
	this.TR069 = false;
	this.ACSURL = "";
	this.ACSUsername = "";
	this.ACSPassword = "";
	this.ConnectionRequest = false;
	this.ConnectionRequestURL = "";
	this.ConnectionRequestUsername = "";
	this.ConnectionRequestPassword = "";
	this.PeriodInform = false;
	this.PeriodInformInterval = "";
}


SOAPSetTR069SettingsResponse.prototype = {
	get ACSPassword() {
		return this._ACSPassword;
	},
	set ACSPassword(val) {
		this._ACSPassword = AES_Encrypt128(val);
	},
	get ConnectionRequestPassword() {
		return this._ConnectionRequestPassword;
	},
	set ConnectionRequestPassword(val) {
		this._ConnectionRequestPassword = AES_Encrypt128(val);
	}	
}


function SOAPSetSTUNSettingsResponse() {
	this.STUN = false;
	this.STUNServerAddress = "";
	this.STUNServerPort = "";
	this.STUNUsername = "";
	this.STUNPassword = "";
	this.STUNMaxKeepAlive = "";
	this.STUNMinKeepAlive = "";
}


SOAPSetSTUNSettingsResponse.prototype = {
	get STUNPassword() {
		return this._STUNPassword;
	},
	set STUNPassword(val) {
		this._STUNPassword = AES_Encrypt128(val);
	}	
}