#
# Copyright (C) 2006-2010 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=llmnrd-master
PKG_VERSION:=
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME).tar.gz
PKG_SOURCE_URL:=https://github.com/tklauser/llmnrd

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
	SUBMENU:=LLMNR 
	SECTION:=net
	CATEGORY:=Network
	TITLE:=LLMNR, llmnr server
endef

define Package/$(PKG_NAME)/description
llmnrd-master is a llmnr server
endef

define Build/Prepare
	$(call Build/Prepare/Default,)
endef

#define Build/Configure
#	( cd $(PKG_BUILD_DIR) && CC=$(TARGET_CC) ./configure --disable-sound --host=mips-openwrt-linux)
#endef

#TARGET_CFLAGS+=-I$(TOPDIR)/extern/linux/include/
define Build/Compile
	$(MAKE) -C $(PKG_BUILD_DIR) \
		TARGET_ARCH=linux \
		CROSS_COMPILE="$(TARGET_CROSS)" \
		CFLAGS="$(TARGET_CFLAGS)" \
		LDFLAGS="$(TARGET_LDFLAGS)" \
		all
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/sbin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/llmnrd	$(1)/usr/sbin/
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
