<template>
  <form class="config-panel" @submit.prevent="submit">
    <div class="field">
      <label for="api-url">{{ t('config.apiUrl') }}</label>
      <input
        id="api-url"
        v-model="form.apiUrl"
        autocomplete="off"
        :placeholder="t('config.apiUrlPlaceholder')"
        required
      />
      <label class="checkbox-field">
        <input v-model="form.appendChatCompletions" type="checkbox" />
        <span>{{ t('config.appendChat') }}</span>
      </label>
      <label v-if="isDev" class="checkbox-field">
        <input v-model="form.useDevProxy" type="checkbox" />
        <span>{{ t('config.devProxy') }}</span>
      </label>
      <p class="field-hint">
        {{ t('config.urlHint') }}
      </p>
    </div>

    <div class="field">
      <label for="api-key">{{ t('config.apiKey') }}</label>
      <input
        id="api-key"
        v-model="form.apiKey"
        autocomplete="off"
        placeholder="sk-..."
        required
        type="password"
      />
    </div>

    <div class="field">
      <label for="model">{{ t('config.model') }}</label>
      <div class="model-combobox" @focusout="closeModelList">
        <input
          id="model"
          v-model="modelQuery"
          aria-autocomplete="list"
          aria-controls="model-options"
          :aria-expanded="isModelListOpen"
          autocomplete="off"
          :placeholder="t('config.modelPlaceholder')"
          required
          role="combobox"
          @focus="openModelList"
          @input="openModelList"
        />
        <button class="model-toggle" type="button" aria-label="Toggle model list" @click="toggleModelList">
          ▾
        </button>

        <div v-if="isModelListOpen" id="model-options" class="model-options" role="listbox">
          <template v-if="filteredModelGroups.length">
            <div v-for="group in filteredModelGroups" :key="group.provider" class="model-group">
              <div class="model-group__label">{{ group.provider }}</div>
              <button
                v-for="model in group.models"
                :key="model.value"
                class="model-option"
                :class="{ 'model-option--active': model.value === form.model }"
                type="button"
                role="option"
                :aria-selected="model.value === form.model"
                @mousedown.prevent="selectModel(model)"
              >
                <span>{{ model.label }}</span>
                <small>{{ model.value }}</small>
              </button>
            </div>
          </template>
          <div v-else class="model-empty">{{ t('config.noModels') }}</div>
        </div>
      </div>
    </div>

    <button class="primary-button" :disabled="isRunning" type="submit">
      {{ isRunning ? t('config.running') : t('config.start') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import { useI18n } from '../composables/useI18n'
import type { ProbeConfig } from '../types/probe'

const props = defineProps<{
  config: ProbeConfig
  isRunning: boolean
}>()

const emit = defineEmits<{
  submit: [config: ProbeConfig]
}>()

const { t } = useI18n()
const isDev = import.meta.env.DEV

const form = reactive<ProbeConfig>({
  apiUrl: props.config.apiUrl,
  apiKey: props.config.apiKey,
  model: props.config.model,
  appendChatCompletions: props.config.appendChatCompletions,
  useDevProxy: props.config.useDevProxy,
})

const modelQuery = ref('')
const isModelListOpen = ref(false)

const modelOptions = [
  { provider: 'OpenAI GPT', label: 'GPT-5.5', value: 'gpt-5.5' },
  { provider: 'OpenAI GPT', label: 'GPT-5.4', value: 'gpt-5.4' },
  { provider: 'OpenAI GPT', label: 'GPT-5.4 Mini', value: 'gpt-5.4-mini' },
  { provider: 'OpenAI GPT', label: 'GPT-5.4 Nano', value: 'gpt-5.4-nano' },
  { provider: 'OpenAI GPT', label: 'GPT-4.1', value: 'gpt-4.1' },
  { provider: 'OpenAI GPT', label: 'GPT-4.1 Mini', value: 'gpt-4.1-mini' },
  { provider: 'OpenAI GPT', label: 'GPT-4.1 Nano', value: 'gpt-4.1-nano' },
  { provider: 'OpenAI GPT', label: 'GPT-4o', value: 'gpt-4o' },
  { provider: 'OpenAI GPT', label: 'GPT-4o Mini', value: 'gpt-4o-mini' },
  { provider: 'OpenAI Reasoning', label: 'o3', value: 'o3' },
  { provider: 'OpenAI Reasoning', label: 'o4 Mini', value: 'o4-mini' },
  { provider: 'Anthropic Claude', label: 'Claude Opus 4.8', value: 'claude-opus-4-8' },
  { provider: 'Anthropic Claude', label: 'Claude Sonnet 4.6', value: 'claude-sonnet-4-6' },
  { provider: 'Anthropic Claude', label: 'Claude Haiku 4.5', value: 'claude-haiku-4-5-20251001' },
  { provider: 'DeepSeek', label: 'DeepSeek V4 Pro', value: 'deepseek-v4-pro' },
  { provider: 'DeepSeek', label: 'DeepSeek V4 Flash', value: 'deepseek-v4-flash' },
  { provider: 'DeepSeek', label: 'DeepSeek Chat Legacy', value: 'deepseek-chat' },
  { provider: 'DeepSeek', label: 'DeepSeek Reasoner Legacy', value: 'deepseek-reasoner' },
  { provider: 'Xiaomi MiMo', label: 'MiMo V2.5 Pro', value: 'mimo-v2.5-pro' },
  { provider: 'Xiaomi MiMo', label: 'MiMo V2.5', value: 'mimo-v2.5' },
  { provider: 'Xiaomi MiMo', label: 'MiMo V2 Pro', value: 'mimo-v2-pro' },
  { provider: 'Xiaomi MiMo', label: 'MiMo V2 Flash', value: 'mimo-v2-flash' },
  { provider: 'Xiaomi MiMo', label: 'MiMo V2 Omni', value: 'mimo-v2-omni' },
  { provider: 'Xiaomi MiMo', label: 'OpenRouter MiMo V2.5 Pro', value: 'xiaomi/mimo-v2.5-pro' },
  { provider: 'Xiaomi MiMo', label: 'OpenRouter MiMo V2 Pro', value: 'xiaomi/mimo-v2-pro' },
  { provider: 'Google Gemini', label: 'Gemini 3.1 Pro Preview', value: 'gemini-3.1-pro-preview' },
  { provider: 'Google Gemini', label: 'Gemini 3 Flash Preview', value: 'gemini-3-flash-preview' },
  { provider: 'Google Gemini', label: 'Gemini 3.1 Flash Lite', value: 'gemini-3.1-flash-lite' },
  { provider: 'Google Gemini', label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
  { provider: 'Google Gemini', label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
  { provider: 'Google Gemini', label: 'Gemini 2.5 Flash Lite', value: 'gemini-2.5-flash-lite' },
  { provider: 'Google Gemini', label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
  { provider: 'Google Gemini', label: 'Gemini 2.0 Flash Lite', value: 'gemini-2.0-flash-lite' },
  { provider: 'Alibaba Qwen', label: 'Qwen Max', value: 'qwen-max' },
  { provider: 'Alibaba Qwen', label: 'Qwen Plus', value: 'qwen-plus' },
  { provider: 'Alibaba Qwen', label: 'Qwen Turbo', value: 'qwen-turbo' },
]

const filteredModelGroups = computed(() => {
  const selected = selectedModel.value
  const queryMatchesSelected =
    selected &&
    (modelQuery.value === selected.label || modelQuery.value === selected.value || modelQuery.value === '')
  const keyword = queryMatchesSelected ? '' : modelQuery.value.trim().toLowerCase()
  const matchedModels = keyword
    ? modelOptions.filter((model) =>
        `${model.provider} ${model.label} ${model.value}`.toLowerCase().includes(keyword),
      )
    : modelOptions
  const providers = [...new Set(matchedModels.map((model) => model.provider))]

  return providers.map((provider) => ({
    provider,
    models: matchedModels.filter((model) => model.provider === provider),
  }))
})

const selectedModel = computed(() => modelOptions.find((model) => model.value === form.model))

watch(selectedModel, (model) => {
  modelQuery.value = model?.label ?? form.model
})

watch(
  () => props.config,
  (config) => {
    form.apiUrl = config.apiUrl
    form.apiKey = config.apiKey
    form.model = config.model
    form.appendChatCompletions = config.appendChatCompletions
    form.useDevProxy = config.useDevProxy
    modelQuery.value = selectedModel.value?.label ?? config.model
  },
  { deep: true },
)

function submit() {
  const exactModel = modelOptions.find(
    (model) =>
      model.value.toLowerCase() === modelQuery.value.trim().toLowerCase() ||
      model.label.toLowerCase() === modelQuery.value.trim().toLowerCase(),
  )

  if (exactModel) {
    form.model = exactModel.value
  } else if (modelQuery.value.trim()) {
    form.model = modelQuery.value.trim()
  }

  emit('submit', { ...form, useDevProxy: isDev ? form.useDevProxy : false })
}

function openModelList() {
  isModelListOpen.value = true
}

function toggleModelList() {
  isModelListOpen.value = !isModelListOpen.value
}

function closeModelList() {
  window.setTimeout(() => {
    isModelListOpen.value = false
    modelQuery.value = selectedModel.value?.label ?? form.model
  }, 120)
}

function selectModel(model: (typeof modelOptions)[number]) {
  form.model = model.value
  modelQuery.value = model.label
  isModelListOpen.value = false
}
</script>

<style scoped>
.config-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field:first-child {
  grid-column: 1 / -1;
}

label {
  color: var(--color-muted);
  font-size: 13px;
  font-weight: 600;
}

input {
  width: 100%;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  outline: none;
  color: var(--color-text);
  background: var(--color-background);
}

input[type='checkbox'] {
  width: 14px;
  min-height: 14px;
  padding: 0;
  accent-color: var(--color-text);
}

.checkbox-field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  color: var(--color-text);
  font-size: 13px;
  font-weight: 600;
}

.field-hint {
  margin: 0;
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1.5;
}

input:focus {
  border-color: var(--color-text);
}

.model-combobox {
  position: relative;
}

.model-combobox input {
  padding-right: 40px;
}

.model-toggle {
  position: absolute;
  top: 1px;
  right: 1px;
  width: 38px;
  height: 40px;
  border: 0;
  border-left: 1px solid var(--color-border);
  border-radius: 0 var(--radius) var(--radius) 0;
  color: var(--color-muted);
  background: transparent;
}

.model-options {
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 300px;
  overflow: auto;
  padding: 6px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.model-group + .model-group {
  margin-top: 8px;
}

.model-group__label {
  padding: 8px 8px 4px;
  color: var(--color-muted);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.model-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  min-height: 38px;
  padding: 8px;
  border: 0;
  border-radius: 6px;
  color: var(--color-text);
  background: transparent;
  text-align: left;
}

.model-option:hover,
.model-option--active {
  background: var(--color-background);
}

.model-option small {
  color: var(--color-muted);
  font-size: 11px;
}

.model-empty {
  padding: 12px;
  color: var(--color-muted);
  font-size: 13px;
}

.primary-button {
  align-self: end;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid var(--color-text);
  border-radius: var(--radius);
  color: var(--color-surface);
  background: var(--color-text);
  font-weight: 650;
}

.primary-button:disabled {
  border-color: var(--color-border);
  color: var(--color-muted);
  background: var(--color-border);
}

@media (max-width: 720px) {
  .config-panel {
    grid-template-columns: 1fr;
  }
}
</style>
