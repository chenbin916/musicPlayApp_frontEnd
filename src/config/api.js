// API配置
const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
    // 认证相关
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
    },
    // 歌曲相关
    SONGS: {
        LIST: `${API_BASE_URL}/songs`,
        UPLOAD: `${API_BASE_URL}/songs/upload`,
        DELETE: (id) => `${API_BASE_URL}/songs/${id}`,
    },
    // 播放列表相关
    PLAYLISTS: {
        LIST: `${API_BASE_URL}/playlists`,
        CREATE: `${API_BASE_URL}/playlists`,
        DETAIL: (id) => `${API_BASE_URL}/playlists/${id}`,
        ADD_SONG: (playlistId, songId) => `${API_BASE_URL}/playlists/${playlistId}/songs/${songId}`,
        REMOVE_SONG: (playlistId, songId) => `${API_BASE_URL}/playlists/${playlistId}/songs/${songId}`,
    }
};

export default API_ENDPOINTS; 