<template>
  <div class="audio-player" v-if="currentSong">
    <div class="player-container">
      <div class="song-info">
        <div class="song-cover">
          <img :src="currentSong.coverImagePath" :alt="currentSong.title" v-if="currentSong.coverImagePath" />
        </div>
        <div class="song-details">
          <h3 class="song-title">{{ currentSong.title }}</h3>
          <p class="song-artist">{{ currentSong.artist }}</p>
        </div>
      </div>
      
      <div class="player-controls">
        <div class="progress-section">
          <div class="progress-bar">
            <input
              type="range"
              v-model="currentTime"
              :max="duration"
              @input="seek"
              class="progress"
            />
          </div>
          <div class="time-display">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>
        
        <div class="control-buttons">
          <button class="control-btn" @click="togglePlay">
            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
          </button>
        </div>
      </div>

      <div class="volume-control">
        <button class="volume-btn" @click="toggleMute">
          <i :class="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
        </button>
        <input
          type="range"
          v-model="volume"
          min="0"
          max="100"
          @input="setVolume"
          class="volume-slider"
        />
      </div>
    </div>
    <audio
      ref="audioPlayer"
      :src="audioUrl"
      @timeupdate="updateTime"
      @loadedmetadata="updateDuration"
      @ended="onEnded"
      @error="onError"
      @canplay="onCanPlay"
      preload="auto"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { usePlayerStore } from '@/stores/player';

const playerStore = usePlayerStore();
const audioPlayer = ref(null);
const isPlaying = ref(false);
const isMuted = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const error = ref(null);

const currentSong = computed(() => playerStore.currentSong);

const audioUrl = computed(() => {
  if (!currentSong.value) return '';
  return `http://localhost:8080/api/songs/${currentSong.value.id}/file`;
});

const togglePlay = async () => {
  if (!audioPlayer.value) return;

  try {
    if (isPlaying.value) {
      await audioPlayer.value.pause();
    } else {
      await audioPlayer.value.play();
    }
    isPlaying.value = !isPlaying.value;
  } catch (err) {
    console.error('Error toggling play:', err);
    error.value = err.message;
  }
};

const toggleMute = () => {
  if (!audioPlayer.value) return;
  isMuted.value = !isMuted.value;
  audioPlayer.value.muted = isMuted.value;
};

const setVolume = () => {
  if (!audioPlayer.value) return;
  audioPlayer.value.volume = volume.value;
};

const seek = (event) => {
  if (!audioPlayer.value) return;
  const seekTime = event.target.value;
  console.log('Seeking to:', seekTime);
  audioPlayer.value.currentTime = seekTime;
  currentTime.value = seekTime;
};

const updateTime = () => {
  if (!audioPlayer.value) return;
  currentTime.value = audioPlayer.value.currentTime;
  playerStore.currentTime = currentTime.value;
};

const updateDuration = () => {
  if (!audioPlayer.value) return;
  duration.value = audioPlayer.value.duration;
  playerStore.duration = duration.value;
};

const onEnded = () => {
  isPlaying.value = false;
  playerStore.isPlaying = false;
};

const onError = (event) => {
  console.error('Audio error:', event);
  error.value = '无法播放音频文件';
};

const onCanPlay = () => {
  console.log('Audio can play');
  error.value = null;
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// 监听playerStore中的isPlaying状态
watch(() => playerStore.isPlaying, (newValue) => {
  isPlaying.value = newValue;
});

// 监听playerStore中的currentSong变化
watch(() => playerStore.currentSong, (newSong) => {
  if (newSong && audioPlayer.value) {
    audioPlayer.value.play()
      .then(() => {
        isPlaying.value = true;
        playerStore.isPlaying = true;
      })
      .catch(error => {
        console.error('播放失败:', error);
        isPlaying.value = false;
        playerStore.isPlaying = false;
      });
  }
});

// 监听playerStore中的currentTime变化
watch(() => playerStore.currentTime, (newTime) => {
  if (audioPlayer.value && Math.abs(audioPlayer.value.currentTime - newTime) > 1) {
    audioPlayer.value.currentTime = newTime;
  }
});

// 监听playerStore中的duration变化
watch(() => playerStore.duration, (newDuration) => {
  duration.value = newDuration;
});

// 监听playerStore中的volume变化
watch(() => playerStore.volume, (newVolume) => {
  volume.value = newVolume / 100;
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value;
  }
});
</script>

<style scoped>
.audio-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to right, #2c3e50, #3498db);
  padding: 1rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.player-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.song-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 250px;
}

.song-cover {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-details {
  color: white;
}

.song-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.song-artist {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.player-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.progress-bar {
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;
}

.progress {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: transparent;
  cursor: pointer;
}

.progress::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.progress::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 150px;
}

.volume-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
}

.volume-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .player-container {
    flex-direction: column;
    gap: 1rem;
  }

  .song-info {
    width: 100%;
    justify-content: center;
  }

  .player-controls {
    width: 100%;
  }

  .volume-control {
    width: 100%;
  }
}
</style> 