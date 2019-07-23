#!/usr/bin/env python
# Copyright (c) 2015 by Silicon Laboratories Inc. All rights reserved.
# http://developer.silabs.com/legal/version/v11/Silicon_Labs_Software_License_Agreement.txt

"""
usage: efm8load.py [-h] [--version] [-b BAUD] [-p PORT] [-t] bootfile

EFM8 bootloader download utility.

positional arguments:
  bootfile              boot record file to download

optional arguments:
  -h, --help            show this help message and exit
  --version             show program's version number and exit
  -b BAUD, --baud BAUD  baudrate (default: 115200)
  -p PORT, --port PORT  port (default=usb | jlink)
  -t, --trace           show download trace
"""

from __future__ import print_function
import argparse
import serial
import sys
import os
import errno
#import hidport
#import smbport

VERSION = '1.10'


def send_frame(port, frame):
    """Send a boot frame and return the reply.

    Args:
        frame (bytes): A boot frame to send to the EFM8 bootloader.

    Returns:
        Reply byte as an integer. 0x3F for recognized replies and timeouts.
    """
    port.write(str(frame))
    reply = port.read()
    if reply and reply in b'@ABC':
        return ord(reply)
    else:
        return ord(b'?')

def tohex(data):
    """Convert binary data array to ascii hex string.
    """
    return ' '.join("{:02X}".format(c) for c in data)

def efm8load(port, bootfile, trace=False):
    """Download EFM8 bootfile over the specified port.

    Args:
        port: Communication port connected to EFM8 bootloader.
        bootfile: Binary boot record file object.
        trace: If true, print trace of download data.

    Returns:
        The number of errors detected during the download.
    """
    errors = 0
    
    # Send the auto-baud training charater for the UART bootloader
    if isinstance(port, serial.Serial):
        port.write(b'\xff\xff')

    # For each frame in the binary boot record file
    header = bytearray(bootfile.read(2))
    while header and len(header) == 2:
        # Parse one boot record frame
        frame = header + bootfile.read(header[1])
        if header[0] != ord(b'$') or header[1] != len(frame)-2:
            raise RuntimeError("Bad record header")
        header = bytearray(bootfile.read(2))

        # Send the frame and record any errors
        reply = send_frame(port, frame)
        if reply != ord(b'@'):
            errors += 1

        # Display a trace record or progress bar
        if trace:
            print("{:c} {} -> {:c}".format(frame[0], tohex(frame[1:9]), reply))
        else:
            print(chr(reply), end='')
            sys.stdout.flush()

    # Write FW successfully.
    if errors == 0:
        os.system('mng_cli tmp_set ARC_MCU_Ready=1')

    # Return the total number of errors detected
    if not trace:
        print('')
    return errors

def open_port(port_name, baud=None):
    """Open the requested communication port.

    If the port_name is not specified, will open the first EFM8 HID or STK 
    CDC-ACM port that it finds attached.
    
    Args:
        port_name (string): Name of the communication port to open.
        baud (int): Baud rate for serial ports. Ignored for other port types.

    Returns:
        IO object for communicating with EFM8 bootloader.
    """
    if port_name is None:
        port_name = 'hid' if hidport.port_count() else 'jlink'

    #url = "hwgrep://" + port_name
    url = port_name
    print("\n url = {}".format(url))
    return serial.Serial(port_name, baud, timeout=1)

    if baud is None:
        baud = 115200
    return serial.serial_for_url(url, baud, timeout=1)

if __name__ == "__main__":
    ap = argparse.ArgumentParser(description='EFM8 bootloader download utility.')
    ap.add_argument('-v', '--version', action='version', version='%(prog)s ' + VERSION)
    ap.add_argument('bootfile', type=argparse.FileType('rb'), help='boot record file to download')
    ap.add_argument('-b', '--baud', type=int, help='baudrate (SMB:100000, UART:115200)')
    ap.add_argument('-p', '--port', help='port (default=usb | jlink)')
    ap.add_argument('-t', '--trace', action='store_true', help='show download trace')
    args = ap.parse_args()

    try:
    	print("\nport= {} baud={}".format(args.port, args.baud))
        port = open_port(args.port, args.baud)
    except:
    	print("\nerror = ")
    	#str(os.strerror(serial.Serial.ValueError))
        sys.exit("ERROR: Unable to open port!")

    #print("Download over port: {}\n".format(port.name))
    print("Download over port: {}\n".format(str(args.port)))
    try:
        errors = efm8load(port, args.bootfile, args.trace)
        print("\nDownload complete with [ {} ] errors".format(errors))
    except KeyboardInterrupt:
        print("\nERROR: Download interrupted!")
    except RuntimeError:
        print("\nERROR: Unable to parse bootfile!")

    port.close()
