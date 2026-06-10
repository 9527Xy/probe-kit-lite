<template>
  <div class="brand-logo" :class="`brand-logo--${size}`" aria-label="ProbeKit Lite">
    <svg class="brand-logo__mark" viewBox="0 0 48 48" aria-hidden="true" role="img">
      <path class="mark-ring" d="M24 7C33.4 7 41 14.6 41 24S33.4 41 24 41 7 33.4 7 24 14.6 7 24 7Z" />
      <path class="mark-link" d="M16 19H28L22 31" />
      <circle class="mark-node" cx="16" cy="19" r="2.5" />
      <circle class="mark-node" cx="28" cy="19" r="2.5" />
      <circle class="mark-node" cx="22" cy="31" r="2.5" />
      <path class="mark-probe" d="M30 30L38 38" />
      <circle class="mark-tip" cx="38" cy="38" r="2" />
    </svg>
    <span class="brand-logo__text">ProbeKit Lite</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'small' | 'large'
  }>(),
  {
    size: 'small',
  },
)
</script>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text);
}

.brand-logo__mark {
  flex: 0 0 auto;
}

.brand-logo--small .brand-logo__mark {
  width: 26px;
  height: 26px;
}

.brand-logo--large .brand-logo__mark {
  width: 44px;
  height: 44px;
}

.brand-logo__text {
  font-weight: 750;
  letter-spacing: 0;
}

.brand-logo--small .brand-logo__text {
  font-size: 20px;
  line-height: 1;
}

.brand-logo--large {
  align-items: flex-start;
  gap: 14px;
}

.brand-logo--large .brand-logo__text {
  font-size: clamp(48px, 7vw, 78px);
  line-height: 0.98;
}

.mark-ring {
  fill: none;
  stroke: var(--color-border);
  stroke-width: 2;
}

.mark-link {
  fill: none;
  stroke: var(--color-text);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.4;
}

.mark-node {
  fill: var(--color-text);
}

.mark-probe {
  stroke: var(--color-text);
  stroke-linecap: round;
  stroke-width: 2.4;
}

.mark-tip {
  fill: var(--color-success);
  stroke: var(--color-surface);
  stroke-width: 1;
}
</style>
