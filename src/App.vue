<template>
  <div class="app">
    <div class="menu-toggle" @click="toggleMenu">
      <i class="fas" :class="isMenuOpen ? 'fa-times' : 'fa-bars'"></i>
    </div>
    <nav class="sidebar" :class="{ 'menu-open': isMenuOpen }">
      <ul class="nav-links">
        <li>
          <router-link to="/songs" class="nav-link">
            <i class="fas fa-music"></i>
          </router-link>
        </li>
        <li>
          <router-link to="/playlists" class="nav-link">
            <i class="fas fa-list"></i>
          </router-link>
        </li>
        <li>
          <router-link to="/settings" class="nav-link">
            <i class="fas fa-cog"></i>
          </router-link>
        </li>
      </ul>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  overflow-x: hidden;
}

.app {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.menu-toggle {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1001;
  background-color: #2c3e50;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.menu-toggle i {
  font-size: 16px;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: #2c3e50;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.sidebar.menu-open {
  transform: translateX(0);
}

.nav-links {
  list-style: none;
  width: 40px;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #ecf0f1;
  text-decoration: none;
  transition: background-color 0.3s;
}

.nav-link i {
  font-size: 16px;
}

.nav-link:hover {
  background-color: #34495e;
}

.nav-link.router-link-active {
  background-color: #42b983;
}

.main-content {
  flex: 1;
  padding: 20px;
  padding-top: 50px;
  background-color: #f5f5f5;
  width: 100%;
  overflow-x: hidden;
}

/* 媒体查询 - 平板和桌面设备 */
@media screen and (min-width: 768px) {
  .menu-toggle {
    display: none;
  }

  .sidebar {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 40px;
    width: calc(100% - 40px);
    padding-top: 20px;
  }
}
</style> 