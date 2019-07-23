var currentDevice = JSON.parse(sessionStorage.getItem('currentDevice'));

function COMM_SetSelectValue(obj, value)
{
	for (var i=0; i < obj.length; i+=1)
		if (obj[i].value == value)
		{
			obj.selectedIndex = i;
			break;
		}
	return obj.selectedIndex;
}

function COMM_ToBOOL(val)
{
	if (val==null) return false;
	switch (typeof(val))
	{
		case 'boolean':
			return val;
		case 'string':
			var result = false;
			switch(val.toLowerCase())
			{
				case "true":
				case "1":
				case "on":
				case "enable":
				case "enabled":
					result = true;
					break;
			}
			return result;
		case 'number':
			return (val == 1) ? true:false;
	}
	//console.log("COMM_ToBOOL: unsupported type "+typeof(val));
	return false;
}

function COMM_Pow(a, b)
{
	var c = 1;
	for (var i = 0; i < b; i+=1) c = c*a;
	return c;
}

/* COMM_IPv4INT2ADDR(16843009) -> "1.1.1.1" */
function COMM_IPv4INT2ADDR(val)
{
	var nums = new Array();
	var str;

	nums[3] = val % 256; val = (val-nums[3])/256;
	nums[2] = val % 256; val = (val-nums[2])/256;
	nums[1] = val % 256; val = (val-nums[1])/256;
	nums[0] = val % 256;
	str = nums[0]+"."+nums[1]+"."+nums[2]+"."+nums[3];
	return str;
}

/* COMM_IPv4ADDR2INT("1.1.1.1") -> 16843009 */
function COMM_IPv4ADDR2INT(addr)
{
	var nums;
	var vals = new Array();
	var val;

	nums = addr.split(".");
	vals[0] = (parseInt(nums[0], [10]) % 256);
	vals[1] = (parseInt(nums[1], [10]) % 256);
	vals[2] = (parseInt(nums[2], [10]) % 256);
	vals[3] = (parseInt(nums[3], [10]) % 256);
	val = vals[0];
	val = val*256 + vals[1];
	val = val*256 + vals[2];
	val = val*256 + vals[3];
	return val;
}

/* COMM_IPv4INT2MASK(24) -> "255.255.255.0" */
function COMM_IPv4INT2MASK(val)
{
	var bits = 0;
	if (val < 32) bits = COMM_Pow(2,32) - COMM_Pow(2,32-val);
	else if (val == 32) return "255.255.255.255";
	return COMM_IPv4INT2ADDR(bits);
}

function count_bits(val)
{
	for (var i = 7; i >= 0; i-=1) if ((val & COMM_Pow(2, i))==0) break;
	return 7-i;
}

/* COMM_IPv4IPADDR("192.168.0.0", 24, 20) -> "192.168.0.20" */
function COMM_IPv4IPADDR(network, mask, host)
{
	network = COMM_IPv4NETWORK(network,mask);
	var m = Math.pow(2, parseInt(32-mask, 10))-1;
	host = parseInt((host & m), 10);
	return COMM_IPv4INT2ADDR(COMM_IPv4ADDR2INT(network)+host);
}

/* COMM_IPv4NETWORK("192.168.1.1", 24) -> "192.168.1.0" */
function COMM_IPv4NETWORK(addr, mask)
{
	var addrArray = addr.split(".");
	var maskArray = COMM_IPv4INT2MASK(mask).split(".");
	var networkArray = new Array();
	var str = "";
	for (var i=0; i<4; i+=1)
	{
		if (isNaN(addrArray[i])||addrArray[i].length==0||parseInt(addrArray[i],10)>255) return "0.0.0.0";
		networkArray[i] = eval(addrArray[i] & maskArray[i]);
		str += str?"."+networkArray[i]:networkArray[i];
	}
	return str;
}

/* COMM_IPv4HOST("192.168.0.1", 24) -> "1" */
function COMM_IPv4HOST(addr, mask)
{
	var addrArray = addr.split(".");
	var maskArray = COMM_IPv4INT2MASK(mask).split(".");
	var networkArray = new Array();
	var str = "";
	for (var i=0; i<4; i+=1)
	{
		networkArray[i] = eval(addrArray[i] & ~maskArray[i]);
		str += str?"."+networkArray[i]:networkArray[i];
	}
	return COMM_IPv4ADDR2INT(str);
}

/* COMM_IPv4MAXHOST(24) -> "255" */
function COMM_IPv4MAXHOST(mask)
{
	return COMM_IPv4HOST("255.255.255.255", mask);
}

