<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: basma.ai
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div v-if="isLoggedIn" class="layout--main"
       :class="[layoutTypeClass, navbarClasses, footerClasses, {'no-scroll': isAppPage}]">

    <v-nav-menu
      :navMenuItems="navMenuItems"
      title="Vuexy"
      parent=".layout--main"/>

    <div id="content-area" :class="[contentAreaClass, {'show-overlay': bodyOverlay}]">
      <div id="content-overlay"/>

      <!-- Navbar -->
      <template v-if="mainLayoutType === 'horizontal' && windowWidth >= 1200">
        <the-navbar-horizontal
          :navbarType="navbarType"
          :class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]"/>

        <div style="height: 62px" v-if="navbarType === 'static'"></div>

        <h-nav-menu
          :class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]"
          :navMenuItems="navMenuItems"/>
      </template>

      <template v-else>
        <the-navbar-vertical
          :navbarColor="navbarColor"
          :class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]"/>
      </template>
      <!-- /Navbar -->

      <div class="content-wrapper">

        <div class="router-view">
          <div class="router-content">

            <transition :name="routerTransition">

              <div v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
                   class="router-header flex flex-wrap items-center mb-6">
                <div
                  class="content-area__heading"
                  :class="{'pr-4 border-0 md:border-r border-solid border-grey-light' : $route.meta.breadcrumb}">
                  <h2 class="mb-1">{{ routeTitle }}</h2>
                </div>

                <!-- BREADCRUMB -->
                <vx-breadcrumb class="ml-4 md:block hidden" v-if="$route.meta.breadcrumb" :route="$route"
                               :isRTL="$vs.rtl"/>

                <!-- DROPDOWN -->
<!--                <vs-dropdown vs-trigger-click class="ml-auto md:block hidden cursor-pointer">-->
<!--                  <vs-button radius icon="icon-settings" icon-pack="feather" />-->

<!--                  <vs-dropdown-menu class="w-32">-->
<!--                    <vs-dropdown-item>-->
<!--                      <div @click="$router.push('/pages/profile').catch(() => {})" class="flex items-center">-->
<!--                        <feather-icon icon="UserIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />-->
<!--                        <span>Profile</span>-->
<!--                      </div>-->
<!--                    </vs-dropdown-item>-->
<!--                    <vs-dropdown-item>-->
<!--                      <div @click="$router.push('/apps/todo').catch(() => {})" class="flex items-center">-->
<!--                        <feather-icon icon="CheckSquareIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />-->
<!--                        <span>Tasks</span>-->
<!--                      </div>-->
<!--                    </vs-dropdown-item>-->
<!--                    <vs-dropdown-item>-->
<!--                      <div @click="$router.push('/apps/email').catch(() => {})" class="flex items-center">-->
<!--                        <feather-icon icon="MailIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />-->
<!--                        <span>Inbox</span>-->
<!--                      </div>-->
<!--                    </vs-dropdown-item>-->
<!--                  </vs-dropdown-menu>-->

<!--                </vs-dropdown>-->

              </div>
            </transition>

            <div class="content-area__content">

              <back-to-top bottom="5%" :right="$vs.rtl ? 'calc(100% - 2.2rem - 38px)' : '30px'" visibleoffset="500"
                           v-if="!hideScrollToTop">
                <vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg btn-back-to-top"/>
              </back-to-top>

              <transition :name="routerTransition" mode="out-in">
                <router-view @changeRouteTitle="changeRouteTitle"
                             @setAppClasses="(classesStr) => $emit('setAppClasses', classesStr)"/>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <the-footer/>
    </div>
  </div>
</template>


