#!/bin/sh

touch /tmp/disable_all_buttons
echo 0 > /proc/driver/ifx_gphy/led_control
echo 1 > /proc/driver/ifx_led/all_led_blink

