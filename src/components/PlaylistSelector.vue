<template>
  <div class="playlist-selector-overlay" v-if="show" @click="closeModal">
    <div class="playlist-selector-modal" @click.stop>
      <div class="modal-header">
        <h3>选择播放列表</h3>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> 加载中...
        </div>
        <div v-else-if="error" class="error">
          <i class="fas fa-exclamation-circle"></i> {{ error }}
          <button class="retry-button" @click="fetchPlaylists">重试</button>
        </div>
        <div v-else-if="playlists.length === 0" class="no-playlists">
          <p>还没有播放列表</p>
          <button class="create-playlist-btn" @click="createNewPlaylist">
            <i class="fas fa-plus"></i> 创建新播放列表
          </button>
        </div>
        <div v-else class="playlists-list">
          <div
            v-for="playlist in playlists"
            :key="playlist.id"
            class="playlist-item"
            @click="selectPlaylist(playlist)"
          >
            <div class="playlist-info">
              <h4>{{ playlist.name }}</h4>
              <p>{{ playlist.songs?.length || 0 }} 首歌曲</p>
            </div>
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="create-playlist-btn" @click="createNewPlaylist">
          <i class="fas fa-plus"></i> 新建播放列表
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

const props = defineProps({
  show: Boolean,
  song: Object,
});

const emit = defineEmits(['close', 'playlistSelected']);

const playlists = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchPlaylists = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(API_ENDPOINTS.PLAYLISTS.LIST);
    playlists.value = response.data;
  } catch (err) {
    error.value = '获取播放列表失败，请重试';
    console.error('Error fetching playlists:', err);
  } finally {
    loading.value = false;
  }
};

const createNewPlaylist = async () => {
  const name = prompt('请输入播放列表名称：');
  if (!name) return;

  loading.value = true;
  error.value = null;
  try {
    const response = await axios.post(API_ENDPOINTS.PLAYLISTS.CREATE, {
      name,
      description: '',
    });
    await fetchPlaylists(); // 刷新播放列表
    // 自动将歌曲添加到新创建的播放列表
    await selectPlaylist(response.data);
  } catch (err) {
    error.value = '创建播放列表失败，请重试';
    console.error('Error creating playlist:', err);
    loading.value = false;
  }
};

const selectPlaylist = async (playlist) => {
  if (loading.value) return;
  
  loading.value = true;
  error.value = null;
  try {
    await axios.post(
      API_ENDPOINTS.PLAYLISTS.ADD_SONG(playlist.id, props.song.id)
    );
    emit('playlistSelected', playlist);
  } catch (err) {
    error.value = '添加歌曲失败，请重试';
    console.error('Error adding song to playlist:', err);
    loading.value = false;
  }
};

const closeModal = () => {
  if (!loading.value) {
    emit('close');
  }
};

onMounted(() => {
  if (props.show) {
    fetchPlaylists();
  }
});
</script>

<style scoped>
.playlist-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.playlist-selector-modal {
  background-color: var(--surface-color, #2c3e50);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: var(--text-primary, #ffffff);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary, rgba(255, 255, 255, 0.7));
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}

.loading, .error, .no-playlists {
  text-align: center;
  padding: 2rem;
  color: var(--text-primary, #ffffff);
}

.error {
  color: var(--error-color, #ff4444);
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color, #42b983);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-playlist-btn {
  padding: 0.5rem 1rem;
  background-color: var(--primary-color, #42b983);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.create-playlist-btn:hover {
  background-color: var(--primary-color-dark, #3aa876);
}

.playlists-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.playlist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--text-primary, #ffffff);
}

.playlist-item:hover {
  background-color: var(--hover-color, rgba(255, 255, 255, 0.1));
}

.playlist-info h4 {
  margin: 0;
  margin-bottom: 0.25rem;
}

.playlist-info p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary, rgba(255, 255, 255, 0.7));
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  display: flex;
  justify-content: center;
}
</style> 