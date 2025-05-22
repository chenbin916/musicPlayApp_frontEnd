<template>
  <div class="songs-container">
    <div class="header">
      <h1>歌曲列表</h1>
      <div class="actions">
        <input
          type="file"
          ref="fileInput"
          @change="handleFileUpload"
          accept="audio/*"
          style="display: none"
        />
        <button class="upload-btn" @click="triggerFileInput">
          <i class="fas fa-upload"></i> 上传歌曲
        </button>
      </div>
    </div>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="搜索歌曲..."
        @input="searchSongs"
      />
    </div>
    <div class="songs-grid">
      <div v-for="song in songs" :key="song.id" class="song-card">
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
          <button @click="addToPlaylist(song)">
            <i class="fas fa-plus"></i>
          </button>
          <button @click="deleteSong(song)" class="delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <AudioPlayer v-if="currentSong" :currentSong="currentSong" @songEnded="onSongEnded" />
    <PlaylistSelector
      v-if="showPlaylistSelector"
      :show="showPlaylistSelector"
      :song="selectedSong"
      @close="showPlaylistSelector = false"
      @playlistSelected="handlePlaylistSelected"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AudioPlayer from '@/components/AudioPlayer.vue';
import PlaylistSelector from '@/components/PlaylistSelector.vue';
import { usePlayerStore } from '@/stores/player';
import { ElMessage } from 'element-plus';

const songs = ref([]);
const searchQuery = ref('');
const fileInput = ref(null);
const currentSong = ref(null);
const showPlaylistSelector = ref(false);
const selectedSong = ref(null);
const playerStore = usePlayerStore();

const fetchSongs = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/songs', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    songs.value = response.data;
  } catch (error) {
    console.error('Error fetching songs:', error);
    ElMessage.error('Failed to fetch songs');
  }
};

const searchSongs = async () => {
  if (searchQuery.value.trim() === '') {
    fetchSongs();
    return;
  }
  try {
    const response = await axios.get(`http://localhost:8080/api/songs/search?query=${searchQuery.value}`);
    songs.value = response.data;
  } catch (error) {
    console.error('Error searching songs:', error);
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    await axios.post('http://localhost:8080/api/songs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    fetchSongs(); // 刷新歌曲列表
  } catch (error) {
    console.error('Error uploading song:', error);
    alert('上传失败，请重试');
  }
};

const playSong = (song) => {
  playerStore.playSong(song);
};

const onSongEnded = () => {
  currentSong.value = null;
};

const addToPlaylist = (song) => {
  selectedSong.value = song;
  showPlaylistSelector.value = true;
};

const handlePlaylistSelected = (playlist) => {
  showPlaylistSelector.value = false;
  // 显示成功提示
  alert(`歌曲已成功添加到播放列表"${playlist.name}"`);
};

const deleteSong = async (song) => {
  if (!confirm(`确定要删除歌曲 "${song.title}" 吗？`)) return;

  try {
    await axios.delete(`http://localhost:8080/api/songs/${song.id}`);
    await fetchSongs(); // 刷新歌曲列表
    alert('歌曲删除成功');
  } catch (error) {
    console.error('Error deleting song:', error);
    alert('删除失败，请重试');
  }
};

onMounted(() => {
  fetchSongs();
});
</script>

<style scoped>
.songs-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.upload-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background-color: var(--primary-color-dark);
  transform: translateY(-2px);
}

.search-bar {
  margin-bottom: 2rem;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--text-secondary);
  border-radius: 8px;
  background-color: var(--surface-color);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.song-card {
  background-color: var(--surface-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.song-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.song-cover {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: linear-gradient(45deg, #2c3e50, #3498db);
}

.song-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.song-card:hover .song-cover img {
  transform: scale(1.05);
}

.song-info {
  padding: 1.25rem;
}

.song-info h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-info p {
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-actions {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.05);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.song-actions button {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.song-actions button:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.delete-btn {
  color: #ff4444;
}

.delete-btn:hover {
  background: rgba(255, 68, 68, 0.1);
  color: #ff0000;
}

@media (max-width: 768px) {
  .songs-container {
    padding: 1rem;
  }

  .songs-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}
</style> 