<script>
  import BackToTop from 'vue-backtotop'
  import HNavMenu from "@/layouts/components/horizontal-nav-menu/HorizontalNavMenu.vue"
  // import navMenuItems        from "@/layouts/components/vertical-nav-menu/navMenuItems.js"
  import TheNavbarHorizontal from '@/layouts/components/navbar/TheNavbarHorizontal.vue'
  import TheNavbarVertical from '@/layouts/components/navbar/TheNavbarVertical.vue'
  import TheFooter from '@/layouts/components/TheFooter.vue'
  import themeConfig from '@/../themeConfig.js'
  import VNavMenu from '@/layouts/components/vertical-nav-menu/VerticalNavMenu.vue'

  export default {
    components: {
      BackToTop,
      HNavMenu,
      TheFooter,
      TheNavbarHorizontal,
      TheNavbarVertical,
      VNavMenu
    },
    data() {
      return {
        footerType: themeConfig.footerType || 'static',
        hideScrollToTop: themeConfig.hideScrollToTop,
        isNavbarDark: false,
        navbarColor: themeConfig.navbarColor || '#fff',
        navbarType: themeConfig.navbarType || 'floating',
        navMenuItems: [],
        routerTransition: themeConfig.routerTransition || 'none',
        routeTitle: this.$route.meta.pageTitle,
        isLoggedIn: false,
        permissions: []
      }
    },
    watch: {
      "$route"() {
        this.routeTitle = this.$route.meta.pageTitle
      },
      isThemeDark(val) {
        const color = this.navbarColor == "#fff" && val ? "#10163a" : "#fff"
        this.updateNavbarColor(color)
      },
      "$store.state.mainLayoutType"(val) {
        this.setNavMenuVisibility(val)
      }
    },
    computed: {
      bodyOverlay() {
        return this.$store.state.bodyOverlay
      },
      contentAreaClass() {
        if (this.mainLayoutType === "vertical") {
          if (this.verticalNavMenuWidth == "default") return "content-area-reduced"
          else if (this.verticalNavMenuWidth == "reduced") return "content-area-lg"
          else return "content-area-full"
        }
        // else if(this.mainLayoutType === "boxed") return "content-area-reduced"
        else return "content-area-full"
      },
      footerClasses() {
        return {
          'footer-hidden': this.footerType == 'hidden',
          'footer-sticky': this.footerType == 'sticky',
          'footer-static': this.footerType == 'static',
        }
      },
      isAppPage() {
        return this.$route.meta.no_scroll
      },
      isThemeDark() {
        return this.$store.state.theme == 'dark'
      },
      layoutTypeClass() {
        return `main-${this.mainLayoutType}`
      },
      mainLayoutType() {
        return this.$store.state.mainLayoutType
      },
      navbarClasses() {
        return {
          'navbar-hidden': this.navbarType == 'hidden',
          'navbar-sticky': this.navbarType == 'sticky',
          'navbar-static': this.navbarType == 'static',
          'navbar-floating': this.navbarType == 'floating',
        }
      },
      verticalNavMenuWidth() {
        return this.$store.state.verticalNavMenuWidth
      },
      windowWidth() {
        return this.$store.state.windowWidth
      }
    },
    methods: {
      isAllowed(permission) {
        return this.permissions.indexOf(permission) > -1 || this.permissions.indexOf("superuser") > -1
      },
      getPermissions() {
        let permissions = [];
        let roles = this.$store.state.AppActiveUser.info.roles

        for (const role of roles) {
          let role_permissions = role.permissions.map(permissions => permissions.name);

          for (const permission of role_permissions) {
            if (permissions.indexOf(permission) === -1) {
              permissions.push(permission);
            }
          }
        }

        this.permissions = permissions;
      },
      checkLoginStatus() {
        this.isLoggedIn = "" != this.$store.state.AppActiveUser.token
        console.log("this.isLoggedIn: ",this.isLoggedIn);
        if (!this.isLoggedIn) {
          this.$router.push('/404').catch(() => {
          })
        }
      },
      changeRouteTitle(title) {
        this.routeTitle = title
      },
      updateNavbarColor(val) {
        this.navbarColor = val
        if (val == "#fff") this.isNavbarDark = false
        else this.isNavbarDark = true
      },
      setNavMenuVisibility(layoutType) {
        if ((layoutType === 'horizontal' && this.windowWidth >= 1200) || (layoutType === "vertical" && this.windowWidth < 1200)) {
          this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)
          this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')
        } else {
          this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)
        }
      }
    },
    created() {
      const color = this.navbarColor == "#fff" && this.isThemeDark ? "#10163a" : this.navbarColor
      this.updateNavbarColor(color)
      this.setNavMenuVisibility(this.$store.state.mainLayoutType)

      this.checkLoginStatus();

      if (!this.isLoggedIn){
        return;
      }

      this.getPermissions();

      console.log("permissions:" + this.permissions);

      // setup the menu
      if (this.isAllowed("dashboard")) {
        this.navMenuItems.push({
          url: "/",
          name: "Home",
          slug: "home",
          icon: "HomeIcon"
        });
      }

      if (this.isAllowed("agent_phone")) {
        this.navMenuItems.push({
          url: "/agent-phone",
          name: "Agent Phone",
          slug: "agent-phone",
          icon: "PhoneCallIcon"
        });
      }

      if (this.isAllowed("calls_history")) {
        this.navMenuItems.push({
          url: "/calls-history",
          name: "Calls History",
          slug: "calls-history",
          icon: "ArchiveIcon"
        });
      }

      if (this.isAllowed("reports")) {
        this.navMenuItems.push({
          url: "/reports/calls",
          name: "Reports",
          icon: "FileTextIcon",
          slug: "reports",

          // submenu: [
            // {
            //   url: "/reports/top-services",
            //   name: "Top Services",
            //   slug: "top-services",
            // }
          // ]
        });
      }

      // TODO: need to find better way
      if (this.isAllowed("superuser")) {
        this.navMenuItems.push({
          name: "User Management",
          icon: "UsersIcon",
          submenu: [
            {
              url: "/users",
              name: "Users",
              slug: "users",
            },
            {
              url: "/groups",
              name: "Groups",
              slug: "groups",
            },
            {
              url: "/roles",
              name: "Roles",
              slug: "roles",
            }
          ]
        });
      }

      if (this.isAllowed("services")) {
        this.navMenuItems.push({
          url: "/services",
          name: "Services",
          slug: "services",
          icon: "ListIcon"
        });
      }

      if (this.isAllowed("custom_fields")) {
        this.navMenuItems.push({
          url: "/custom-fields",
          name: "Custom Fields",
          slug: "custom-fields",
          icon: "SquareIcon"
        });
      }

      if (this.isAllowed("audit_logs")) {
        this.navMenuItems.push({
          url: "/audit-logs",
          name: "Audit Logs",
          slug: "audit-logs",
          icon: "ClockIcon"
        });
      }

      if (this.isAllowed("settings")) {
        this.navMenuItems.push({
          url: "/settings",
          name: "Settings",
          slug: "settings",
          icon: "SettingsIcon"
        });
      }

    }
  }

</script>

