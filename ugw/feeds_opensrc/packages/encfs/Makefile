include $(TOPDIR)/rules.mk

PKG_NAME:=encfs
PKG_VERSION:=1.9.1
PKG_RELEASE:=1

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/vgough/encfs.git
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_VERSION:=559c30d01ed0a3d19258b12f15eae8785accc60f
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION).tar.gz

#PKG_BUILD_PARALLEL:=1
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)

include $(INCLUDE_DIR)/package.mk
include $(INCLUDE_DIR)/cmake.mk
define Package/encfs
  SECTION:=utils
  CATEGORY:=Utilities
  SUBMENU:=Filesystem
  TITLE:=EncFS provides an encrypted filesystem in user-space.
  URL:=https://vgough.github.io/encfs/
  DEPENDS+= libopenssl libfuse libintl-full libpthread libssl libstdcpp
endef

#define Package/encfs/description
# EncFS provides an encrypted filesystem in user-space.
#endef

TARGET_CFLAGS += \
	-I$(STAGING_DIR)/usr/lib/libintl-full/include \
	-I$(STAGING_DIR)/usr/include

TARGET_LDFLAGS += \
	-lintl \
	-L$(STAGING_DIR)/usr/lib/libintl-full/lib

CMAKE_OPTIONS += \
	-DDEBUG=1

MAKE_FLAGS+=VERBOSE=1

define Build/Prepare
	$(call Build/Prepare/Default)
	mv $(PKG_BUILD_DIR) $(PKG_BUILD_DIR)-src
	mkdir -p $(PKG_BUILD_DIR)
	mv $(PKG_BUILD_DIR)-src $(PKG_BUILD_DIR)/src
endef


define Build/Configure
	(cd $(PKG_BUILD_DIR); \
		CFLAGS="$(TARGET_CFLAGS) $(EXTRA_CFLAGS)" \
		CXXFLAGS="$(TARGET_CFLAGS) $(EXTRA_CFLAGS)" \
		LDFLAGS="$(TARGET_LDFLAGS) $(EXTRA_LDFLAGS)" \
		cmake \
			-DCMAKE_SYSTEM_NAME=Linux \
			-DCMAKE_SYSTEM_VERSION=1 \
			-DCMAKE_SYSTEM_PROCESSOR=$(ARCH) \
			-DCMAKE_BUILD_TYPE=Release \
			-DCMAKE_C_FLAGS_RELEASE="-DNDEBUG" \
			-DCMAKE_CXX_FLAGS_RELEASE="-DNDEBUG" \
			-DCMAKE_C_COMPILER="$(CMAKE_C_COMPILER)" \
			-DCMAKE_C_COMPILER_ARG1="$(CMAKE_C_COMPILER_ARG1)" \
			-DCMAKE_CXX_COMPILER="$(CMAKE_CXX_COMPILER)" \
			-DCMAKE_CXX_COMPILER_ARG1="$(CMAKE_CXX_COMPILER_ARG1)" \
			-DCMAKE_EXE_LINKER_FLAGS:STRING="$(TARGET_LDFLAGS)" \
			-DCMAKE_MODULE_LINKER_FLAGS:STRING="$(TARGET_LDFLAGS)" \
			-DCMAKE_SHARED_LINKER_FLAGS:STRING="$(TARGET_LDFLAGS)" \
			-DCMAKE_FIND_ROOT_PATH=$(STAGING_DIR) \
			-DCMAKE_FIND_ROOT_PATH_MODE_PROGRAM=BOTH \
			-DCMAKE_FIND_ROOT_PATH_MODE_LIBRARY=ONLY \
			-DCMAKE_FIND_ROOT_PATH_MODE_INCLUDE=ONLY \
			-DCMAKE_STRIP=: \
			-DCMAKE_INSTALL_PREFIX=/usr \
			-DDL_LIBRARY=$(STAGING_DIR) \
                        -DCMAKE_PREFIX_PATH=$(STAGING_DIR) \
			$(CMAKE_OPTIONS) \
		src \
	)
endef

define Package/encfs/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(CP) $(PKG_INSTALL_DIR)/usr/bin/encfs* $(1)/usr/bin
endef

$(eval $(call BuildPackage,encfs))

