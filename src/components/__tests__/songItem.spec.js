import SongItem from '@/components/SongItem.vue'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'

describe('SongItem.vue', () => {
  test('Renders song.display_name', () => {
    const song = {
      display_name: 'test'
    }
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song
      },
      global: {
        components: {
          RouterLink: RouterLinkStub
        }
      }
    })

    const compositionAuthor = wrapper.find('.text-gray-500')

    expect(compositionAuthor.text()).toContain(song.display_name)
  })

  test('Renders song.docID in the id attribute of li', () => {
    const song = {
      docID: 'abc'
    }
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song
      },
      global: {
        components: {
          RouterLink: RouterLinkStub
        }
      }
    })

    //attributes retrieve attributes on the root element of the selection, it will not retrieve the attributes of the children elements
    expect(wrapper.attributes().id).toBe(`song-id-${song.docID}`)
  })

  test('Renders song.docID in the class attribute', () => {
    const song = {
      docID: 'abc'
    }
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song
      },
      global: {
        components: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect(wrapper.classes()).toContain(`song-id-${song.docID}`)
  })
})
