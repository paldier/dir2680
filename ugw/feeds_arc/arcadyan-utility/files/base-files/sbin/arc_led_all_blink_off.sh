#!/bin/sh

echo 0 > /proc/driver/ifx_led/all_led_blink
echo 1 > /proc/driver/ifx_gphy/led_control
rm -f /tmp/disable_all_buttons

