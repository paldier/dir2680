//xframeoption
if(top!=self) {top.location=self.location;}

//session
if(sessionStorage.getItem('PrivateKey') === null) {
	window.location.replace('../info/Login.html');
}

$(function() {
	//start
	wizardFn.BtnChange();
	if(localStorage.RunningWizard == "true") {
		wizardFn.PopupTermOfUser();
	} else {
		wizardFn.PopupWizard();
	}
	$('#createPop_Manual').show();

	//validate
	// Check IPv4 Format
	$.validator.addMethod("checkIPFormat", function( value, element ) {
		var ValidIpAddressRegex = /(^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))+$/;
		var returnVal = true;
		if (ValidIpAddressRegex.test(value)) {
			returnVal = true;
		} else {
			returnVal = false;
		}

		return returnVal;
	}, jQuery.validator.messages.address_Check);

	// check wifi ssid-checkillegalssid
	$.validator.addMethod("checkillegalssid", function( value, element ) {
		var returnVal = COMM_ValidName(value);

		return returnVal;
	}, I18N("j","The name may contain alphanumeric, underscores, hyphens, and spaces. The name cannot begin with, end with, or consist only of spaces."));

	// Check WPA Password
	$.validator.addMethod("checkWPAPassword", function( value, element ) {
		//console.log("checkWPAPassword"+element.id);
		var returnVal = true;
		if (value.length > 63 || value.length < 8) {
			returnVal = false;
		}
		
		return returnVal;
	}, jQuery.validator.messages.password_WPACheck);
		
	// check illegal char
	$.validator.addMethod("checkASCIIChar", function( value, element ) {
		var ValidHEXRegex = /^[ -~]+$/;
		var returnVal = true;
			
		if (ValidHEXRegex.test(value)) {
			returnVal = true;
		} else {
			returnVal = false;
		}

		return returnVal;
	}, I18N("j","Text field contains illegal characters."));

	// Check Device Password
	$.validator.addMethod("checkDevicePassword", function( value, element ) {
		var returnVal = true;
		if (value.length > 15 || value.length < 6) {
			returnVal = false;
		}

		return returnVal;
	}, jQuery.validator.messages.check_DeviceAdminPassword);

	// check second DNS ,it can be null,if not null check it.
	$.validator.addMethod("checkSecondDNS", function( value, element ) {
		var ValidIpAddressRegex = /(^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))+$/;
		var returnVal = true;
		if(value != "") {
			if (ValidIpAddressRegex.test(value)) {
				returnVal = true;
			} else {
				returnVal = false;
			}
		}

		return returnVal;
	}, jQuery.validator.messages.address_Check);

	$.validator.addMethod("check_PPPoE", function( value, element ) {
		var returnVal = true;
		var result = COMM_IsASCII(value);

		if(result != true) {
			returnVal = false;
		}

		return returnVal;
	},I18N("j","Text field contains illegal characters."));

	$.validator.addMethod("checkiPAddress_StaticIP", function( value, element ) {	
		var returnVal=true;
		var netmask = document.getElementById("static_subnetMask").value;
		var mask = COMM_IPv4MASK2INT(netmask);
		var Validipregex=/^[0-9\.]{1,}$/;

		if(!Validipregex.test(value)) {
			returnVal=false;
		}

		if(!COMM_ValidV4Format(value) || !COMM_ValidV4Addr(value)) {
			returnVal=false;
		}

		return returnVal;
	},I18N("j","Please enter a valid IP address. (e.g. 192.168.0.1)"));


	$.validator.addMethod("checkiPAddress_StaticIP2", function( value, element ) {	
		var returnVal=true;
		var netmask = document.getElementById("static_subnetMask").value;
		var mask = COMM_IPv4MASK2INT(netmask);

		if(netmask != "" && (COMM_IPv4NETWORK(value, mask) == COMM_IPv4NETWORK(wizardFn.getNetworkSettingsResponse.IPAddress, mask))) {
			returnVal=false;
		}

		return returnVal;
	},I18N("j", "The network id is the same with LAN."));

	$.validator.addMethod("checksubnetMask_StaticIP", function( value, element ) {		
		var returnVal=true;

		if(value=="255.255.255.255") {
			returnVal=false;
		}

		var mask = COMM_IPv4MASK2INT(value);
		if(mask <= 0 || mask > 32) {
			returnVal=false;
		}

		return returnVal;
	},I18N("j","Please enter a valid netmask. (e.g. 255.255.255.0)"));

	$.validator.addMethod("checkdefaultGateway_StaticIP", function( value, element ) {
		var returnVal=true;
		var staticip = document.getElementById("static_ipAddress").value;
		var netmask = document.getElementById("static_subnetMask").value;
		var mask = COMM_IPv4MASK2INT(netmask);

		if(netmask != "") {
			if(!COMM_ValidV4HOST(value, mask)){
				returnVal=false;
			}
		}

		return returnVal;
	},I18N("j","Please enter a valid IP address. (e.g. 192.168.0.1)"));

	$.validator.addMethod("checkdefaultGateway_StaticIP2", function( value, element ) {
		var returnVal=true;
		var staticip = document.getElementById("static_ipAddress").value;
		var netmask = document.getElementById("static_subnetMask").value;
		var mask = COMM_IPv4MASK2INT(netmask);

		if(netmask != "" && staticip != "") {
			if(value == staticip) {
				returnVal=false;
			}
		}

		return returnVal;
	},I18N("j", "Please enter a valid gateway address. (e.g. 192.168.0.1)"));


	$.validator.addMethod("checkdefaultGateway_StaticIP3", function( value, element ) {
		var returnVal=true;
		var staticip = document.getElementById("static_ipAddress").value;
		var netmask = document.getElementById("static_subnetMask").value;
		var mask = COMM_IPv4MASK2INT(netmask);

		if(netmask != "" && staticip != ""){
			if(COMM_IPv4NETWORK(value, mask) != COMM_IPv4NETWORK(staticip, mask)){
				returnVal=false;
			}
		}

		return returnVal;
	},I18N("j", "The default gateway should be in the same network."));

	$.validator.addMethod("checkprimaryDNSAddress_StaticIP", function( value, element ) {
		var returnVal=true;

		if(value != "") {
			if(!COMM_ValidV4Addr(value)) {
				returnVal=false;
			}
		}

		return returnVal;
	},I18N("j","Please enter a valid IP address. (e.g. 192.168.0.1)"));

	$.validator.addMethod("checkprimaryDNSAddress_StaticIP2", function( value, element ) {
		var returnVal=true;
		var staticip = document.getElementById("static_ipAddress").value;

		if(value != "") {
			if(staticip != "" && value == staticip) {
				returnVal=false;
			}
		}

		return returnVal;
	},I18N("j", "The dns server cannot be equal to the IP address."));

	$.validator.addMethod("checkpasswordsp", function( value, element ) {
		var regexwhitespace = /^\s{1,}$/;
		var returnVal=true;

		if(regexwhitespace.test(value)) {
			returnVal=false;
		}

		return returnVal;
	}, I18N("j","Text field contains illegal characters."));

	//start and end can't has whitespace
	$.validator.addMethod("trimpasswordsp", function( value, element ) {
		var returnVal = true;

		if(value != value.trim()){
			returnVal = false;
		}

		return returnVal;
	}, "");

	// timezone validator
	$.validator.addMethod("checkTimezone", function(value, element){
		var returnVal = false;
		value = value.toLowerCase();

		for(var i=0; i<countryCity.length; i++) {
			if(countryCity[i].toLowerCase() == value && value != '') {
				returnVal = true;
				break;
			}
		}

		return returnVal;
	}, I18N('j', 'Some essential features require you to set a time zone to work properly. Please select your time zone from the drop-down menu.'));

	$("#pppoe_Settings, #staticIP_Settings, #wifi_Settings, #devicePassword_Settings, #Time_form").each(function(index, el)  {
		$(el).validate({
			rules: {
				pppoe_username: {
					required: true
				},
				pppoe_password: {
					required: true
				},
				static_ipAddress: {
					required: true,
					checkIPFormat: true,
					checkiPAddress_StaticIP: true,
					checkiPAddress_StaticIP2: true
				},
				static_subnetMask: {
					required: true,
					checkIPFormat: true,
					checksubnetMask_StaticIP: true
				},
				static_gateway: {
					required: true,
					checkIPFormat: true,
					checkdefaultGateway_StaticIP: true,
					checkdefaultGateway_StaticIP2: true,
					checkdefaultGateway_StaticIP3: true
				},
				static_primaryDNS: {
					required: true,
					checkIPFormat: true,
					checkprimaryDNSAddress_StaticIP: true,
					checkprimaryDNSAddress_StaticIP2: true
				},
				static_secondaryDNS: {
					checkSecondDNS :true,
					checkprimaryDNSAddress_StaticIP: true,
					checkprimaryDNSAddress_StaticIP2: true
				},
				wifi_networkName24G:{
					required:true,
					checkillegalssid:true,
					trimpasswordsp: true
				},
				wifi_networkName5G:{
					required:true,
					checkillegalssid:true,
					trimpasswordsp: true
				},
				wifi_password24G: {
					required: true,
					checkASCIIChar: true,
					checkWPAPassword: true,
					checkpasswordsp: true,
					trimpasswordsp: true
				},
				wifi_password5G: {
					required: true,
					checkASCIIChar: true,
					checkWPAPassword: true,
					checkpasswordsp: true,
					trimpasswordsp: true
				},
				device_password: {
					required: true,
					checkDevicePassword: true,
					checkASCIIChar: true,
					checkpasswordsp: true
				},
				timeZone_Search: {checkTimezone: true}
			},
			messages: {
				pppoe_username: {
					required: jQuery.validator.messages.check_UserName
				},
				pppoe_password: {
					required: jQuery.validator.messages.check_Password
				},
				static_subnetMask: {
					required: jQuery.validator.messages.subnet_Mask,
					checkIPFormat: jQuery.validator.messages.netmask_Check
				},
				static_gateway: {
					required: jQuery.validator.messages.gateway_Address
				},
				wifi_networkName24G: {
					required:jQuery.validator.messages.ssid,
					trimpasswordsp: I18N("j","The name may contain alphanumeric, underscores, hyphens, and spaces. The name cannot begin with, end with, or consist only of spaces.")
				},
				wifi_networkName5G: {
					required:jQuery.validator.messages.ssid,
					trimpasswordsp: I18N("j","The name may contain alphanumeric, underscores, hyphens, and spaces. The name cannot begin with, end with, or consist only of spaces.")
				},
				wifi_password24G: {
					required: jQuery.validator.messages.check_Password,
					trimpasswordsp: I18N("j","Text field contains illegal characters.")
				},
				wifi_password5G: {
					required: jQuery.validator.messages.check_Password,
					trimpasswordsp: I18N("j","Text field contains illegal characters.")
				},
				device_password: {
					required: jQuery.validator.messages.check_Password
				}
			},
			submitHandler: function(form) {
				if(form.id == "pppoe_Settings") {
					if(currentDevice.featurePPPoEValid) {
						wizardFn.setWan("DHCPPPPoE", true);	
					} else {
						wizardFn.setWan("DHCPPPPoE");
					}
				}

				if(form.id == "staticIP_Settings") {
					wizardFn.setWan("Static");
				}

				if(form.id == "wifi_Settings") {
					wizardFn.wizard_next(wizardFn.wizard_Step);

					setWLanRadioSettings_24g.SSID = XMLEncode($("#wifi_networkName24G").val());
					setWLanRadioSecurity_24g.Key = $("#wifi_password24G").val();
					if(currentDevice.featureSmartConnect || currentDevice.featureCovrWIFI) {
						setWLanRadioSettings_5g.SSID = setWLanRadioSettings_24g.SSID;
						setWLanRadioSecurity_5g.Key = $("#wifi_password24G").val();
					} else {
						setWLanRadioSettings_5g.SSID = XMLEncode($("#wifi_networkName5G").val());
						setWLanRadioSecurity_5g.Key = $("#wifi_password5G").val();
					}
				}

				if(form.id == "devicePassword_Settings") {
					wizardFn.wizard_next(wizardFn.wizard_Step);
				}

				if(form.id == "Time_form") {
					wizardFn.wizard_next(wizardFn.wizard_Step);
				}
			}
		});
	});
});


