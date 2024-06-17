import About from '@/views/AboutView.vue'
import { shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '@/locals/en.json'
import ar from '@/locals/ar.json'

describe('AboutView.vue', () => {
  test('renders inner text', () => {
    //1st method of importing $t (include the plugin) -- 2nd in home.spec.js
    const i18n = createI18n({
      locale: 'en',
      messages: {
        en,
        ar
      }
    })

    const wrapper = shallowMount(About, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('about')
  })
})
