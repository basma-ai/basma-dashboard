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
    scrollBehavior () {
        return { x: 0, y: 0 }
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
                component: () => import('./views/AgentPhone.vue')
              },
              {
                path: '/users',
                name: 'users',
                component: () => import('./views/users/Users.vue'),
                meta: {
                  pageTitle: 'Users',
                  breadcrumb: [
                    { title: 'Home', url: '/' },
                    { title: 'Users' },
                    { title: 'List', active: true }
                  ],
                },
                children: [
                  {
                    path: '/edit-user',
                    name: 'edit-user',
                    component: () => import('./views/users/EditUser.vue'),
                    meta: {
                      pageTitle: 'Edit User',
                      breadcrumb: [
                        { title: 'Home', url: '/' },
                        { title: 'User' },
                        { title: 'Edit', active: true }
                      ],
                    },
                  }
                ]
              },
              {
                path: '/services',
                name: 'services',
                component: () => import('./views/Services.vue'),
                meta: {
                  pageTitle: 'Services',
                  breadcrumb: [
                    { title: 'Home', url: '/' },
                    { title: 'Services' },
                    { title: 'List', active: true }
                  ],
                },
              },
              {
                path: '/calls-history',
                name: 'calls-history',
                component: () => import('./views/CallsHistory.vue'),
                meta: {
                  pageTitle: 'Calls History',
                  breadcrumb: [
                    { title: 'Home', url: '/' },
                    { title: 'Calls History' },
                    { title: 'List', active: true }
                  ],
                },
              },
              {
                path: '/branding',
                name: 'branding',
                component: () => import('./views/Branding.vue')
              },
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

export default router
