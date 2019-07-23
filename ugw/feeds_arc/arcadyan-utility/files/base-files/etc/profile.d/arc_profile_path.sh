#!/bin/sh
# We hiject switch_cli. So when shell calls switch_cli,
# we want shell use /bin/switch_cli instead of /usr/bin/switch_cli.
# Therefore, we put /bin in the begining of searching path.
export PATH=/bin:$PATH
