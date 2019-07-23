function SOAPGetFirmwareSettingsResponse() {
	this.VendorName = "";
	this.ModelName = "";
	this.ModelRevision = "";
	this.FirmwareVersion = "";
	this.FirmwareDate = "";
//	this.UpdateMethods = "";
};


/**
 * @constructor
 */
function SOAPGetFirmwareStatusResponse() {
	this.CurrentFWVersion = 0;
	this.LatestFWVersion = 0;
	this.LatestFWVersionDate = "";
	this.FWDownloadUrl = "";
	this.FWUploadUrl = "";
};

/**
 * @constructor
 */
function SOAPPollingFirmwareDownloadResponse() {
	this.DownloadPercentage = 0;
};

// @prototype
SOAPPollingFirmwareDownloadResponse.prototype = {
	get DownloadPercentage(){
		return this._DownloadPercentage;
	},

	set DownloadPercentage(val){
		this._DownloadPercentage = parseInt(val);
	}
}


/**
 * @constructor
 */
function SOAPGetFirmwareValidationResponse() {
	this.IsValid = false;
	this.CountDown = "";
};

/**
 * @constructor
 */
function SOAPGetConfigFileValidationResponse() {
	this.IsValid = false;
	this.CountDown = "";
};