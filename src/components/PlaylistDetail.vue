<template>
  <div class="playlist-detail">
    <div class="playlist-header">
      <div class="playlist-info">
        <h2>{{ playlist.name }}</h2>
        <p>{{ playlist.songs?.length || 0 }} 首歌曲</p>
      </div>
      <div class="playlist-actions">
        <button @click="playAll" class="play-all-btn">
          <i class="fas fa-play"></i> 播放全部
        </button>
      </div>
    </div>
    <div class="songs-list">
      <div v-for="(song, index) in playlist.songs" :key="song.id" class="song-item">
        <div class="song-number">{{ index + 1 }}</div>
        <div class="song-cover">
          <img :src="song.coverImagePath" :alt="song.title" v-if="song.coverImagePath" />
        </div>
        <div class="song-info">
          <h3>{{ song.title }}</h3>
          <p>{{ song.artist }}</p>
        </div>
        <div class="song-actions">
          <button @click="playSong(song)">
            <i class="fas fa-play"></i>
          </button>
          <button @click="removeFromPlaylist(song)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div v-if="!playlist.songs?.length" class="empty-state">
        <i class="fas fa-music"></i>
        <p>播放列表为空</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

const props = defineProps({
  playlistId: {
    type: [Number, String],
    required: true
  }
});

const emit = defineEmits(['playSong']);

const playlist = ref({ songs: [] });
const loading = ref(false);
const error = ref(null);

const fetchPlaylist = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(API_ENDPOINTS.PLAYLISTS.DETAIL(props.playlistId));
    playlist.value = response.data;
  } catch (err) {
    error.value = '获取播放列表失败，请重试';
    console.error('Error fetching playlist:', err);
  } finally {
    loading.value = false;
  }
};

const playSong = (song) => {
  console.log('Playing song:', song);
  emit('playSong', song);
};

const playAll = () => {
  if (playlist.value.songs?.length) {
    playSong(playlist.value.songs[0]);
  }
};

const removeFromPlaylist = async (song) => {
  if (!confirm(`确定要从播放列表中移除 "${song.title}" 吗？`)) return;

  try {
    await axios.delete(API_ENDPOINTS.PLAYLISTS.REMOVE_SONG(props.playlistId, song.id));
    await fetchPlaylist(); // 刷新播放列表
  } catch (err) {
    console.error('Error removing song from playlist:', err);
    alert('移除歌曲失败，请重试');
  }
};

onMounted(() => {
  fetchPlaylist();
});
</script>

<style scoped>
.playlist-detail {
  padding: 1.5rem;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.playlist-info h2 {
  margin: 0;
  font-size: 1.5rem;
}

.playlist-info p {
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
}

.play-all-btn {
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

.play-all-btn:hover {
  background-color: var(--primary-color-dark);
}

.songs-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: var(--surface-color);
  border-radius: 8px;
  transition: transform 0.2s;
}

.song-item:hover {
  transform: translateY(-2px);
}

.song-number {
  width: 30px;
  text-align: center;
  color: var(--text-secondary);
}

.song-cover {
  width: 50px;
  height: 50px;
  margin: 0 1rem;
  background: linear-gradient(45deg, #2c3e50, #3498db);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.song-info {
  flex: 1;
  margin-left: 0;
}

.song-info h3 {
  margin: 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-info p {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-actions {
  display: flex;
  gap: 1rem;
}

.song-actions button {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.song-actions button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
}
</style> 