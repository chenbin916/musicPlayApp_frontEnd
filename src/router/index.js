import { createRouter, createWebHistory } from 'vue-router'
import SongsView from '../views/SongsView.vue'
import PlaylistsView from '../views/PlaylistsView.vue'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/songs'
    },
    {
      path: '/songs',
      name: 'songs',
      component: SongsView
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: PlaylistsView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    }
  ]
})

export default router 