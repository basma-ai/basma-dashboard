<template>
  <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
    <span class="cursor-pointer flex items-center i18n-locale">
<!--      <img class="h-4 w-5" :src="i18n_locale_img" :alt="$i18n.locale" />-->
      <span class="hidden sm:block ml-2">{{ getCurrentLocaleData.lang }}</span>
    </span>
    <vs-dropdown-menu class="w-48 i18n-dropdown vx-navbar-dropdown">
      <vs-dropdown-item @click="updateLocale('en')">English</vs-dropdown-item>
      <vs-dropdown-item @click="updateLocale('ar')">French</vs-dropdown-item>
<!--      <vs-dropdown-item @click="updateLocale('de')"><img class="h-4 w-5 mr-1" src="@/assets/images/flags/de.png" alt="de" /> &nbsp;German</vs-dropdown-item>-->
<!--      <vs-dropdown-item @click="updateLocale('pt')"><img class="h-4 w-5 mr-1" src="@/assets/images/flags/pt.png" alt="pt" /> &nbsp;Portuguese</vs-dropdown-item>-->
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>
export default {
  computed: {
    // i18n_locale_img () {
    //   return require(`@/assets/images/flags/${this.$i18n.locale}.png`)
    // },
    getCurrentLocaleData () {
      const locale = this.$i18n.locale
      if (locale === 'en')      return { flag: 'us', lang: 'English'    }
      else if (locale === 'ar') return { flag: 'ar', lang: 'Arabic' }
      // else if (locale === 'fr') return { flag: 'fr', lang: 'French'     }
      // else if (locale === 'de') return { flag: 'de', lang: 'German'     }
    }
  },
  methods: {
    updateLocale (locale) {
      this.$i18n.locale = locale
    }
  }
}
</script>
