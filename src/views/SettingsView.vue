<template>
  <div class="settings-view">
    <h2>设置</h2>
    <div class="settings-section">
      <h3>音频设置</h3>
      <div class="setting-item">
        <label>均衡器</label>
        <select v-model="settings.equalizer">
          <option value="default">默认</option>
          <option value="rock">摇滚</option>
          <option value="pop">流行</option>
          <option value="classical">古典</option>
        </select>
      </div>
      <div class="setting-item">
        <label>睡眠定时器</label>
        <input type="number" v-model="settings.sleepTimer" min="0" max="120">
        <span>分钟</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const settings = ref({
  equalizer: 'default',
  sleepTimer: 0
})
</script>

<style scoped>
.settings-view {
  padding: 1.5rem;
}

.settings-section {
  background-color: var(--surface-color);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.setting-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.setting-item label {
  width: 120px;
  margin-right: 1rem;
}

.setting-item select,
.setting-item input {
  flex: 1;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: var(--text-primary);
}

.setting-item span {
  margin-left: 0.5rem;
}
</style> 