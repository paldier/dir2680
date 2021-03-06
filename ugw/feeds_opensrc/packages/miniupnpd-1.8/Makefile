#
# Copyright (C) 2006-2013 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=miniupnpd
PKG_VERSION:=1.8.20130426
PKG_RELEASE:=1

PKG_SOURCE_URL:=http://miniupnp.free.fr/files
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_MD5SUM:=ca5344eba200e4a6d1313849d68310f6
PKG_BUILD_DEPENDS:=arcadyan-utility

include $(INCLUDE_DIR)/package.mk

define Package/miniupnpd
  SECTION:=net
  CATEGORY:=Network
  DEPENDS:=+iptables +libip4tc +IPV6:libip6tc +libnfnetlink
  TITLE:=Lightweight UPnP daemon
  SUBMENU:=Firewall
  URL:=http://miniupnp.free.fr/
  MAINTAINER:=Daniel Dickinson <openwrt@cshore.neomailbox.net>
endef

define Package/miniupnpd/conffiles
/etc/config/upnpd
endef

define Package/miniupnpd/postinst
#!/bin/sh

if [ -z "$$IPKG_INSTROOT" ]; then
  ( . /etc/uci-defaults/99-miniupnpd )
  rm -f /etc/uci-defaults/99-miniupnpd
fi

exit 0
endef

define Build/Prepare
	$(call Build/Prepare/Default)
	echo "OpenWrt/$(OPENWRTVERSION)" | tr \(\)\  _ >$(PKG_BUILD_DIR)/os.openwrt
	if [ -f $(STAGING_DIR_ROOT)/etc/config/glbcfg.dft ] ; then \
		echo "Generate UPNP configurations from glbcfg.dft";	\
		./upnp_xml_gen.sh $(STAGING_DIR_ROOT)/etc/config/glbcfg.dft;	\
		mv upnpdescstrings.h $(PKG_BUILD_DIR)/. ; \
	fi

endef

MAKE_FLAGS += \
	LIBS="" \
	CC="$(TARGET_CC) -DIPTABLES_143 -lnfnetlink -lip4tc $(if $(CONFIG_IPV6),-lip6tc)" \
	CONFIG_OPTIONS="$(if $(CONFIG_IPV6),--ipv6 --igd2) --leasefile" \
	-f Makefile.linux \
	miniupnpd

define Package/miniupnpd/install
	$(INSTALL_DIR) $(1)/usr/sbin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/miniupnpd $(1)/usr/sbin/miniupnpd
endef

$(eval $(call BuildPackage,miniupnpd))