var wizardFn = {
	wizard_Step: 0,
	wizardStepStack: new Array(),
	getDeviceSettingsResponse: new SOAPGetDeviceSettingsResponse(),
	getWanSettingsResponse: new SOAPGetWanSettingsResponse(),
	getNetworkSettingsResponse: new SOAPGetNetworkSettingsResponse(),
	setWanSettings: null,
	wanconnected:0,
	mydlink_registered: false,
	countDownTimer: 25,
	ianaTimeZone: "",
	hasianaTimeZone: false,
	automaticUpgradeTick: true,
	finishWizard: false,
	wifi_datalist: [],
	WiFiSetting: function(band, settings) {
		this.band = band;
		this.settings = settings;
	},
	getWiFiData: function(band) {
		for(var obj in this.wifi_datalist) {
			if(band == this.wifi_datalist[obj].band) {
				return this.wifi_datalist[obj];
			}
		}
		return null;
	},
	PopupWizard: function() {
		var me = this;

		//StarTimeout
		startTimeout();

		var soapAction = new SOAPAction();
		soapAction.sendSOAPAction("GetDeviceSettings", null, me.getDeviceSettingsResponse);

		//SetLanguage
		// var lang = localStorage.getItem('language');
		// $("#Language").selectbox('detach');
		// $("#Language").val(lang);
		// $("#Language").selectbox({width:120});

		//closeCreatePopBtn
		if(currentDevice.featureRunningWizardNoCloseBtn) {
			if(localStorage.getItem("RunningWizard") == "true") {
				$('#closeCreatePopBtn').hide();
			}
		}

		//ModelName
		var modelInfo = JSON.parse(XMLEncode_forheader(sessionStorage.getItem('modelInfomation')));
		$('#modelName2').html(modelInfo.modelName);

		if(currentDevice.featureCovrWIFI) {
			$('#modelName2').html(I18N("j", "COVR Point A"));
		}

		$('#modelName').html(modelInfo.modelName);
		$('#HWversion').html(modelInfo.hwVer);
		$('#FWversion').html(modelInfo.fwVer);

		//StartXML
		me.wizard_update();
		me.GetWanSettingXML();

		//timezone default
		var timeZone = new TimeZoneSearch();
		timeZone.searchEvent();
		$("#timeZone_Search").val(me.ianaTimeZone);
	},
	detectBrowser: function() {
		var browser = $.client.browser;
		var version = $.client.version;
		if(browser == "Mozilla" && version == "11"){
			browser = "Explorer";
		}
		var bool = true;

		switch(browser) {
			case "Chrome":
				if(version < 28) {
					bool = false;
				}
				break;
			case "Explorer":
				bool = false;
				break;
			case "Edge":
				bool = false;
				break;
			case "Safari":
				if(version < 10) {
					bool = false;
				}
				break;
			case "Firefox":
				if(version < 52) {
					bool = false;
				}
				break;
			default:
				bool = false;
				break;
		}
		return bool;
	},
	GetWanSettingXML: function() {
		var me = this;

		//lanip
		var soapAction1 = new SOAPAction();
		var soapAction2 = new SOAPAction();

		//ianaTimeZone
		var browserSupport = me.detectBrowser();
		if(currentDevice.featureNewTime) {
			if(browserSupport) {
				me.ianaTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

				if(me.ianaTimeZone == undefined || me.ianaTimeZone == "") {
					me.ianaTimeZone = "Europe/London";
				}
				
				var checkCountry = false;
				for(var i = 0; i < countryCity.length; i++) {
					if(me.ianaTimeZone == countryCity[i]) {
						checkCountry = true;
						break;
					}
				}

				if(checkCountry != true) {
					countryCity.push(me.ianaTimeZone);
					countryCity.sort();
				}
			} else {
				me.ianaTimeZone = get_timezone_id();

				if(me.ianaTimeZone == undefined || me.ianaTimeZone == "") {
					me.ianaTimeZone = "Europe/London";
				}
			}
		}

		soapAction1.sendSOAPAction("GetNetworkSettings", null, me.getNetworkSettingsResponse).then(function() {
			var dtd = $.Deferred();

			soapAction2.sendSOAPAction("GetWanSettings", null, me.getWanSettingsResponse).done(function() {
				dtd.resolve();
			});

			return dtd.promise();
		}).then(function() {
			switch(me.getWanSettingsResponse.Type) {
				case "Static":
					$('#static_ipAddress').val(me.getWanSettingsResponse.IPAddress);
					$('#static_subnetMask').val(me.getWanSettingsResponse.SubnetMask);
					$('#static_gateway').val(me.getWanSettingsResponse.Gateway);
					$('#static_primaryDNS').val(me.getWanSettingsResponse.ConfigDNS.Primary);
					$('#static_secondaryDNS').val(me.getWanSettingsResponse.ConfigDNS.Secondary);
					break;
				case "DHCPPPPoE":
				case "StaticPPPoE":
					$('#pppoe_username').val(me.getWanSettingsResponse.Username);
					$('#pppoe_password').val(me.getWanSettingsResponse.Password);
					break;
			}

			me.GetWirelessParameter();
		});
	},
	GetWanConnectionType: function(trigger) {
		var me = this;

		var setTriggerADIC = new SOAPSetTriggerADIC();
		setTriggerADIC.TriggerADIC = trigger;
		var soapAction = new SOAPAction();
		var result = soapAction.sendSOAPAction("SetTriggerADIC", setTriggerADIC, null);

		result.done(function(obj) {
			if(obj.SetTriggerADICResult.indexOf('OK_DETECTING') >= 0){
				var detectResult = obj.SetTriggerADICResult.split("_");
				var detectTime = 3;
				if(detectResult[2] !== undefined) {
					detectTime = parseInt(detectResult[2]);
					if(isNaN(detectTime) == true) {
						detectTime = 3;
					}
				}
				setTimeout("wizardFn.GetWanConnectionType('false')", detectTime*1000);
			} else {
				switch (obj.SetTriggerADICResult) {
					// case "OK_DETECTING_2":
					// 	setTimeout("wizardFn.GetWanConnectionType('false')", 3000);
					// 	break;
					case "OK_PPPOE":
						document.getElementById('wz_ConnectionType').innerHTML = I18N("j", "DHCPPPPoE");
						me.wanconnected = 1;
						me.wizard_Step = 4;
						me.wizard_update();
						break;
					case "OK_DHCP":
						document.getElementById('wz_ConnectionType').innerHTML = I18N("j", "DHCP");
						me.wanconnected = 1;
						me.setWan("DHCP");
						break;
					case "ERROR_WANLINKDOWN":
						me.wanconnected = 0;
						me.wizard_Step = 2;
						me.wizard_update();
						break;
					case "ERROR_UNABLETODETECT":
						me.wanconnected = 0;
						me.wizard_Step = 3;
						me.wizard_update();
						break;
					default:
						break;
				}
			}
		});
	},
	selectConnectionType: function(type) {
		changeTimeoutAction();

		if (type == "dhcp" && document.getElementById('cb_dhcp').getAttribute('class') == 'unclick') {
			//selected DHCP
			$("#cb_dhcp").attr("class", "clicked");
			$("#cb_pppoe, #cb_static").attr("class", "unclick");
		} else if (type == "pppoe" && document.getElementById('cb_pppoe').getAttribute('class') == 'unclick') {
			//selected PPPoE
			$("#cb_pppoe").attr("class", "clicked");
			$("#cb_dhcp, #cb_static").attr("class", "unclick");
		} else if (type == "static" && document.getElementById('cb_static').getAttribute('class') == 'unclick') {
			//selected Static IP
			$("#cb_static").attr("class", "clicked");
			$("#cb_dhcp, #cb_pppoe").attr("class", "unclick");
		}
	},
	setWan: function(wanType, PPPoEValid) {
		var me = this;

		var soapAction = new SOAPAction();
		me.setWanSettings = new SOAPSetWanSettings();
		me.setWanSettings.Type = wanType;
		switch(wanType) {
			case "DHCP":
				me.setWanSettings.MTU = "1500";
				break;
			case "DHCPPPPoE":
				me.setWanSettings.Username = XMLEncode(document.getElementById("pppoe_username").value);
				me.setWanSettings.Password = document.getElementById("pppoe_password").value;
				me.setWanSettings.IPAddress = "";
				me.setWanSettings.AutoReconnect = false;
				me.setWanSettings.MaxIdleTime = "300";
				me.setWanSettings.MTU = "1492";
				me.setWanSettings.ConfigDNS.Primary = "";
				me.setWanSettings.ConfigDNS.Secondary = "";
				break;
			case "Static":
				me.setWanSettings.IPAddress = document.getElementById("static_ipAddress").value;
				me.setWanSettings.SubnetMask = document.getElementById("static_subnetMask").value;
				me.setWanSettings.Gateway = document.getElementById("static_gateway").value;
				me.setWanSettings.MTU = "1500";
				me.setWanSettings.ConfigDNS.Primary = document.getElementById("static_primaryDNS").value;
				me.setWanSettings.ConfigDNS.Secondary = document.getElementById("static_secondaryDNS").value;
				break;
		}

		if(wanType == 'DHCPPPPoE' && PPPoEValid == true) {
			$("#btn_next, #btn_back").attr("class", "styled-button_disable").prop("disabled", true);
			$("#pppoe_username").prop("disabled", true);
			$("#pppoe_password").prop("disabled", true);
			me.PPPoEValidFn('true');
		} else {
			me.wizardStepStack.push(me.wizard_Step);
			me.wizard_Step = 6;
			me.wizard_update();
		}
	},
	PPPoEValidFn: function(trigger) {
		var me = this;

		var soapAction = new SOAPAction();
		var setTriggerPPPoEValidate = new SOAPSetTriggerPPPoEValidate();
		setTriggerPPPoEValidate.TriggerPPPoEValidate = trigger;
		setTriggerPPPoEValidate.Username = XMLEncode($('#pppoe_username').val());
		setTriggerPPPoEValidate.Password = $('#pppoe_password').val();
		var result = soapAction.sendSOAPAction("SetTriggerPPPoEValidate", setTriggerPPPoEValidate, null);
		result.done(function(obj) {
			if(obj.SetTriggerPPPoEValidateResult.indexOf('OK_DETECTING') >= 0){
				var detectResult = obj.SetTriggerPPPoEValidateResult.split("_");
				var detectTime = 3;
				if(detectResult[2] !== undefined) {
					detectTime = parseInt(detectResult[2]);
					if(isNaN(detectTime) == true) {
						detectTime = 3;
					}
				}
				setTimeout("wizardFn.PPPoEValidFn('false')", detectTime * 1000);
			} else {
				if(obj.SetTriggerPPPoEValidateResult == 'OK') {
					me.setWanSettings.Username = XMLEncode(document.getElementById("pppoe_username").value);
					me.setWanSettings.Password = document.getElementById("pppoe_password").value;

					me.wizardStepStack.push(me.wizard_Step);
					me.wizard_Step = 6;
					me.wizard_update();
				} else {
					$('#pppoe_password').addClass('error');
					$('#pppoe_password').closest('td').find('label').show().html('<br>Invalid username or password, please try again.');
				}

				$("#btn_next, #btn_back").attr("class", "styled-button_enable").prop("disabled", false);
				$('#pppoe_username').prop('disabled', false);
				$('#pppoe_password').prop('disabled', false);
			}
		}).fail(function() {
			$('#pppoe_password').addClass('error');
			$('#pppoe_password').closest('td').find('label').show().html('<br>Invalid username or password, please try again.');

			$("#btn_next, #btn_back").attr("class", "styled-button_enable").prop("disabled", false);
			$('#pppoe_username').prop('disabled', false);
			$('#pppoe_password').prop('disabled', false);
		});
	},
	GetWirelessParameter: function() {
		var me = this;
		var getWLanRadioSettings_24g = new SOAPGetWLanRadioSettings();
		var getWLanRadioSecurity_24g = new SOAPGetWLanRadioSecurity();
		var getWLanRadioSettings_5g = new SOAPGetWLanRadioSettings();
		var getWLanRadioSecurity_5g = new SOAPGetWLanRadioSecurity();

		var getWLanRadioSettingsResponse_24g = new SOAPGetWLanRadioSettingsResponse();
		var getWLanRadioSecurityResponse_24g = new SOAPGetWLanRadioSecurityResponse();
		var getWLanRadioSettingsResponse_5g = new SOAPGetWLanRadioSettingsResponse();
		var getWLanRadioSecurityResponse_5g = new SOAPGetWLanRadioSecurityResponse();

		var soapAction = new SOAPAction();
		var soapAction2 = new SOAPAction();
		var soapAction3 = new SOAPAction();
		var soapAction4 = new SOAPAction();

		getWLanRadioSettings_24g.RadioID = "RADIO_2.4GHz";
		soapAction.sendSOAPAction("GetWLanRadioSettings", getWLanRadioSettings_24g, getWLanRadioSettingsResponse_24g).then(function() {
			var dtd = $.Deferred();

			var wifisetting = new me.WiFiSetting(24, getWLanRadioSettingsResponse_24g);
			me.wifi_datalist.push(wifisetting);

			getWLanRadioSecurity_24g.RadioID = "RADIO_2.4GHz";
			soapAction2.sendSOAPAction("GetWLanRadioSecurity", getWLanRadioSecurity_24g, getWLanRadioSecurityResponse_24g).done(function() {
				dtd.resolve();
			});

			return dtd.promise();
		}).then(function() {
			var dtd = $.Deferred();

			if(!currentDevice.featureSmartConnect && !currentDevice.featureCovrWIFI) {
				getWLanRadioSecurity_5g.RadioID = "RADIO_5GHz";
				soapAction3.sendSOAPAction("GetWLanRadioSettings", getWLanRadioSecurity_5g, getWLanRadioSettingsResponse_5g).done(function() {
					var wifisetting = new me.WiFiSetting(5, getWLanRadioSettingsResponse_5g)
					me.wifi_datalist.push(wifisetting);
					dtd.resolve();
				});
			} else {
				dtd.resolve();
			}

			return dtd.promise();
		}).then(function() {
			var dtd = $.Deferred();

			if(!currentDevice.featureSmartConnect && !currentDevice.featureCovrWIFI) {
				getWLanRadioSecurity_5g.RadioID = "RADIO_5GHz";
				soapAction4.sendSOAPAction("GetWLanRadioSecurity", getWLanRadioSecurity_5g, getWLanRadioSecurityResponse_5g).done(function() {
					dtd.resolve();
				});
			} else {
				dtd.resolve();
			}

			return dtd.promise();
		}).then(function() {
			$('#wifi_networkName24G').val(getWLanRadioSettingsResponse_24g.SSID);
			$('#wifi_password24G').val(getWLanRadioSecurityResponse_24g.Key);
				
			if(!currentDevice.featureSmartConnect) {
				$('#wifi_networkName5G').val(getWLanRadioSettingsResponse_5g.SSID);
				$('#wifi_password5G').val(getWLanRadioSecurityResponse_5g.Key);
			}
		});
	},
	BtnChange: function() {
		var me = this;

		//ButtonChange
		$("select").change(function() {changeTimeoutAction();});
		$("input").keydown(function() {changeTimeoutAction();});
		$("button").click(function() {changeTimeoutAction();});

		//switch language
		$('#Language').on('change', function() {
			sessionStorage.removeItem('langPack');
			localStorage.setItem('language', $(this).val());
			location.reload();	
		});

		//next button
		$('#btn_next').on('click', function() {
			me.wizard_next_btn(me.wizard_Step);
			changeTimeoutAction();
		});

		//close button
		$('#closeCreatePopBtn').on('click', function() {
			changeTimeoutAction();

			if(me.finishWizard) {
				wizardFn.returnToHome();
			} else {
				$('#createPop_Manual, #dialogBox_Background').hide();
				$('#alert_Message').show();

				var soapAction = new SOAPAction();
				var setWanSettings = new SOAPSetWanSettings();
				soapAction.copyObject(setWanSettings, me.getWanSettingsResponse);
				var result = soapAction.sendSOAPAction("SetWanSettings", setWanSettings, null);
				result.done(function(obj) {
					setTimeout("wizardFn.returnToHome()", 2000);
				});				
			}
		});

		// Terms of Use Button
		$("#btn_agree").on('click', function(){
			$("#Dialog_termNprivacy, #btn_agree").hide();
			$("#wizard_settings, #closeCreatePopBtn").show();
			me.PopupWizard();
		});

		//SetLanguage
		var lang = localStorage.getItem('language');
		$("#Language").selectbox('detach');
		$("#Language").val(lang);
		$("#Language").selectbox({width:120});
	},
	wizard_back: function(num) {
		var me = this;
		
		me.wizardStepStack.pop();

		switch(num) {
			case 0:
				break;
			case 1:
				me.wizard_update();
				break;
			case 2:
				me.wizardStepStack.push(0);
				me.wizard_Step = 1;
				me.wizard_update();
				me.GetWanConnectionType("true");
				break;
			case 3:
				if(currentDevice.featureRunningWizardNoCloseBtn) {
					me.wizard_Step = 0;
				} else {
					if(me.wanconnected == 0){
						me.wizard_Step = 2;
					} else {
						me.wizard_Step = 0;
					}
				}

				me.wizard_update();
				break;
			case 4:
				me.wizard_Step = 3;
				me.wizard_update();
				break;
			case 5:
				me.wizard_Step = 3;
				me.wizard_update();
				break;
			case 6:
				if(document.getElementById('cb_dhcp').getAttribute('class') == 'clicked') {
					me.wizard_Step = 3;
				} else if(document.getElementById('cb_pppoe').getAttribute('class') == 'clicked') {
					me.wizard_Step = 4;
				} else if (document.getElementById('cb_static').getAttribute('class') == 'clicked')	{
					me.wizard_Step = 5;
				}
				// me.wizard_Step = 3;
				me.wizard_update();
				break;
			case 7:
				me.wizard_Step = 6;
				me.wizard_update();
				break;
			case 8:
				if(currentDevice.featureNewTime) {
					me.wizard_Step = 15;
				} else {
					me.wizard_Step = 7;
				}

				me.wizard_update();
				break;
			case 9:
				me.wizard_Step = 3;
				me.wizard_update();
				break;
			case 10:
				document.getElementById("wz_MydlinkStatus").innerHTML = I18N("j", "Unregistered");
				document.getElementById("wz_MydlinkStatus").style.color = "#ff0000";
				me.wizard_Step = 13;
				me.wizard_update();
				break;
			case 11:
				me.wizard_Step = 10;
				me.wizard_update();
				break;
			case 12:
				me.wizard_Step = 10;
				me.wizard_update();
				break;
			case 13:
				break;
			case 15:
				me.wizard_Step = 16;
				me.wizard_update();
				break;
			case 16:
				me.wizard_Step = 7;
				me.wizard_update();
				break;
		}
	},
	wizard_next_btn: function(num, nextnum) {
		var me = this;

		//button submit
		switch (num) {
			case 4:  //PPPoE
				$('#sumbit_CheckData').trigger('click');
				break;	
			case 5:  //Static
				$('#sumbit_CheckData1').trigger('click');
				break;
			case 6:  //Wireless
				$('#sumbit_CheckData2').trigger('click');
				break;
			case 7:	 //Device Admin Password
				$('#sumbit_CheckData3').trigger('click');
				break;
			case 16: //Timezone
				$('#sumbit_CheckData4').trigger('click');
				break;
			default:
				me.wizard_next(num,nextnum);
				break;
		}
	},
	wizard_next: function(num,nextnum) {
		var me = this;

		me.wizardStepStack.push(num);

		switch(num) {
			case 0:  //welcome
				me.wizard_Step = 1;
				me.GetWanConnectionType("true");
				break;
			case 1:  //detection
				me.wizardStepStack.pop();
				break;
			case 2:  //plug
				me.wizard_Step = 3;
				break;
			case 3:  //select wan type
				if(document.getElementById('cb_dhcp').getAttribute('class') == 'clicked') {
					$('#btn_next, #btn_back').hide();
					document.getElementById('wz_ConnectionType').innerHTML = I18N("j", "DHCP");
					me.setWan("DHCP");
					return;
				} else if (document.getElementById('cb_pppoe').getAttribute('class') == 'clicked') {
					document.getElementById('wz_ConnectionType').innerHTML = I18N("j", "DHCPPPPoE");
					me.wizard_Step = 4;
				} else if (document.getElementById('cb_static').getAttribute('class') == 'clicked') {
					document.getElementById('wz_ConnectionType').innerHTML = I18N("j", "Static");
					me.wizard_Step = 5;
				}
				break;
			case 4:  //pppoE
				me.wizard_Step = 6;
				break;
			case 5:  //Static
				me.wizard_Step = 6;
				break;
			case 6:  //Wireless
				me.wizard_Step = 7;
				break;
			case 7:  //Device Admin Password
				if(currentDevice.featureNewTime) {
					me.wizard_Step = 16;
				} else {
					me.wizard_Step = 8;
				}
				break;
			case 8:
				me.GetXML_SetDeviceSettings();
				break;
			case 9:
				me.wizardStepStack.pop();
				break;
			case 10:
				if(document.getElementById('cb_yes').getAttribute('class') == 'clicked') {
					me.wizard_Step = 12;
				} else if(document.getElementById('cb_no').getAttribute('class') == 'clicked') {
					me.wizard_Step = 11;
				}
				break;
			case 11:
				me.SetMyDlinkRegister();
				break;
			case 12:
				me.SetDeviceRegister_a();
				break;
			case 13:
				me.SetXML();
				break;
			case 14:
				me.returnToHome();
				break;
			case 15:
				me.wizard_Step = 8;
				break;
			case 16:
				me.wizard_Step = 15;
				break;
		}

		me.wizard_update();
	},
	wizard_update: function() {
		var me = this;
		switch(me.wizard_Step) {
			case 0:

				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "Welcome"));
				if(currentDevice.featureCovrWIFI) {
					$('#wizard_wording').html(I18N("j", "This wizard will walk you through, step-by-step through the configuration process for your COVR Wi-Fi system."));
				} else {
					$('#wizard_wording').html(I18N("j", "This wizard will guide you through a step-by-step process to configure your new D-Link device."));
				}

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'inline'});
				$('.wizardTopology').css({'display':'none'});

				$('#topology').css({'display':'inline-block'});
				$('#wizard_deviceName').css({'display':'block'});

				$("#wizard_wan_line").attr("class", "wizard_wan_line_off");
				$("#wizard_wifi_line").attr("class", "wizard_wifi_line_off");
				$("#wizard_router").attr("class", "wizard_router_off");

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#wizard_setupTable').show();

				$('#mydlink_step4').css({'display':'none'});

				if(currentDevice.featureCovrWIFI) {
					$("#setupTable_step1").html(I18N("j", "Step 1: Install your first COVR Point, COVR Point A"));
					$("#setupTable_step3").html(I18N("j", "Step 3: Set your device password"));
					$('#RelocateCovr_step4').css({'display':'table-row'});
				}else{
					$('#RelocateCovr_step4').css({'display':'none'});
				}

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Cancel"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#languagetext, #languageselect').css({'display':'inline-block'});
				$('#btn_next').css({'display':'inline'});

				break;
			case 1:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "Configure Your Internet Connection"));
				$('#wizard_wording').html(I18N("j", "Detecting Internet Connection") + "...");

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'inline'});
				$('.wizardTopology').css({'display':'none'});

				$('#topology').css({'display':'inline-block'});
				$('#wizard_deviceName').css({'display':'block'});

				$("#wizard_wan_line").attr("class", "wizard_wan_line_on");
				$("#wizard_wifi_line").attr("class", "wizard_wifi_line_off");
				$("#wizard_router").attr("class", "wizard_router_off");

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#detection').css({'display':'inline'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Cancel"));
				$('#btn_next').html(I18N("j", "Next"));

				break;
			case 2:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "Install"));

				if(currentDevice.featureRunningWizardNoCloseBtn) {
					if(currentDevice.featureCovrWIFI) {
						if(sessionStorage.FWRegion == "EU") {
							$('#wizard_wording').html(I18N("j", "Connect one end of an Ethernet cable to port 1 on the COVR Point labeled A, and connect the other end to your modem or Internet-connected wall jack."));
						} else {
							$('#wizard_wording').html(I18N("j", "Power off the modem and connect one end of an Ethernet cable to the port 1 on the cover point labeled A, and connect the other end to your modem or Internet-connected Ethernet wall jack. Power the modem back on."));
						}
					} else {
						$('#wizard_wording').html(I18N("j", "Connect one end of an Ethernet cable to one of the Ethernet ports on the router and connect the other end of the cable to your modem or Internet-connected Ethernet wall jack."));
					}
				} else {
					$('#wizard_wording').html(I18N("j", "Please plug one end of the Ethernet cable included with your device into the port labeled INTERNET on your device. Plug the other end of this cable into the Ethernet port on your DSL or cable broadband modem, and power cycle the modem."));
				}

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'inline'});
				$('.wizardTopology').css({'display':'none'});

				$('#topology').css({'display':'inline-block'});
				$('#wizard_deviceName').css({'display':'block'});

				$("#wizard_wan_line").attr("class", "wizard_wan_line_on");
				$("#wizard_wifi_line").attr("class", "wizard_wifi_line_off");
				$("#wizard_router").attr("class", "wizard_router_off");

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#plug_page').css({'display':'block'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Retry"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_back').css({'display':'inline'});
				if(currentDevice.featureRunningWizardNoCloseBtn) {
					if(localStorage.getItem("RunningWizard") == "true") {
						$('#btn_next').css({'display':'none'});
					} else {
						$('#btn_next').css({'display':'inline'});
					}
				} else {
					$('#btn_next').css({'display':'inline'});
				}

				break;
			case 3:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "Configure Your Internet Connection"));
				$('#wizard_wording').html(I18N("j", "Please select your Internet connection type below"));

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'inline'});
				$('.wizardTopology').css({'display':'none'});

				$('#topology').css({'display':'inline-block'});
				$('#wizard_deviceName').css({'display':'block'});

				$("#wizard_wan_line").attr("class", "wizard_wan_line_on");
				$("#wizard_wifi_line").attr("class", "wizard_wifi_line_off");
				$("#wizard_router").attr("class", "wizard_router_off");

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#selectConnectionType').css({'display':'inline'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_back, #btn_next').css({'display':'inline'});

				break;
			case 4:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "PPPoE"));
				$('#wizard_wording').html(I18N("j", "To setup this Internet connection, you will need to have a User Name from your Internet Service Provider. If you do not have this information, please contact your ISP."));

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'inline'});
				$('.wizardTopology').css({'display':'none'});

				$('#topology').css({'display':'inline-block'});
				$('#wizard_deviceName').css({'display':'block'});

				$("#wizard_wan_line").attr("class", "wizard_wan_line_on");
				$("#wizard_wifi_line").attr("class", "wizard_wifi_line_off");
				$("#wizard_router").attr("class", "wizard_router_off");

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#pppoe_setupTable').css({'display':'table'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_back, #btn_next').css({'display':'inline'});

				break;
			case 5:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "Static IP"));
				$('#wizard_wording').html(I18N("j", "To set up this conncetion you will need to have a complete list of IP information by your Internet Service Provider. If you have a Static IP connection and do not have this information, please contact your ISP."));

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'inline'});
				$('.wizardTopology').css({'display':'none'});

				$('#topology').css({'display':'inline-block'});
				$('#wizard_deviceName').css({'display':'block'});

				$("#wizard_wan_line").attr("class", "wizard_wan_line_on");
				$("#wizard_wifi_line").attr("class", "wizard_wifi_line_off");
				$("#wizard_router").attr("class", "wizard_router_off");

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#staticIP_setupTable').css({'display':'inline'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_back, #btn_next').css({'display':'inline'});

				break;
			case 6:
				// me.GetWirelessParameter();

				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "Wi-Fi Settings"));
				$('#wizard_wording').html(I18N("j", "To setup a Wi-Fi Network you will need to give your Wi-Fi Network a Name(SSID) and Password."));

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'inline'});
				$('.wizardTopology').css({'display':'none'});

				$('#topology').css({'display':'inline-block'});
				$('#wizard_deviceName').css({'display':'block'});

				$("#wizard_wan_line").attr("class", "wizard_wan_line_off");
				$("#wizard_wifi_line").attr("class", "wizard_wifi_line_on");
				$("#wizard_router").attr("class", "wizard_router_off");

				/*///// content /////*/
				if(currentDevice.featureSmartConnect) {
					$(".wifi_5g").hide();
					$("#wifi_networkName24G_show, #confirm_wifi_networkName24G_show, #wz_24GHz_Wireless_show")
					.html(I18N("j", "Wi-Fi Network Name")+":");
					$("#wifi_password24G_show, #confirm_wifi_password24G_show, #wz_24GHz_WirelessPassword_show")
					.html(I18N("j", "Wi-Fi Password")+":");	
				} else if(currentDevice.featureCovrWIFI) {
					$(".wifi_5g").hide();
					$("#wifi_networkName24G_show, #confirm_wifi_networkName24G_show, #wz_24GHz_Wireless_show")
					.html("COVR " + I18N("j", "Wi-Fi Network Name")+":");
					$("#wifi_password24G_show, #confirm_wifi_password24G_show, #wz_24GHz_WirelessPassword_show")
					.html("COVR " + I18N("j", "Wi-Fi Password")+":");	
				} else {
					$(".wifi_5g").show();
					$("#wifi_networkName24G_show, #confirm_wifi_networkName24G_show, #wz_24GHz_Wireless_show")
					.html(I18N("j", "2.4GHz Wi-Fi Network Name")+":");
					$("#wifi_password24G_show, #confirm_wifi_password24G_show, #wz_24GHz_WirelessPassword_show")
					.html(I18N("j", "2.4GHz Wi-Fi Password")+":");
				}

				$('.wizardElement').hide();
				$('#wifi_setupTable').css({'display':'table'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_back, #btn_next').css({'display':'inline'});

				break;
			case 7:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "Device Admin Password"));
				$('#wizard_wording').html(I18N("j", "By default, your new D-Link device does not have a password configured for administrator access to the Web-based configuration utility. To secure your new device, please create a password below."));

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'inline'});
				$('.wizardTopology').css({'display':'none'});

				$('#topology').css({'display':'inline-block'});
				$('#wizard_deviceName').css({'display':'block'});

				$("#wizard_wan_line").attr("class", "wizard_wan_line_off");
				$("#wizard_wifi_line").attr("class", "wizard_wifi_line_off");
				$("#wizard_router").attr("class", "wizard_router_on");

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#devicePassword_setupTable').css({'display':'table'});

				$("#autoUpgrade_icon").css({'display': 'none'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_back, #btn_next').css({'display':'inline'});

				break;
			case 8:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "Summary"));
				$('#wizard_wording').html(I18N("j", "Below is a summary of your Wi-Fi security and device password settings. Please note down your settings and click \"Next\"."));

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'inline'});
				$('.wizardTopology').css({'display':'none'});

				$('#topology').css({'display':'inline-block'});
				$('#wizard_deviceName').css({'display':'block'});

				$("#wizard_wan_line").attr("class", "wizard_wan_line_off");
				$("#wizard_wifi_line").attr("class", "wizard_wifi_line_off");
				$("#wizard_router").attr("class", "wizard_router_off");

				if(currentDevice.featureAutoUpgrade) {
					$("#wizardAutoUpgrade").show();
				}

				/*///// content /////*/
				$('#confirm_connection_type').html(I18N("j",$('#wz_ConnectionType').html()));
				$('#confirm_wifi_networkName24G').html(HTMLEncode($('#wifi_networkName24G').val()));
				$('#confirm_wifi_networkName5G').html(HTMLEncode($('#wifi_networkName5G').val()));
				$('#confirm_wifi_password24G').html(HTMLEncode($('#wifi_password24G').val()));
				$('#confirm_wifi_password5G').html(HTMLEncode($('#wifi_password5G').val()));
				$('#confirm_device_password').html(HTMLEncode($('#device_password').val()));

				$('.wizardElement').hide();
				$('#confirm_setup').css({'display':'inline'});

				$("#autoUpgrade_icon").css({'display': 'none'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_back, #btn_next').css({'display':'inline'});

				break;
			case 9:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "Checking Your Internet Connectivity"));
				$('#wizard_wording').html(I18N("j", "Checking Internet Connectivity") + "...");

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'inline'});
				$('.wizardTopology').css({'display':'none'});

				$('#topology').css({'display':'inline-block'});
				$('#wizard_deviceName').css({'display':'block'});

				$("#wizard_wan_line").attr("class", "wizard_wan_line_on");
				$("#wizard_wifi_line").attr("class", "wizard_wifi_line_off");	
				$("#wizard_router").attr("class", "wizard_router_off");

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#checking_connection').css({'display':'inline'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				break;
			case 10:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "mydlink Registration"));

				$('#wizard_wording').css({'display':'none'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'none'});
				$('.wizardTopology').css({'display':'none'});

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#mydlink_step1').css({'display':'inline'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_back, #btn_next').css({'display':'inline'});

				break;
			case 11:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "mydlink Registration"));

				$('#wizard_wording').css({'display':'none'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'none'});
				$('.wizardTopology').css({'display':'none'});

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#mydlink_step2').css({'display':'inline'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_next').css({'display':'inline'});

				break;
			case 12:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "mydlink Registration"));

				$('#wizard_wording').css({'display':'none'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'none'});
				$('.wizardTopology').css({'display':'none'});

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#mydlink_step3').css({'display':'inline'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_next').css({'display':'inline'});

				break;
			case 13:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "Congratulations"));
				$('#wizard_wording').html(I18N("j", "Congratulations, your device has been configured. You can now connect to your Wi-Fi network by using the new Wi-Fi Network Name and Password you created."));

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'none'});
				$('.wizardTopology').css({'display':'none'});

				/*///// content /////*/
				// $('#confirm_connection_type').html(I18N("j",$('#wz_ConnectionType').html()));
				$('#wz_24GHz_Wireless').html(HTMLEncode($('#wifi_networkName24G').val()));
				$('#wz_5GHz_Wireless').html(HTMLEncode($('#wifi_networkName5G').val()));
				$('#wz_24GHz_WirelessPassword').html(HTMLEncode($('#wifi_password24G').val()));
				$('#wz_5GHz_WirelessPassword').html(HTMLEncode($('#wifi_password5G').val()));
				$('#wz_DeviceAdminPassword').html(HTMLEncode($('#device_password').val()));

				$('.wizardElement').hide();
				$('#congratulationsTable').css({'display':'inline'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_next').css({'display':'inline'});
		
				break;
			case 14:
				/*///// Page: Welcome Page /////*/
				// $('#wizard_title').html(I18N("j", "Covr Extender Placement"));
				$('#wizard_title').html(I18N("j", "Covr Point(s) Placement"));
				if(currentDevice.featureCovrWIFI){
					var covrText_p1 = I18N("j", "You may now plug in the COVR Point(s) and position it somewhere between COVR Point A and the Wi-Fi dead zone. If the COVR LED starts to blink white, try moving the COVR Point closer to COVR Point A. If it’s blinking orange, it means there’s no Wi-Fi connection. Check if the COVR Point A is turned on and try moving the COVR Point closer to COVR Point A to improve the signal.");
					var covrText_p2 = I18N("j", "Once the COVR LEDs light up solid white, it means the COVR Point has a strong signal.");
					var covrText_p3 = I18N("j", "Click “Finish” to proceed.");

					$('#wizard_wording').html(covrText_p1 + "<br/><br/>" + covrText_p2 + "<br/><br/>" + covrText_p3);
				}else {
					$('#wizard_wording').html(I18N("j", "You may now <span style='color:red;'>plug</span> the Covr Extender and place it in a location <b>between your Covr Router and the Wi-Fi weak area or deadzone.</b> Once placed, verify that <b>all five LEDs are solid green.</b> If the two uplink LEDs are not solid green move the Covr Extender closer to the Covr Router until they are."));
				}

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'none'});
				$('.wizardTopology').css({'display':'none'});

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#CovrExtenderPlacement').css({'display':'table'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Finish"));

				$('#btn_next').css({'display':'inline'});

				break;
			case 15:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "Install Updates Automatically"));
				$('#wizard_wording').html(I18N("j", "<b>Always Update</b> provides latest protection and new feature over the air, gives your device fresh and sound firmware."));

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'none'});

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#AutoUpgrade_setupTable').css({'display':'table'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$("#autoUpgrade_icon").css({'display': 'block'})

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_back, #btn_next').css({'display':'inline'});
				break;

			case 16:
				/*///// Page: Welcome Page /////*/
				$('#wizard_title').html(I18N("j", "Time Zone"));
				$('#wizard_wording').html(I18N("j", "Some essential features require you to set a time zone to work properly. Please select your time zone from the drop-down menu."));

				$('#wizard_wording').css({'display':'block'});

				/*///// Topology /////*/
				$('#wizard_topology').css({'display':'inline'});
				$('.wizardTopology').css({'display':'none'});

				$('#topology').css({'display':'inline-block'});
				$('#wizard_deviceName').css({'display':'block'});

				$("#wizard_wan_line").attr("class", "wizard_wan_line_off");
				$("#wizard_wifi_line").attr("class", "wizard_wifi_line_off");
				$("#wizard_router").attr("class", "wizard_router_on");

				$("#autoUpgrade_icon").css({'display': 'none'});

				/*///// content /////*/
				$('.wizardElement').hide();
				$('#ianaTimeZone_setupTable').css({'display':'table'});

				/*///// Button Status Change /////*/
				$('#languagetext, #languageselect, #btn_back, #btn_next').hide();

				$('#btn_back').html(I18N("j", "Back"));
				$('#btn_next').html(I18N("j", "Next"));

				$('#btn_back, #btn_next').css({'display':'inline'});
				break;
		}

		// var dialogBoxClient = document.getElementById("dialogBox").clientHeight;
		// document.getElementById('dialogBox').style.top = (docClientHeight-dialogBoxClient)/2 +"px";

		//problem
		$('#dialogBox').css({'overflow':'visible'});
	},
	GetXML_SetDeviceSettings: function() {
		var me = this;

		me.SetXML();
	},
	getInternetStatus: function(counter) {
		var me = this;

		var trigger = false;
		var count = counter;
		
		if(count == 0) {
			trigger = true;
		}

		var getCurrentInternetStatus = new SOAPGetCurrentInternetStatus();
		getCurrentInternetStatus.InternetStatus = trigger;
		var soapAction = new SOAPAction();
		soapAction.sendSOAPAction("GetCurrentInternetStatus", getCurrentInternetStatus, null).done(function(obj) {
			count++;

			if(obj.GetCurrentInternetStatusResult == "OK_DETECTING_2") {
				if(count < 5) {
					setTimeout("wizardFn.GetInternetConnectionStatus("+count+")", 2000);
				} else {
					//give up
					me.wizard_Step = 13;
					me.wizard_update();
				}
			} else {
				me.wizard_Step = 13;

				var getMyDLinkSettingsResponse = new SOAPGetMyDLinkSettingsResponse();
				soapAction.sendSOAPAction("GetMyDLinkSettings", null, getMyDLinkSettingsResponse).done(function() {
					if(getMyDLinkSettingsResponse.GetRegisterAccountStatus == "true") {
						$('#wz_MydlinkStatus').html(I18N("j", "Registered"));
						$('#wz_MydlinkStatus').css({'color':'#4598aa'});
						$('#wz_mydlink_status').attr('src','./image/connected.png?v=c3d3a4b979');
					} else {
						$('#wz_MydlinkStatus').html(I18N("j", "Unregistered"));
						$('#wz_MydlinkStatus').css({'color':'#ff0000'});
						$('#wz_mydlink_status').attr('src','./image/disconnected.png?v=3e3747ccf7');
					}

					if(getMyDLinkSettingsResponse.GetCurrentInternetStatusResult == "OK_CONNECTED") {
						me.wizard_Step = 10;
					}
				});
			}

			me.wizard_update();
		});
	},
	mydlinkAccount: function(answer) {
		if (answer == "yes" && document.getElementById('cb_yes').getAttribute('class') == 'unclick') {
			//selected DHCP
			cb_yes.setAttribute("class", "clicked");
			cb_no.setAttribute("class", "unclick");
		}else if (answer == "no" && document.getElementById('cb_no').getAttribute('class') == 'unclick') {
			//selected PPPoE
			cb_yes.setAttribute("class", "unclick");
			cb_no.setAttribute("class", "clicked");
		}
	},
	changeButtonStatus: function() {
		if($("#option1").prop('checked')) {
			$("#btn_next").attr("class", "styled-button_enable").prop("disabled", false);
		} else {
			$("#btn_next").attr("class", "styled-button_disable").prop("disabled", true);
		}
	},
	SetMyDlinkRegister: function() {
		var me = this;

		if (document.getElementById("accountName").value == "" || document.getElementById("password_mydlink").value == "") {
			document.getElementById("MyDLink_description").innerHTML = I18N("j", "Email or password field is required.");
		} else {
			document.getElementById("btn_next").setAttribute("class", "styled-button_disable");
			document.getElementById("btn_back").setAttribute("class", "styled-button_disable");
			document.getElementById("btn_next").disabled = true;
			document.getElementById("btn_back").disabled = true;
			document.getElementById("MyDLink_description").innerHTML = "";
			document.getElementById("show_loadingImageDefault").style.display = "table-row";
			
			var soapAction = new SOAPAction();
			var setMyDLinkSettings = new SOAPSetMyDLinkSettings();
			setMyDLinkSettings.Email = $("#accountName").val();
			setMyDLinkSettings.Password = $("#password_mydlink").val();
			setMyDLinkSettings.LastName = $("#lastName").val();
			setMyDLinkSettings.FirstName = $("#firstName").val();
			setMyDLinkSettings.AccountStatus = false;

			soapAction.sendSOAPAction("SetMyDLinkSettings", setMyDLinkSettings, null).done(function(obj) {
				if(obj.SetMyDLinkSettingsResult.toUpperCase() == "OK" || obj.SetMyDLinkSettingsResult.toUpperCase() == "RESTART") {
					me.SetMyDlinkRegister2();
				} else {
					document.getElementById("MyDLink_description").innerHTML = SetResult_2nd;
					document.getElementById("show_loadingImageDefault").style.display = "none";
					document.getElementById("btn_next").setAttribute("class", "styled-button_enable");
					document.getElementById("btn_back").setAttribute("class", "styled-button_enable");
					document.getElementById("btn_next").disabled = false;
					document.getElementById("btn_back").disabled = false;
				}
			});
		}
	},
	SetMyDlinkRegister2: function() {
		var me = this;

		var soapAction = new SOAPAction();
		var setMyDLinkSettings = new SOAPSetMyDLinkSettings();
		setMyDLinkSettings.Email = $("#accountName").val();
		setMyDLinkSettings.Password = $("#password_mydlink").val();
		setMyDLinkSettings.AccountStatus = true;
		soapAction.sendSOAPAction("SetMyDLinkSettings", setMyDLinkSettings, null).done(function(obj) {
			if(obj.SetMyDLinkSettingsResult.toUpperCase() == "OK" || obj.SetMyDLinkSettingsResult.toUpperCase() == "RESTART") {
				document.getElementById("wz_MydlinkStatus").innerHTML = I18N("j", "Registered");
				document.getElementById("wz_mydlink_status").src = "./image/connected.png?v=c3d3a4b979";
				document.getElementById("show_loadingImageDefault").style.display = "none";
				
				me.wizard_Step = 13;
				me.wizard_update();
			} else {
				var split_ErrorMessage = obj.SetMyDLinkSettingsResult.split("]");
				var split_FinalErrorMessage = split_ErrorMessage[split_ErrorMessage.length - 1];
				document.getElementById("MyDLink_description").innerHTML = split_FinalErrorMessage;
				document.getElementById("show_loadingImageDefault").style.display = "none";			
			}
		});
	},
	SetDeviceRegister_a: function() {
		var me = this;

		if (document.getElementById("accountName_a").value == "" || document.getElementById("password_mydlink_a").value == "") {
			document.getElementById("MyDLink_description_a").innerHTML = I18N("j", "Email or password field is required.");

			//remove next button stack
			wizardStepStack.pop();
		} else {
			$("#btn_next, #btn_back").attr("class", "styled-button_disable").prop("disabled", true);
			document.getElementById("MyDLink_description_a").innerHTML = "";
			document.getElementById("show_loadingImage").style.display = "table-row";

			var soapAction = new SOAPAction();
			var setMyDLinkSettings = new SOAPSetMyDLinkSettings();
			setMyDLinkSettings.Email = $("#accountName_a").val();
			setMyDLinkSettings.Password = $("#password_mydlink_a").val();
			setMyDLinkSettings.AccountStatus = true;
			soapAction.sendSOAPAction("SetMyDLinkSettings", setMyDLinkSettings, null).done(function(obj) {
				if(obj.SetMyDLinkSettingsResult.toUpperCase() == "OK" || obj.SetMyDLinkSettingsResult.toUpperCase() == "RESTART") {
					// Register Complete
					document.getElementById("wz_MydlinkStatus").innerHTML = I18N("j", "Registered");
					document.getElementById("wz_mydlink_status").src = "./image/connected.png?v=c3d3a4b979";
					document.getElementById("show_loadingImage").style.display = "none";
					me.mydlink_registered = true;
					me.wizard_Step = 13;
					me.wizard_update();
				} else {
					var split_ErrorMessage = obj.SetMyDLinkSettingsResult.split("]");
					var split_FinalErrorMessage = split_ErrorMessage[split_ErrorMessage.length - 1];
					document.getElementById("MyDLink_description_a").innerHTML = split_FinalErrorMessage;
					document.getElementById("show_loadingImage").style.display = "none";
					$("#btn_next, #btn_back").attr("class", "styled-button_enable").prop("disabled", false);
					wizardStepStack.pop();	//remove next button stack
				}
			});
		}
	},
	SetXML: function() {
		var me = this;

		$('#createPop_Manual, #dialogBox_Background').hide();
		var msg = I18N("j", "Please wait");
		PopView.show(msg);
		stopTimeout();
		me.finishWizard = true;

		//admin
		var soapAction = new SOAPAction();
		var DeviceSettings = new SOAPSetDeviceSettings();
		DeviceSettings.DeviceName = me.getDeviceSettingsResponse.DeviceName;
		DeviceSettings.AdminPassword = document.getElementById("device_password").value;
		DeviceSettings.ChangePassword = true;
		DeviceSettings.CAPTCHA = false;
		DeviceSettings.PresentationURL = me.getDeviceSettingsResponse.PresentationURL;
		if(currentDevice.featureNewTime) {
			DeviceSettings.TZLocation = $("#timeZone_Search").val();
		}
		soapAction.SetMultipleSOAP("SetDeviceSettings", DeviceSettings, null);
		localStorage.setItem('RunningWizard', 'false');

		//wan
		soapAction.SetMultipleSOAP("SetWanSettings", me.setWanSettings, null);

		//wifi
		var n24g_wifiData = me.getWiFiData(24);
		setWLanRadioSettings_24g.MUMIMOEnabled = n24g_wifiData.settings.MUMIMOEnabled;
		setWLanRadioSettings_24g.BandSteeringEnabled = true;
		setWLanRadioSettings_24g.AirTimeFairnessEnabled = n24g_wifiData.settings.AirTimeFairnessEnabled;
		soapAction.SetMultipleSOAP("SetWLanRadioSettings", setWLanRadioSettings_24g, null);
		soapAction.SetMultipleSOAP("SetWLanRadioSecurity", setWLanRadioSecurity_24g, null);	
	
		if(!currentDevice.featureSmartConnect && !currentDevice.featureCovrWIFI) {
			var n5g_wifiData = me.getWiFiData(5);
			setWLanRadioSettings_5g.MUMIMOEnabled = n5g_wifiData.settings.MUMIMOEnabled;
			setWLanRadioSettings_5g.BandSteeringEnabled = true;
			setWLanRadioSettings_5g.AirTimeFairnessEnabled = n5g_wifiData.settings.AirTimeFairnessEnabled;
			soapAction.SetMultipleSOAP("SetWLanRadioSettings", setWLanRadioSettings_5g, null);
			soapAction.SetMultipleSOAP("SetWLanRadioSecurity", setWLanRadioSecurity_5g, null);
		}

		if(currentDevice.featureSmartConnect) {
			var setSmartconnectSettings = new SOAPSetSmartconnectSettings();
			setSmartconnectSettings.Enabled = true;
			soapAction.SetMultipleSOAP("SetSmartconnectSettings", setSmartconnectSettings, null);
		}

		if(currentDevice.featureAutoUpgrade) {
			var setFirmwareAutoUpdate = new SOAPSetFirmwareAutoUpdate();
			var setEventNotification = new SOAPSetEventNotification();

			setFirmwareAutoUpdate.AutoDownload = me.automaticUpgradeTick;
			setFirmwareAutoUpdate.AutoUpdate = me.automaticUpgradeTick;
			setEventNotification.Enabled = me.automaticUpgradeTick;
			setEventNotification.AutoFirmwareUpgrade = me.automaticUpgradeTick;

			delete setFirmwareAutoUpdate.TimeToUpdate.TimeHourValue;
			delete setFirmwareAutoUpdate.TimeToUpdate.TimeMinuteValue;
			delete setFirmwareAutoUpdate.TimeToUpdate.TimeMidDateValue;

			soapAction.SetMultipleSOAP("SetEventNotification", setEventNotification, null);
			soapAction.SetMultipleSOAP("SetFirmwareAutoUpdate", setFirmwareAutoUpdate, null);
		}

		if(!currentDevice.featureNewTime) {
			var setTimeSettings = new SOAPSetTimeSettings_old();

			var d = new Date();
			var n = d.getTimezoneOffset() / - 60;
			var clientTimeZone = n.toString();

			switch(clientTimeZone) {
				case "-12":	 setTimeSettings.TimeZone = '1';	break;
				case "-11":	 setTimeSettings.TimeZone = '2';	break;
				case "-10":	 setTimeSettings.TimeZone = '3';	break;
				case "-9":	 setTimeSettings.TimeZone = '4';	break;
				case "-8":	 setTimeSettings.TimeZone = '5';	break;
				case "-7":	 setTimeSettings.TimeZone = '6';	break;
				case "-6":	 setTimeSettings.TimeZone = '9';	break;
				case "-5":	 setTimeSettings.TimeZone = '13';	break;
				case "-4.5": setTimeSettings.TimeZone = '15';	break;
				case "-4":	 setTimeSettings.TimeZone = '16';	break;
				case "-3.5": setTimeSettings.TimeZone = '19';	break;
				case "-3":	 setTimeSettings.TimeZone = '20';	break;
				case "-2":	 setTimeSettings.TimeZone = '23';	break;
				case "-1":	 setTimeSettings.TimeZone = '24';	break;
				case "0":	 setTimeSettings.TimeZone = '27';	break;
				case "1":	 setTimeSettings.TimeZone = '28';	break;
				case "2":	 setTimeSettings.TimeZone = '33';	break;
				case "3":	 setTimeSettings.TimeZone = '39';	break;
				case "3.5":	 setTimeSettings.TimeZone = '42';	break;
				case "4":	 setTimeSettings.TimeZone = '43';	break;
				case "4.5":	 setTimeSettings.TimeZone = '46';	break;
				case "5":	 setTimeSettings.TimeZone = '47';	break;
				case "5.5":	 setTimeSettings.TimeZone = '48';	break;
				case "5.75": setTimeSettings.TimeZone = '50';   break;
				case "6":	 setTimeSettings.TimeZone = '51';	break;
				case "6.5":	 setTimeSettings.TimeZone = '53';	break;
				case "7":	 setTimeSettings.TimeZone = '54';	break;
				case "8":	 setTimeSettings.TimeZone = '60';	break;
				case "9":	 setTimeSettings.TimeZone = '62';	break;
				case "9.5":	 setTimeSettings.TimeZone = '65';	break;
				case "10":	 setTimeSettings.TimeZone = '67';	break;
				case "11":	 setTimeSettings.TimeZone = '72';	break;
				case "12":	 setTimeSettings.TimeZone = '74';	break;
				case "13":	 setTimeSettings.TimeZone = '77';	break;
				default:	 setTimeSettings.TimeZone = '60';	break;
			}

			soapAction.SetMultipleSOAP("SetTimeSettings", setTimeSettings, null);
		}

		soapAction.SendMultipleSOAPAction("SetMultipleActions").done(function(a,response, time) {
			if(time != '') {
				me.countDownTimer = time;
			}

			var msg = I18N("j", "When reconnecting to this device, please use the new Wi-Fi name and password you created.");
			var msg2 = I18N("j", "The new settings have been saved.");

			PopView.showWithCountdown(msg, me.countDownTimer).done(function() {
				if(currentDevice.featureCovrWIFI) {
					$('#createPop_Manual, #dialogBox_Background').show();
					me.wizard_Step = 14;
					me.wizard_update();
					PopView.hide();
				} else {
					PopView.showConfirm(msg2).done(function(){
						me.returnToHome();
					});
				}
			});
		}).fail(function() {
			me.returnToHome();
		});
	},
	setTimeZone: function() {
		var me = this;

		var soapAction = new SOAPAction();
		var setTimeSettings = null;

		if(currentDevice.featureNewTime) {
			setTimeSettings = new SOAPSetTimeSettings();
			setTimeSettings.TZLocation = $("#timeZone_Search").val();
		} else {
			setTimeSettings = new SOAPSetTimeSettings_old();

			var d = new Date()
			var n = d.getTimezoneOffset() / - 60;
			var clientTimeZone = n.toString();

			switch(clientTimeZone) {
				case "-12":  setTimeSettings.TimeZone = '1';    break;
				case "-11":	 setTimeSettings.TimeZone = '2';	break;
				case "-10":  setTimeSettings.TimeZone = '3';	break;
				case "-9":   setTimeSettings.TimeZone = '4';	break;
				case "-8":   setTimeSettings.TimeZone = '5';	break;
				case "-7":	 setTimeSettings.TimeZone = '6';	break;
				case "-6":	 setTimeSettings.TimeZone = '9';	break;
				case "-5":	 setTimeSettings.TimeZone = '13';	break;
				case "-4.5": setTimeSettings.TimeZone = '15';	break;
				case "-4":	 setTimeSettings.TimeZone = '16';	break;
				case "-3.5": setTimeSettings.TimeZone = '19';	break;
				case "-3":	 setTimeSettings.TimeZone = '20';	break;
				case "-2":	 setTimeSettings.TimeZone = '23';	break;
				case "-1":	 setTimeSettings.TimeZone = '24';	break;
				case "0":	 setTimeSettings.TimeZone = '27';	break;
				case "1":	 setTimeSettings.TimeZone = '28';	break;
				case "2":	 setTimeSettings.TimeZone = '33';	break;
				case "3":	 setTimeSettings.TimeZone = '39';	break;
				case "3.5":	 setTimeSettings.TimeZone = '42';	break;
				case "4":	 setTimeSettings.TimeZone = '43';	break;
				case "4.5":	 setTimeSettings.TimeZone = '46';	break;
				case "5":	 setTimeSettings.TimeZone = '47';	break;
				case "5.5":	 setTimeSettings.TimeZone = '48';	break;
				case "5.75": setTimeSettings.TimeZone = '50';   break;
				case "6":	 setTimeSettings.TimeZone = '51';	break;
				case "6.5":	 setTimeSettings.TimeZone = '53';	break;
				case "7":	 setTimeSettings.TimeZone = '54';	break;
				case "8":	 setTimeSettings.TimeZone = '60';	break;
				case "9":	 setTimeSettings.TimeZone = '62';	break;
				case "9.5":	 setTimeSettings.TimeZone = '65';	break;
				case "10":	 setTimeSettings.TimeZone = '67';	break;
				case "11":	 setTimeSettings.TimeZone = '72';	break;
				case "12":	 setTimeSettings.TimeZone = '74';	break;
				case "13":	 setTimeSettings.TimeZone = '77';	break;
				default:	 setTimeSettings.TimeZone = '60';	break;
			}
		}

		soapAction.sendSOAPAction("SetTimeSettings", setTimeSettings, null).done(function() {

			var msg = I18N("j", "When reconnecting to this device, please use the new Wi-Fi name and password you created.");
			var msg2 = I18N("j", "The new settings have been saved.");

			PopView.showWithCountdown(msg, me.countDownTimer).done(function() {
				if(currentDevice.featureCovrWIFI) {
					$('#createPop_Manual, #dialogBox_Background').show();
					me.wizard_Step = 14;
					me.wizard_update();
					PopView.hide();
				} else {
					PopView.showConfirm(msg2).done(function(){
						me.returnToHome();
					});
				}
			});
		}).fail(function() {
			me.returnToHome();
		});
	},
	wizardTickChange: function(type) {
		changeTimeoutAction();

		if(type == "on") {
			$("#AutoUpgrade_on").attr("class", "clicked");
			$("#AutoUpgrade_off").attr("class", "unclick");
			this.automaticUpgradeTick = true;
		} else {
			$("#AutoUpgrade_on").attr("class", "unclick");
			$("#AutoUpgrade_off").attr("class", "clicked");
			this.automaticUpgradeTick = false;
		}
	},
	returnToHome: function() {
		var me = this;

		if(me.finishWizard) {
			window.location.replace('../info/Login.html');
		} else {
			self.location.href = "Home.html";
		}
	},
	PopupTermOfUser: function() {
		startTimeout();
		var me = this;
		$('#wizard_title').html(I18N("j", "Terms of Use and Privacy Policy"));
		$('#wizard_topology, #wizard_settings, #closeCreatePopBtn, #btn_back, #btn_next').hide();
		$("#btn_agree").show();

		$('#languagetext, #languageselect').css({'display':'inline-block'});

		$("#Dialog_termNprivacy").load("wizard_TermUI.html #page-content-expand", function(){
			var lan = localStorage.language.split('-')[1];
			var tosString = tos_LANG[lan];
			var privacyString = privacy_LANG[lan];

			for(var id in tosString) {
				$("#" + id).html(tosString[id]);
			}
			for(var id in privacyString) {
				$("#" + id).html(privacyString[id]);
			}
		}).show();
	}
};