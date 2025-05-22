<template>
  <div class="song-upload">
    <div class="upload-container" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="audio/*"
        style="display: none"
      />
      <div class="upload-content">
        <i class="upload-icon">🎵</i>
        <p>点击或拖拽音频文件到这里</p>
        <p class="upload-hint">支持 mp3, wav, ogg 等格式</p>
      </div>
    </div>
    <div v-if="uploading" class="upload-progress">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      <span class="progress-text">{{ progress }}%</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import http from '@/utils/http';
import { API_ENDPOINTS } from '@/config/api';

const fileInput = ref(null);
const uploading = ref(false);
const progress = ref(0);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadFile(file);
  }
};

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('audio/')) {
    uploadFile(file);
  }
};

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    uploading.value = true;
    progress.value = 0;

    const response = await http.post(API_ENDPOINTS.SONGS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      }
    });

    // 上传成功后刷新歌曲列表
    emit('upload-success', response);
  } catch (error) {
    console.error('上传失败:', error);
    alert('上传失败，请重试');
  } finally {
    uploading.value = false;
    progress.value = 0;
  }
};

const emit = defineEmits(['upload-success']);
</script>

<style scoped>
.song-upload {
  padding: 20px;
}

.upload-container {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-container:hover {
  border-color: #42b983;
  background-color: rgba(66, 185, 131, 0.05);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.upload-hint {
  font-size: 12px;
  color: #666;
}

.upload-progress {
  margin-top: 20px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #42b983;
  transition: width 0.3s ease;
}

.progress-text {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}
</style> 