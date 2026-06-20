<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'

import ApiPanel from './components/ApiPanel.vue'
import StatusBadge from './components/StatusBadge.vue'
import {
  api,
  type CreateItemPayload,
  type HealthResponse,
  type Item,
  type ItemsResponse,
  type MetaResponse,
} from './lib/api'

interface QueryState<T> {
  loading: boolean
  data: T | null
  error: string
}

const healthState = reactive<QueryState<HealthResponse>>({
  loading: true,
  data: null,
  error: '',
})

const metaState = reactive<QueryState<MetaResponse>>({
  loading: true,
  data: null,
  error: '',
})

const itemsState = reactive<QueryState<ItemsResponse>>({
  loading: true,
  data: null,
  error: '',
})

const items = computed<Item[]>(() => itemsState.data?.items ?? [])

const formState = reactive<CreateItemPayload>({
  title: '',
  description: '',
  status: 'draft',
})

const submissionState = reactive({
  loading: false,
  error: '',
  success: '',
})

async function loadSection<T>(state: QueryState<T>, loader: () => Promise<T>) {
  state.loading = true
  state.error = ''

  try {
    state.data = await loader()
  } catch (error) {
    state.error = error instanceof Error ? error.message : 'Unknown error'
  } finally {
    state.loading = false
  }
}

async function refreshAll() {
  await Promise.all([
    loadSection(healthState, api.getHealth),
    loadSection(metaState, api.getMeta),
    loadSection(itemsState, api.getItems),
  ])
}

async function handleCreateItem() {
  submissionState.loading = true
  submissionState.error = ''
  submissionState.success = ''

  try {
    const createdItem = await api.createItem({
      title: formState.title.trim(),
      description: formState.description.trim(),
      status: formState.status,
    })

    formState.title = ''
    formState.description = ''
    formState.status = 'draft'
    submissionState.success = `Created item #${createdItem.id}`

    await loadSection(itemsState, api.getItems)
    await loadSection(metaState, api.getMeta)
  } catch (error) {
    submissionState.error = error instanceof Error ? error.message : 'Unknown submission error'
  } finally {
    submissionState.loading = false
  }
}

const itemSummary = computed(() => {
  if (itemsState.loading) {
    return 'Loading starter items...'
  }

  if (itemsState.error) {
    return 'Items could not be loaded.'
  }

  return items.value.length === 0
    ? 'No items yet. This scaffold is ready for a form + list extension.'
    : `${items.value.length} starter item${items.value.length === 1 ? '' : 's'} available.`
})

onMounted(() => {
  void refreshAll()
})
</script>

<template>
  <div class="shell">
    <main class="app-frame">
      <section class="hero panel panel--hero">
        <p class="eyebrow">Vue 3 + Vite frontend scaffold</p>
        <div class="hero__content">
          <div>
            <h1>FastAPI starter dashboard</h1>
            <p class="hero__copy">
              A compact frontend slice for checking backend health, app metadata, and starter items.
              It stays intentionally small so the next pass can add an items form and richer CRUD flow quickly.
            </p>
          </div>

          <div class="hero__actions">
            <button class="button" type="button" @click="refreshAll">Refresh API data</button>
            <div class="api-target">
              <span>API base URL</span>
              <code>{{ api.apiBaseUrl }}</code>
            </div>
          </div>
        </div>
      </section>

      <section class="grid">
        <ApiPanel title="Health" subtitle="GET /api/health">
          <template #aside>
            <StatusBadge
              :label="healthState.loading ? 'Loading' : healthState.error ? 'Error' : healthState.data?.ok ? 'Healthy' : 'Unknown'"
              :tone="healthState.loading ? 'warning' : healthState.error ? 'danger' : healthState.data?.ok ? 'success' : 'neutral'"
            />
          </template>

          <p v-if="healthState.error" class="error-message">{{ healthState.error }}</p>
          <pre v-else class="code-block">{{ JSON.stringify(healthState.data, null, 2) }}</pre>
        </ApiPanel>

        <ApiPanel title="Meta" subtitle="GET /api/meta">
          <template #aside>
            <StatusBadge
              :label="metaState.data?.databaseConnected ? 'Database ready' : metaState.loading ? 'Checking DB' : 'DB offline'"
              :tone="metaState.data?.databaseConnected ? 'success' : metaState.error ? 'danger' : 'warning'"
            />
          </template>

          <p v-if="metaState.error" class="error-message">{{ metaState.error }}</p>
          <dl v-else-if="metaState.data" class="meta-list">
            <div>
              <dt>App</dt>
              <dd>{{ metaState.data.appName }}</dd>
            </div>
            <div>
              <dt>Environment</dt>
              <dd>{{ metaState.data.environment }}</dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>{{ metaState.data.version }}</dd>
            </div>
            <div>
              <dt>Database</dt>
              <dd>{{ metaState.data.databaseConnected ? 'Connected' : 'Unavailable' }}</dd>
            </div>
          </dl>
          <pre v-else class="code-block">Loading metadata...</pre>
        </ApiPanel>

        <ApiPanel title="Items" subtitle="GET /api/items">
          <template #aside>
            <StatusBadge
              :label="itemsState.loading ? 'Loading' : itemsState.error ? 'Error' : `${items.length} loaded`"
              :tone="itemsState.error ? 'danger' : items.length > 0 ? 'success' : 'neutral'"
            />
          </template>

          <p class="section-copy">{{ itemSummary }}</p>
          <form class="item-form" @submit.prevent="handleCreateItem">
            <label>
              <span>Title</span>
              <input v-model="formState.title" type="text" maxlength="120" placeholder="e.g. Dream archive" required />
            </label>

            <label>
              <span>Status</span>
              <select v-model="formState.status">
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="archived">archived</option>
              </select>
            </label>

            <label class="item-form__full">
              <span>Description</span>
              <textarea
                v-model="formState.description"
                rows="4"
                maxlength="2000"
                placeholder="Capture the starter content that you can reshape once the competition prompt arrives."
              />
            </label>

            <div class="item-form__footer item-form__full">
              <button class="button" type="submit" :disabled="submissionState.loading || !formState.title.trim()">
                {{ submissionState.loading ? 'Saving...' : 'Create item' }}
              </button>
              <p v-if="submissionState.success" class="success-message">{{ submissionState.success }}</p>
              <p v-else-if="submissionState.error" class="error-message">{{ submissionState.error }}</p>
            </div>
          </form>

          <p v-if="itemsState.error" class="error-message">{{ itemsState.error }}</p>
          <ul v-else-if="items.length > 0" class="item-list">
            <li v-for="item in items" :key="item.id" class="item-card">
              <div class="item-card__header">
                <strong>{{ item.title }}</strong>
                <StatusBadge :label="item.status" :tone="item.status === 'active' ? 'success' : item.status === 'archived' ? 'danger' : 'warning'" />
              </div>
              <p>{{ item.description || 'No description provided.' }}</p>
              <small>Created at {{ new Date(item.created_at).toLocaleString() }}</small>
            </li>
          </ul>
          <pre v-else class="code-block">{{ JSON.stringify(itemsState.data, null, 2) }}</pre>
        </ApiPanel>
      </section>
    </main>
  </div>
</template>