/* COMM_IPv4MASK2INT("255.255.255.0") -> "24" */
function COMM_IPv4MASK2INT(mask)
{
	var nums = mask.split(".");
	var vals = new Array();
	var bits = 0;

	vals[0] = (parseInt(nums[0], [10]) % 256);
	vals[1] = (parseInt(nums[1], [10]) % 256);
	vals[2] = (parseInt(nums[2], [10]) % 256);
	vals[3] = (parseInt(nums[3], [10]) % 256);

	bits = count_bits(vals[0]);
	if (vals[0] == 255)
	{
		bits += count_bits(vals[1]);
		if (vals[1] == 255)
		{
			bits += count_bits(vals[2]);
			if (vals[2] == 255) bits += count_bits(vals[3]);
		}
	}
	if (mask != COMM_IPv4INT2MASK(bits)) return -1;
	return bits;
}

/* Check ipv4 address format, it should be x.x.x.x and digit.*/
function COMM_ValidV4Format(ipstr)
{
	var vals = ipstr.split(".");
	if (vals.length!=4) return false;
	for (var i=0; i<4; i++)
	{
		if (!COMM_IsDigit(vals[i]) || vals[i]>255 || vals[3] < 1)
		{
			return false;
	}
	}
	return true;
}

/* Check ipv4 address value, return true if the ipaddr is a valid v4 dot-number IP address. */
function COMM_ValidV4Addr(ipaddr)
{
	var host = COMM_IPv4HOST(ipaddr, 0);
	if (host == ""||host == 0) return false;
	
	var network = COMM_IPv4NETWORK(ipaddr, 8);
	var tmp = network.split(".");
	if(tmp[0] < 1) return false;
	if(tmp[0] > 223) return false;
	if(tmp[0] == 127) return false;
	
	return true;
}

function COMM_ValidV4HOST(ipaddr, mask)
{
	var hostid = COMM_IPv4HOST(ipaddr, mask);
	if(hostid == "") return false;
	var maxhid = COMM_IPv4MAXHOST(mask);
	if(hostid > 0 && hostid < maxhid) return true;
	return false;
}

/* Convert int type seconds to readable time interval.
** input	: int type second
** return	: Array["day"]	= int days
**            Array["hour"]	= int hours
**            Array["min"]	= int minutes
**            Array["sec"]	= int seconds
*/
function COMM_SecToStr( secs )
{
	if( secs == "" )
		secs = 0;
	var str = new Array();
	str["day"]	= Math.round(secs/(24*60*60) - 0.5);
	str["hour"]	= Math.round((secs%(24*60*60))/(60*60) - 0.5 );
	str["min"]	= Math.round(((secs%(24*60*60))%(60*60))/60 - 0.5);
	str["sec"]	= ((secs%(24*60*60))%(60*60))%60;
	return str;
}

/* Get the parameter included in URL. ex: http:\\192.168.0.1\Home.html?para=abc*/
function COMM_GetURLParameter(parameter)
{
	var reg = new RegExp("(^|\\?|&)"+ parameter +"=([^&]*)(\\s|&|$)", "i");  
    if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, " "));
    else return "";	
}

function COMM_IsDigit(no)
{
	if (no==""||no==null)
		return false;
	if (no.toString()!=parseInt(no, 10).toString())
		return false;

    return true;
}

function COMM_IsInteger(str)
{
	var y = parseInt(str);
	if (isNaN(y)) return false;
	return str===y.toString();
}

