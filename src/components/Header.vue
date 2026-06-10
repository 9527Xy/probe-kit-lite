<template>
  <header class="app-header">
    <RouterLink class="logo" to="/">
      <BrandLogo />
    </RouterLink>
    <nav class="nav">
      <RouterLink to="/report">{{ t('nav.report') }}</RouterLink>
      <RouterLink to="/history">{{ t('nav.history') }}</RouterLink>
      <a href="https://gitee.com/1634874721/probe-kit-lite" target="_blank" rel="noreferrer">{{ t('nav.gitee') }}</a>
      <button class="language-button" type="button" @click="toggleLocale">
        {{ t('nav.language') }}
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import BrandLogo from './BrandLogo.vue'
import { useI18n } from '../composables/useI18n'

const { t, toggleLocale } = useI18n()
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(100% - 32px, var(--container-width));
  min-height: 84px;
  margin: 0 auto;
}

.logo {
  display: inline-flex;
  align-items: center;
  padding: 6px 0;
}

.nav {
  display: flex;
  align-items: center;
  gap: 20px;
  color: var(--color-muted);
  font-size: 15px;
}

.nav a.router-link-active,
.nav a:hover,
.language-button:hover {
  color: var(--color-text);
}

.language-button {
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  font-size: 15px;
}

@media (max-width: 560px) {
  .app-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    padding: 18px 0;
  }

  .nav {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
