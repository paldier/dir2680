# 
# Copyright (C) 2018 Arcadyan
#
# 2018/02/06 If you find any bugs or get any new ideas, please don't hesitate to contact me.
#
# Email : vip.zhijian@gmail.com
#

include $(TOPDIR)/rules.mk

PKG_NAME:=trousers
PKG_VERSION:=0.3.14
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://downloads.sourceforge.net/project/trousers/trousers/$(PKG_VERSION)/
PKG_MD5SUM:=4a476b4f036dd20a764fb54fc24edbec

PKG_BUILD_DIR:=$(BUILD_DIR)/$(BUILD_VARIANT)/$(PKG_NAME)-$(PKG_VERSION)

PKG_INSTALL:=1
PKG_BUILD_PARALLEL:=1

MKDIR:=mkdir -p
RM:=rm -rf

include $(INCLUDE_DIR)/package.mk

ifeq ($(__target_inc),)
  include $(INCLUDE_DIR)/target.mk
endif

define Package/$(PKG_NAME)
  SECTION:=libs
  CATEGORY:=Libraries
  TITLE:=Trousers api for TPM device
  URL:=http://sourceforge.net/projects/trousers/files/
  DEPENDS:= +libiconv
  VARIANT:=$(PKG_NAME)
endef

define Package/$(PKG_NAME)/description
 This library provides trousers api for users to make use of TPM devices conveniently.
endef

define Package/$(PKG_NAME)/Config
endef

define Build/Configure
	$(call Build/Configure/Default)
endef

define Build/Prepare
	#$(call Build/Prepare/Default)
	$(RM) $(PKG_BUILD_DIR)
	$(MKDIR) $(PKG_BUILD_DIR)
	tar xzf $(DL_DIR)/$(PKG_SOURCE) -C $(PKG_BUILD_DIR)
endef

define Build/Compile
	$(call Build/Compile/Default)
endef


define Build/InstallDev
	$(INSTALL_DIR) $(1)/usr/include $(1)/usr/lib
	$(CP) $(PKG_INSTALL_DIR)/usr/include/* $(1)/usr/include/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/lib*.* $(1)/usr/lib/
	#mkdir -p $(1)/usr/lib/pkgconfig
	#$(CP)	$(PKG_INSTALL_DIR)/usr/lib/pkgconfig/*.pc $(1)/usr/lib/pkgconfig/
endef

define Package/$(PKG_NAME)/install
        $(call Build/Install/Default)
	$(CP) $(PKG_INSTALL_DIR)/* $(1)/
endef

define Build/$(PKG_NAME)/clean
        $(call Build/Clean/Default)
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
