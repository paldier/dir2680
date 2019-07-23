# 
# Copyright (C) 2011 Arcadyan
#
#

include $(TOPDIR)/rules.mk

PKG_NAME:=arcadyan-utility
PKG_REV:=master
PKG_VERSION:=0.5
PKG_RELEASE:=1

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)

# PKG_BUILD_DEPENDS:=opkg/host

MKDIR:=mkdir -p
RM:=rm -rf

include $(INCLUDE_DIR)/package.mk
  
define Package/arcadyan-utility
  SECTION:=base
  CATEGORY:=Base system
  TITLE:=Arcadyan utilities for embedded Linux
  URL:=http://www.arcadyan.com/
  MENU:=1
endef


define Package/arcadyan-utility/description
 The utilities from Arcadyan Corporation for embedded Linux.
 The application of ADSL, VDSL, router, VOIP .etc is its general purpose.
endef

define Package/arcadyan-utility/config
endef

define Build/Configure
endef


define Build/Prepare
	$(INSTALL_DIR) $(PKG_BUILD_DIR)
	$(call Build/Prepare/Default)
	$(CP) ./files/aldk/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/autoupgrade/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/autowandetect/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/base-files/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/cfgview/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/hnap/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/html_docs/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/httpd/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/lib-arc/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/libhttpclt/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/lib-ssl-ap/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/libumng/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/libxml/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/link_state/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/middle-layer/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/pc_list/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/switch_cli/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/syslog/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/time/* $(PKG_BUILD_DIR)/. 
	$(CP) ./files/usbapp/* $(PKG_BUILD_DIR)/. 
endef

define Build/Compile
	$(RM) $(PKG_INSTALL_DIR)
	$(MKDIR) $(PKG_INSTALL_DIR)
endef

define Build/InstallDev
endef

define Package/arcadyan-utility/install
	$(CP) ./files/aldk/* $(1)/ 
	$(CP) ./files/autoupgrade/* $(1)/
	$(CP) ./files/autowandetect/* $(1)/ 
	$(CP) ./files/base-files/* $(1)/ 
	$(CP) ./files/cfgview/* $(1)/ 
	$(CP) ./files/hnap/* $(1)/ 
	$(CP) ./files/html_docs/* $(1)/ 
	$(CP) ./files/httpd/* $(1)/ 
	$(CP) ./files/lib-arc/* $(1)/ 
	$(CP) ./files/libhttpclt/* $(1)/
	$(CP) ./files/lib-ssl-ap/* $(1)/ 
	$(CP) ./files/libumng/* $(1)/ 
	$(CP) ./files/libxml/* $(1)/
	$(CP) ./files/link_state/* $(1)/
	$(CP) ./files/middle-layer/* $(1)/
	$(CP) ./files/pc_list/* $(1)/
	$(CP) ./files/switch_cli/* $(1)/
	$(CP) ./files/syslog/* $(1)/ 
	$(CP) ./files/time/* $(1)/ 
	$(CP) ./files/usbapp/* $(1)/ 
endef

define Build/$(PKG_NAME)/clean
endef

$(eval $(call BuildPackage,arcadyan-utility))
