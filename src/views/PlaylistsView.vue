<template>
  <div class="playlists-view">
    <div class="view-header">
      <h2>播放列表</h2>
      <button @click="createPlaylist">
        <i class="fas fa-plus"></i> 新建播放列表
      </button>
    </div>
    <div v-if="selectedPlaylistId" class="playlist-detail-container">
      <button class="back-button" @click="selectedPlaylistId = null">
        <i class="fas fa-arrow-left"></i> 返回
      </button>
      <PlaylistDetail
        :playlist-id="selectedPlaylistId"
        @play-song="playSong"
      />
    </div>
    <div v-else class="playlists-grid">
      <div
        v-for="playlist in playlists"
        :key="playlist.id"
        class="playlist-item"
        @click="selectPlaylist(playlist.id)"
      >
        <div class="playlist-cover">
          <i class="fas fa-music"></i>
        </div>
        <div class="playlist-info">
          <h3>{{ playlist.name }}</h3>
          <p>{{ playlist.songs?.length || 0 }} 首歌曲</p>
        </div>
      </div>
    </div>
    <AudioPlayer v-if="currentSong" :currentSong="currentSong" @songEnded="onSongEnded" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';
import PlaylistDetail from '@/components/PlaylistDetail.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import { usePlayerStore } from '@/stores/player';

const playlists = ref([]);
const selectedPlaylistId = ref(null);
const playerStore = usePlayerStore();
const currentSong = ref(null);

const fetchPlaylists = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.PLAYLISTS.LIST);
    playlists.value = response.data;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    alert('获取播放列表失败，请重试');
  }
};

const createPlaylist = async () => {
  const name = prompt('请输入播放列表名称：');
  if (!name) return;

  try {
    await axios.post(API_ENDPOINTS.PLAYLISTS.CREATE, {
      name,
      description: '',
    });
    await fetchPlaylists(); // 刷新播放列表
  } catch (error) {
    console.error('Error creating playlist:', error);
    alert('创建播放列表失败，请重试');
  }
};

const selectPlaylist = (playlistId) => {
  selectedPlaylistId.value = playlistId;
};

const playSong = (song) => {
  currentSong.value = song;
  playerStore.playSong(song);
};

const onSongEnded = () => {
  currentSong.value = null;
};

onMounted(() => {
  fetchPlaylists();
});
</script>

<style scoped>
.playlists-view {
  padding: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-header button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-header button:hover {
  background-color: var(--primary-color-dark);
}

.back-button {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-button:hover {
  color: var(--primary-color);
}

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.playlist-item {
  display: flex;
  align-items: center;
  background-color: var(--surface-color);
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.playlist-item:hover {
  transform: translateY(-4px);
}

.playlist-cover {
  width: 60px;
  height: 60px;
  background-color: var(--primary-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.playlist-cover i {
  font-size: 1.5rem;
  color: white;
}

.playlist-info h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.playlist-info p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.playlist-detail-container {
  max-width: 800px;
  margin: 0 auto;
}
</style> 