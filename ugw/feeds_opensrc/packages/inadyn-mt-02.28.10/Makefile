#
# Copyright (C) 2006-2010 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=inadyn-mt
PKG_VERSION:=02.28.10
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=http://sourceforge.net/projects/inadyn-mt

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
	SUBMENU:=DDNS 
	SECTION:=net
	CATEGORY:=Network
	TITLE:=INADYN, dynamic DNS client
	DEPENDS+= libpthread
endef

define Package/$(PKG_NAME)/description
INADYN is a dynamic DNS client
endef

define Build/Prepare
	$(call Build/Prepare/Default,)
endef

define Build/Configure
	( cd $(PKG_BUILD_DIR) && CC=$(TARGET_CC) ./configure --disable-sound --host=mips-openwrt-linux)
endef

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
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/src/inadyn-mt	$(1)/usr/sbin/
	ln -sf /usr/sbin/inadyn-mt $(1)/usr/sbin/inadyn-mt_ipv6
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
