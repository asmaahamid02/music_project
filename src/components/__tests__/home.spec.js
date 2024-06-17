import { shallowMount } from '@vue/test-utils'
import Home from '@/views/HomeView.vue'
import SongItem from '@/components/SongItem.vue'

describe('Home.vue', () => {
  test('Renders list of songs', () => {
    const songs = [{}, {}, {}]

    const wrapper = shallowMount(Home, {
      data() {
        return {
          songs
        }
      },
      //2nd method of importing $t (mocking) -- 1st in the about.spec.js
      global: {
        mocks: {
          $t: (message) => message
        }
      }
    })

    //we don't need to mock the router-link component in the songItem because we are using shallowMount that will limit what children components can do
    const items = wrapper.findAllComponents(SongItem)

    expect(items).toHaveLength(songs.length)

    items.forEach((wrapper, i) => {
      expect(wrapper.props().song).toStrictEqual(songs[i])
    })
  })
})
