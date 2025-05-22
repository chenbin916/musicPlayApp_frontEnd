import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const currentSong = ref(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(50)
  const audio = ref(null)
  const songs = ref([
    {
      id: 1,
      title: '示例歌曲 1',
      artist: '艺术家 1',
      cover: 'https://via.placeholder.com/150',
      url: 'path/to/song1.mp3'
    },
    {
      id: 2,
      title: '示例歌曲 2',
      artist: '艺术家 2',
      cover: 'https://via.placeholder.com/150',
      url: 'path/to/song2.mp3'
    }
  ])

  const progress = computed(() => {
    if (!duration.value) return 0
    return (currentTime.value / duration.value) * 100
  })

  function initAudio() {
    if (!audio.value) {
      audio.value = new Audio()
      audio.value.addEventListener('timeupdate', () => {
        currentTime.value = audio.value.currentTime
      })
      audio.value.addEventListener('loadedmetadata', () => {
        duration.value = audio.value.duration
      })
      audio.value.addEventListener('ended', () => {
        isPlaying.value = false
      })
    }
  }

  function playSong(song) {
    console.log('Player store received song:', song);
    currentSong.value = song
    initAudio()
    const audioUrl = `http://localhost:8080/api/songs/${song.id}/file`
    console.log('Audio URL:', audioUrl);
    audio.value.src = audioUrl
    const volumeLevel = volume.value / 100
    console.log('Setting volume to:', volumeLevel);
    audio.value.volume = volumeLevel
    audio.value.play()
      .then(() => {
        console.log('Playback started successfully');
        console.log('Current audio state:', {
          volume: audio.value.volume,
          muted: audio.value.muted,
          paused: audio.value.paused
        });
        isPlaying.value = true
      })
      .catch(error => {
        console.error('播放失败:', error)
      })
  }

  function togglePlay() {
    if (!audio.value) return
    if (isPlaying.value) {
      audio.value.pause()
    } else {
      audio.value.play()
    }
    isPlaying.value = !isPlaying.value
  }

  function prevSong() {
    if (!currentSong.value) return
    const currentIndex = songs.value.findIndex(song => song.id === currentSong.value.id)
    const prevIndex = (currentIndex - 1 + songs.value.length) % songs.value.length
    playSong(songs.value[prevIndex])
  }

  function nextSong() {
    if (!currentSong.value) return
    const currentIndex = songs.value.findIndex(song => song.id === currentSong.value.id)
    const nextIndex = (currentIndex + 1) % songs.value.length
    playSong(songs.value[nextIndex])
  }

  function seek(time) {
    if (!audio.value) return
    audio.value.currentTime = time
    currentTime.value = time
  }

  function setVolume(value) {
    volume.value = value
    if (audio.value) {
      audio.value.volume = value / 100
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    songs,
    progress,
    playSong,
    togglePlay,
    prevSong,
    nextSong,
    seek,
    setVolume,
    formatTime
  }
}) 