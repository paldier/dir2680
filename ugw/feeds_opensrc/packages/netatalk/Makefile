#
# Copyright (C) 2009-2012 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=netatalk
PKG_VERSION:=3.0.1
PKG_RELEASE:=0

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.bz2
PKG_SOURCE_URL:=@SF/netatalk
PKG_MD5SUM:=b4f5c932b2ca99f5292bd6b6d69b3ebc

PKG_BUILD_PARALLEL:=1
PKG_INSTALL:=1
PKG_FIXUP:=autoreconf

include $(INCLUDE_DIR)/package.mk

define Package/netatalk
  SECTION:=net
  CATEGORY:=Network
  SUBMENU:=Filesystem
  DEPENDS:=+libdb47 +libgcrypt +libopenssl +avahi-daemon +libavahi-client $(LIBRPC_DEPENDS)
  TITLE:=netatalk
  URL:=http://netatalk.sourceforge.net
  MAINTAINER:=W. Michael Petullo <mike@flyn.org>
endef

define Package/netatalk/decription
  Netatalk is a freely-available Open Source AFP fileserver.
  It also provides a kernel level implementation of the AppleTalk
  Protocol Suite.
endef

define Package/netatalk/conffiles
/etc/afp.conf
endef

TARGET_CFLAGS += -std=gnu99 -Wl,-rpath-link=$(STAGING_DIR)/usr/lib
TARGET_LDFLAGS += $(LIBRPC)

CONFIGURE_ARGS += \
	--disable-afs \
	--enable-hfs \
	--disable-debugging \
	--disable-shell-check \
	--disable-timelord \
	--disable-a2boot \
	--enable-zeroconf \
	--disable-cups \
	--disable-tcp-wrappers \
	--with-cnid-default-backend=dbd \
	--with-bdb="$(STAGING_DIR)/usr/" \
	--with-libgcrypt-dir="$(STAGING_DIR)/usr" \
	--with-ssl-dir="$(STAGING_DIR)/usr" \
	--with-uams-path="/usr/lib/uams" \
	--disable-admin-group \
	--disable-srvloc \
	--without-shadow \
	--without-ldap \
	--without-kerberos

define Package/netatalk/install
	$(INSTALL_DIR) $(1)/usr/bin
		$(CP) $(PKG_INSTALL_DIR)/usr/bin/ad $(1)/usr/bin/
		$(CP) $(PKG_INSTALL_DIR)/usr/bin/afppasswd $(1)/usr/bin/
		$(CP) $(PKG_INSTALL_DIR)/usr/bin/apple_dump $(1)/usr/bin/
		$(CP) $(PKG_INSTALL_DIR)/usr/bin/cnid2_create $(1)/usr/bin/
		$(CP) $(PKG_INSTALL_DIR)/usr/bin/dbd $(1)/usr/bin/

	$(INSTALL_DIR) $(1)/usr/lib
		$(CP) $(PKG_INSTALL_DIR)/usr/lib/lib* $(1)/usr/lib/

	$(INSTALL_DIR) $(1)/usr/lib/uams
		$(CP) $(PKG_INSTALL_DIR)/usr/lib/uams/*.so $(1)/usr/lib/uams/

	$(INSTALL_DIR) $(1)/usr/sbin
		$(CP) $(PKG_INSTALL_DIR)/usr/sbin/* $(1)/usr/sbin/
	
	$(INSTALL_DIR) $(1)/etc/
		$(INSTALL_CONF) ./files/afp.conf $(1)/etc/
		$(INSTALL_CONF) ./files/AppleVolumes.default $(1)/etc/

	$(INSTALL_DIR) $(1)/etc/init.d
		$(INSTALL_BIN) ./files/afpd.init $(1)/etc/init.d/netatalk
		$(INSTALL_BIN) ./files/appletalk $(1)/etc/init.d/appletalk


endef

$(eval $(call BuildPackage,netatalk))
