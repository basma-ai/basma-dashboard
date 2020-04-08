/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: basma.ai
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return {x: 0, y: 0}
  },
  routes: [

    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: '/',
          name: 'home',
          component: () => import('./views/Home.vue')
        },
        {
          path: '/agent-phone',
          name: 'agent-phone',
          component: () => import('./views/agent-phone/AgentPhone.vue'),
        },
        {
          path: '/agent-phone/:token',
          name: 'agent-phone-with-token',
          component: () => import('./views/agent-phone/AgentPhone.vue'),
          props: true
        },
        {
          path: '/call-requests',
          name: 'call-requests',
          component: () => import('./views/call-requests/CallRequests.vue'),
          meta: {
            pageTitle: 'Call Requests',
            breadcrumb: [
              {title: 'Home', url: '/'},
              {title: 'Call Requests'},
              {title: 'List', active: true}
            ],
          }
        },
        {
          path: '/calls-history',
          name: 'calls-history',
          component: () => import('./views/calls-history/CallsHistory.vue'),
          meta: {
            pageTitle: 'Calls History',
            breadcrumb: [
              {title: 'Home', url: '/'},
              {title: 'Calls History'},
              {title: 'List', active: true}
            ],
          }
        },
        {
          path: '/calls-history/view-call/:callId',
          name: 'view-call',
          component: () => import('./views/calls-history/ViewCall.vue'),
          meta: {
            pageTitle: 'View Call',
            breadcrumb: [
              {title: 'Home', url: '/'},
              {title: 'Calls History', url: '/calls-history'},
              {title: 'View', active: true}
            ],
          },
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('./views/users/ListUsers.vue'),
          meta: {
            pageTitle: 'Users',
            breadcrumb: [
              {title: 'Home', url: '/'},
              {title: 'Users'},
              {title: 'List', active: true}
            ],
          },
        },
        {
          path: '/services',
          name: 'services',
          component: () => import('./views/services/ListServices.vue'),
          meta: {
            pageTitle: 'Services',
            breadcrumb: [
              {title: 'Home', url: '/'},
              {title: 'Services'},
              {title: 'List', active: true}
            ],
          },
        },
        {
          path: '/groups',
          name: 'groups',
          component: () => import('./views/groups/ListGroups.vue'),
          meta: {
            pageTitle: 'Groups',
            breadcrumb: [
              {title: 'Home', url: '/'},
              {title: 'Groups'},
              {title: 'List', active: true}
            ],
          },
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('./views/vendor-settings/UserSettings.vue'),
          meta: {
            pageTitle: 'Account Settings',
            breadcrumb: [
              {title: 'Home', url: '/'},
              {title: 'Account Settings', active: true}
            ]
          },
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('./views/user-settings/UserSettings.vue'),
          meta: {
            pageTitle: 'My Profile',
            breadcrumb: [
              {title: 'Home', url: '/'},
              {title: 'My Profile'}
            ]
          },
        },
        {
          path: '/custom-fields',
          name: 'custom-fields',
          component: () => import('./views/custom-fields/ListCustomFields.vue'),
          meta: {
            pageTitle: 'Custom Fields',
            breadcrumb: [
              {title: 'Home', url: '/'},
              {title: 'Custom Fields'},
              {title: 'List', active: true}
            ]
          },
        },
        {
          path: '/audit-logs',
          name: 'audit-logs',
          component: () => import('./views/AuditLogs.vue'),
          meta: {
            pageTitle: 'Audit Logs',
            breadcrumb: [
              {title: 'Home', url: '/'},
              {title: 'Audit Logs'},
              {title: 'List', active: true}
            ]
          },
        },
        {
          path: '/billing',
          name: 'billing',
          component: () => import('./views/billing/Billing.vue'),
          meta: {
            pageTitle: 'Billing',
            showChat: false
          },
        },
        {
          path: '/roles',
          name: 'roles',
          component: () => import('./views/roles/ListRoles.vue'),
          meta: {
            pageTitle: 'Roles',
            breadcrumb: [
              {title: 'Home', url: '/'},
              {title: 'Roles'},
              {title: 'List', active: true}
            ]
          },
        },
        {
          path: '/reports/calls',
          name: 'calls',
          component: () => import('./views/reports/Calls.vue')
        },
        // {
        //   path: '/reports/top-services',
        //   name: 'top-services',
        //   component: () => import('./views/reports/Calls.vue')
        // },
      ],
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: '',
      component: () => import('@/layouts/full-page/FullPage.vue'),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: '/:id',
          name: 'page-vendor',
          component: () => import('@/views/pages/Login.vue')
        },
        {
          path: '/:id/login',
          name: 'page-login',
          component: () => import('@/views/pages/Login.vue')
        },
        {
          path: '/404',
          name: 'page-error-404',
          component: () => import('@/views/pages/Error404.vue')
        },
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: '/404'
    }
  ],
})

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = "none";
  }
})

router.afterEach((to) => {
  Vue.prototype.$tidioChatApi &&
  Vue.prototype.$tidioChatApi.display(to.meta.showChat);
});

export default router