function COMM_IsMAC(mac)
{
	var RegExPattern =/^\s*([\d[a-f]{2}:){5}[\d[a-f]{2}\s*$/i;
	var RegExPattern2 =/^\s*([\d[a-f]{2}-){5}[\d[a-f]{2}\s*$/i;
  	if (mac.match(RegExPattern) || mac.match(RegExPattern2))
  		return true;
  	else return false;
}

function COMM_IsASCII(str)
{
	var ValidHEXRegex = /^[ -~]+$/;	
	var result = ValidHEXRegex.test(str);

	if(str == "")
		result = true;

	return result;
}

function COMM_ValidName(value) {
	var returnVal = true;
	var ValidHEXRegex = /^[A-Za-z0-9\s\-\_]+$/;

	if(ValidHEXRegex.test(value)){
		returnVal = true;
	} else {
		returnVal = false;
	}

	return returnVal;
}


//for XML encoding
var encoding_code = new Array("22", "23", "24", "25", "26", "27", "2B", "2C", "2F", "3A", "3B", "3C", "3D", "3E", "3F", "40", "5B", "5C", "5D", "5E", "60", "7B", "7C", "7D", "7E");
var encoding_char = new Array('"', '#', '$', '%', '&', '\'', '+', ',', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '`', '{', '|', '}', '~');

function asciiToHex(ascii)
{
	var hex = "";
	
	if(ascii == null)
		return "";
	
	for(var i = 0; i < ascii.length; i++)
	{
		var dec = ascii.charCodeAt(i);
		var str = "";
	
		str = parseInt(dec/16, 10);
		
		if(str > 9)
		{
			str = String.fromCharCode(str+55);
		}
		
		if((dec%16) > 9)
		{
			str += String.fromCharCode((dec%16)+55);
		}
		else
		{
			str += (dec%16)+"";
		}
		hex += str;
	}
	return hex;
}

function HTMLEncode(str)	//follow HTML spec
{
	var output = $('<div/>').text(str).html();
	
	output = output.replace(/ /g, '&nbsp;');
	return output;
}

function HTMLDecode(str)
{
	return $('<div/>').html(str).text();
}

function XMLEncode(str)
{
	var output = str.replace(/&/g, '&amp;');
	output = output.replace(/</g, '&lt;');
	output = output.replace(/>/g, '&gt;');	
	//output = output.replace(/\'/g, '&apos;');
	//output = output.replace(/\"/g, '&quot;');
	//output = output.replace(/\\/g, '&#92;');
	return output;
}

function XMLDecode(str)
{
	var output = str.replace(/&lt;/g, '<');
	output = output.replace(/&gt;/g, '>');
	//output = output.replace(/&apos;/g, '\'');
	//output = output.replace(/&quot;/g, '\"');
	output = output.replace(/&amp;/g, '&');
	//output = output.replace(/&#92;/g, '\\');

	return output;
}


function clearcode(str)
{
	var output = str.replace(/&/g, '');
	output = output.replace(/</g, '');
	output = output.replace(/>/g, '');	
	output = output.replace(/\'/g, '');
	output = output.replace(/\"/g, '');
	output = output.replace(/\\/g, '');
	return output;
}


function AllEncode(str)
{
	var output = str.replace(/&/g, '&amp;');
	output = output.replace(/</g, '&lt;');
	output = output.replace(/>/g, '&gt;');	
	output = output.replace(/\'/g, '&apos;');
	output = output.replace(/\"/g, '&quot;');
	output = output.replace(/\\/g, '&#92;');
	return output;
}


function AllDecode(str)
{
	var output = str.replace(/&lt;/g, '<');
	output = output.replace(/&gt;/g, '>');
	output = output.replace(/&apos;/g, '\'');
	output = output.replace(/&quot;/g, '\"');
	output = output.replace(/&amp;/g, '&');
	output = output.replace(/&#92;/g, '\\');

	return output;
}


function decode_char_text(encode_str)	//hardcore encode
{
	var find = false;
	var is_encoding = 0;
	var msg = "";
	var temp_str = "";
	var i,j,k;
	
	if(encode_str == null)
		return "";
	
	for(i = 0, j = 0; i < encode_str.length; i++, j++)
	{
		if(encode_str[i] != '%')
		{
			msg += encode_str[i];
		}
		else
		{
			find = false;
			temp_str = encode_str[i+1] + encode_str[i+2];
			
			for(k = 0; k < encoding_code.length; k++)
			{
				if(temp_str == encoding_code[k])
				{
					msg += encoding_char[k];
					i+=2;
					find = true;
					break;
				}
			}
			
			if(find == false)
			{
				msg += encode_str[i];
			}

		}
	}

	return msg;
}

function encode_char_text(msg)
{
	var str = "";
	
	if(msg == null)
		return "";
	
	for(var i = 0; i < msg.length; i++)
	{
		var ch = msg.substring(i, i+1);
		var find = false;
	
		for(var j = 0; j < encoding_char.length; j++)
		{
			if(ch == encoding_char[j])
			{
				find = true;
			}
		}
		
		if(find)
		{
			str += "%" + asciiToHex(ch);		
		}
		else
		{
			str += ch;
		}
	}
	
	return str;
}

function XMLEncode_forheader(str) {
	var output = str.replace(/&/g, '&amp;');
	output = output.replace(/</g, '&lt;');
	output = output.replace(/>/g, '&gt;');
	return output;
}

//sleep function
//usage: sleep().done(....).fail(....)
var sleep = function(delay){
	var sleepdtd = $.Deferred();
	
	var tasks = function(){
		sleepdtd.resolve();
	};
	setTimeout(tasks,delay);
	return sleepdtd.promise();
};
$(document).ready(function(){
	function initBlocks(){
		
		var blockCount = 0;
		setTimeout(function(){$("#main>div").not(".advButton").each(function(){
			if($(this).css("display") != "none"){
				blockCount++;
				$(this).addClass("firstShownBlock");
				$(".firstShownBlock:eq(0)").not("#vlan_setting, #AutoFirmwareUpgrade").find("hr").remove();
			}

		})},2)
		
	}
	initBlocks();

})