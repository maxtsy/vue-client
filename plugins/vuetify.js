import Vue from 'vue'
import Vuetify, { VApp, VAppBar, VNavigationDrawer, VFooter, 
                  VContainer, VContent, VMenu, VCard, 
                  VForm, VRow, VCol, VIcon, 
                  VBtn, VTextField, VSelect, VList, 
                  VListItem, VListItemContent, VListItemAction, VListItemTitle, 
                  VDatePicker, VSpacer, VImg, VExpansionPanels,
                  VExpansionPanel, VExpansionPanelHeader, VExpansionPanelContent,
                  VSwitch } from 'vuetify/lib'

//import '@/../../Content/variables.scss'

//import ru from '../i18n/vuetify/ru'

Vue.use(Vuetify, {
  components: { VApp, VAppBar, VNavigationDrawer, VFooter, 
                VContainer, 
                VContent, VMenu, VCard, VForm, 
                VRow, VCol, VIcon, VBtn, 
                VTextField, VSelect, VList, VListItem, 
                VListItemContent, VListItemAction, VListItemTitle, VDatePicker, 
                VSpacer, VImg, VExpansionPanels, VExpansionPanel, 
                VExpansionPanelHeader, VExpansionPanelContent, VSwitch },
})

const opts = {
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#1a7555',
        secondary: '#607D8B',
        accent: '#145C43',
        error: '#F44336',
        info: '#2196F3',
        success: '#30DB9F',
        warning: '#FFC107',
      },
    },
  },
  
  icons: {
    iconfont: 'md', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },

  /* lang: {
    current: 'ru',
    locales: { ru }
  }, */
}

export default new Vuetify(opts)