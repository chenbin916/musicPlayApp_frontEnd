const { createApp } = Vue;

createApp({
    data() {
        return {
            currentView: 'library',
            searchQuery: '',
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            volume: 50,
            currentSong: null,
            songs: [
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
            ],
            playlists: [
                {
                    id: 1,
                    name: '我的最爱',
                    songCount: 10
                },
                {
                    id: 2,
                    name: '工作音乐',
                    songCount: 15
                }
            ],
            settings: {
                equalizer: 'default',
                sleepTimer: 0
            }
        }
    },
    computed: {
        filteredSongs() {
            if (!this.searchQuery) return this.songs;
            const query = this.searchQuery.toLowerCase();
            return this.songs.filter(song => 
                song.title.toLowerCase().includes(query) ||
                song.artist.toLowerCase().includes(query)
            );
        },
        progress() {
            if (!this.duration) return 0;
            return (this.currentTime / this.duration) * 100;
        }
    },
    methods: {
        switchView(view) {
            this.currentView = view;
        },
        playSong(song) {
            this.currentSong = song;
            this.isPlaying = true;
            // 这里应该添加实际的音频播放逻辑
        },
        togglePlay() {
            this.isPlaying = !this.isPlaying;
            // 这里应该添加实际的播放/暂停逻辑
        },
        prevSong() {
            if (!this.currentSong) return;
            const currentIndex = this.songs.findIndex(song => song.id === this.currentSong.id);
            const prevIndex = (currentIndex - 1 + this.songs.length) % this.songs.length;
            this.playSong(this.songs[prevIndex]);
        },
        nextSong() {
            if (!this.currentSong) return;
            const currentIndex = this.songs.findIndex(song => song.id === this.currentSong.id);
            const nextIndex = (currentIndex + 1) % this.songs.length;
            this.playSong(this.songs[nextIndex]);
        },
        seek(event) {
            const progressBar = event.currentTarget;
            const clickPosition = event.offsetX;
            const progressBarWidth = progressBar.offsetWidth;
            const seekTime = (clickPosition / progressBarWidth) * this.duration;
            this.currentTime = seekTime;
            // 这里应该添加实际的音频跳转逻辑
        },
        formatTime(seconds) {
            if (!seconds) return '00:00';
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        },
        scanLibrary() {
            // 这里应该添加实际的音乐库扫描逻辑
            alert('开始扫描音乐库...');
        },
        createPlaylist() {
            // 这里应该添加实际的播放列表创建逻辑
            alert('创建新播放列表...');
        },
        showSettings() {
            this.currentView = 'settings';
        }
    },
    mounted() {
        // 模拟音频播放器事件
        setInterval(() => {
            if (this.isPlaying && this.currentTime < this.duration) {
                this.currentTime += 1;
            }
        }, 1000);
    }
}).mount('#app'); 