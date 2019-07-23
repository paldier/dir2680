#
# Openwrt Makefile for arc-bsp-init-board
#

#### Includes ###################################
include $(TOPDIR)/rules.mk
include $(INCLUDE_DIR)/kernel.mk

#### Package Info ###############################
PKG_NAME:=arc-bsp-uart1
PKG_VERSION:=1.0.0
PKG_RELEASE:=1
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
  SECTION:=utils
  CATEGORY:=Arcadyan
  SUBMENU:=Utilities
  TITLE:=Arcadyan BSP UART1 Initialization and Interactive Serial Utility
  MENU:=1
endef

define Package/$(PKG_NAME)/description
	Arcadyan BSP UART1 Initialization and Interactive Serial Utility
endef

define Build/Prepare
	$(call Build/Prepare/Default)
	$(CP) -L ./src/* $(PKG_BUILD_DIR)/
endef

define Package/$(PKG_NAME)/install
	$(CP) -L ./files/* $(1)/
	$(INSTALL_DIR) $(1)/usr/sbin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/arc-iserial $(1)/usr/sbin/
endef

define Build/Clean
	$(call Build/Clean/Default)
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
