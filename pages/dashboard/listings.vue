<template>
  <div class="p-4 md:p-6">
    <div class="max-w-5xl mx-auto">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-slate-900 mb-1">My Active Listings</h1>
          <p class="text-slate-500 font-medium text-xs sm:text-sm">Manage all the items you've posted for sale or swap.</p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Grid or list, remembered for the next visit. -->
          <div class="view-switch" role="group" aria-label="How to show your listings">
            <button type="button" :class="{ on: view === 'grid' }" aria-label="Grid view" @click="setView('grid')">
              <LayoutGrid class="w-4 h-4" />
            </button>
            <button type="button" :class="{ on: view === 'list' }" aria-label="List view" @click="setView('list')">
              <List class="w-4 h-4" />
            </button>
          </div>

          <NuxtLink to="/sell" class="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
            <Plus class="w-4 h-4" /> Post New Item
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <div v-for="i in 8" :key="i" class="bg-slate-100 rounded-xl h-52 animate-pulse"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h2 class="font-bold text-red-700 mb-1">Could not load your listings</h2>
        <p class="text-sm text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchListings" class="bg-brand-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-brand-700 text-sm transition-colors">
          Try again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && items.length === 0" class="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <div class="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <PackageX class="w-7 h-7 text-brand-600" />
        </div>
        <h2 class="text-lg font-bold text-slate-900 mb-1">No active listings</h2>
        <p class="text-slate-500 text-sm mb-5 max-w-xs mx-auto">You haven't posted any items yet. Start selling or swapping to make some cash!</p>
        <NuxtLink to="/sell" class="inline-flex bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors items-center gap-2">
          <Plus class="w-4 h-4" /> Post Your First Item
        </NuxtLink>
      </div>

      <!-- Listings: grid or list -->
      <div v-else :class="view === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4' : 'flex flex-col gap-3'">
        <article
          v-for="item in items"
          :key="item._id"
          class="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-brand-500 transition-colors"
          :class="view === 'list' ? 'flex items-stretch' : 'flex flex-col'"
        >
          <NuxtLink
            :to="`/item/${item._id}`"
            :class="view === 'list' ? 'w-28 sm:w-40 shrink-0' : ''"
            class="relative block aspect-square bg-slate-100 overflow-hidden container-query-wrap"
          >
            <img v-if="!item.images || item.images.length === 0" src="/no-image.png" class="w-full h-full object-cover" />
            <img v-else :src="item.images[0]" :alt="item.title" class="w-full h-full object-cover" />

            <div
              class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-black border"
              :class="item.type === 'swap' ? 'bg-amber-50/90 backdrop-blur text-amber-700 border-amber-200' : 'bg-white/90 backdrop-blur text-slate-700 border-slate-200'"
            >
              {{ item.type }}
            </div>
          </NuxtLink>

          <div class="flex-1 min-w-0 p-3 sm:p-4 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start gap-2 mb-1">
                <NuxtLink :to="`/item/${item._id}`" class="font-bold text-sm sm:text-base truncate text-slate-900 hover:text-brand-600">
                  {{ item.title }}
                </NuxtLink>
                <span v-if="item.type !== 'swap' && item.price" class="font-black text-brand-600 text-sm sm:text-base flex-shrink-0">
                  ₦{{ Number(item.price).toLocaleString() }}
                </span>
              </div>

              <p class="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin class="w-3 h-3 flex-shrink-0" /> {{ item.location }}
              </p>

              <p v-if="item.status !== 'active'" class="mt-2 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                {{ item.status }}
              </p>
            </div>

            <!-- What you can do with your own listing -->
            <div class="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <button type="button" class="action" @click="openEdit(item)">
                <Pencil class="w-3.5 h-3.5" /> Edit
              </button>
              <!-- Sold or negotiating listings keep their place in the record. -->
              <button
                v-if="item.canDelete !== false"
                type="button"
                class="action danger"
                @click="askDelete(item)"
              >
                <Trash2 class="w-3.5 h-3.5" /> Delete
              </button>
              <span v-else class="action locked" :title="item.deleteBlockedReason">
                <Lock class="w-3.5 h-3.5" /> {{ item.deleteBlockedReason }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Edit dialog -->
      <div v-if="editing" class="modal-backdrop" @click.self="editing = null">
        <div class="modal">
          <h2 class="modal-title">Edit listing</h2>

          <form class="space-y-4" @submit.prevent="saveEdit">
            <label class="field">
              <span class="flabel">Title</span>
              <input v-model="form.title" type="text" required maxlength="80" />
            </label>

            <div class="two">
              <label class="field">
                <span class="flabel">Price (₦)</span>
                <input :value="priceDisplay" inputmode="numeric" :disabled="form.type === 'swap'" @input="onPrice" />
              </label>

              <!-- Condition is a choice, as it is when posting. -->
              <div class="field">
                <span class="flabel">Condition</span>
                <div class="pick">
                  <button type="button" class="pick-trigger" :aria-expanded="conditionOpen" @click="conditionOpen = !conditionOpen">
                    <span :class="{ placeholder: !form.condition }">{{ form.condition || 'Choose condition' }}</span>
                    <ChevronDown class="w-4 h-4" />
                  </button>
                  <div v-if="conditionOpen" class="pick-menu">
                    <button
                      v-for="c in conditions"
                      :key="c"
                      type="button"
                      class="pick-option"
                      :class="{ on: form.condition === c }"
                      @click="form.condition = c; conditionOpen = false"
                    >
                      {{ c }}
                      <Check v-if="form.condition === c" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Photos and video, changeable after posting -->
            <div class="field">
              <span class="flabel">Photos</span>
              <div class="media-grid">
                <div v-for="(img, i) in form.images" :key="'img-' + i" class="media-thumb">
                  <img :src="img" alt="" />
                  <button type="button" class="media-x" aria-label="Remove photo" @click="form.images.splice(i, 1)">
                    <X class="w-3.5 h-3.5" />
                  </button>
                </div>

                <label v-if="form.images.length < 5" class="media-add">
                  <ImagePlus class="w-5 h-5" />
                  <span>{{ uploading === 'image' ? 'Uploading…' : 'Add' }}</span>
                  <input type="file" accept="image/*" multiple class="hidden-input" :disabled="!uploading" @change="onImagePick" />
                </label>
              </div>
              <span v-if="mediaError" class="media-error">{{ mediaError }}</span>
            </div>

            <div class="field">
              <span class="flabel">Video (optional)</span>
              <div v-if="form.videos.length" class="media-grid">
                <div v-for="(v, i) in form.videos" :key="'vid-' + i" class="media-thumb wide">
                  <video :src="v" class="w-full h-full object-cover" muted playsinline controls />
                  <button type="button" class="media-x" aria-label="Remove video" @click="form.videos.splice(i, 1)">
                    <X class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <label v-else class="media-add wide">
                <Video class="w-5 h-5" />
                <span>{{ uploading === 'video' ? 'Uploading…' : 'Add a video' }}</span>
                <input type="file" accept="video/*" class="hidden-input" :disabled="!!uploading" @change="onVideoPick" />
              </label>
            </div>

            <label class="field">
              <span class="flabel">Location</span>
              <input v-model="form.location" type="text" required />
            </label>

            <label class="field">
              <span class="flabel">Description</span>
              <textarea v-model="form.description" rows="3" />
            </label>

            <p v-if="formError" class="error">{{ formError }}</p>

            <div class="modal-actions">
              <button type="button" class="btn-quiet" @click="editing = null">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Saving…' : 'Save changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete dialog: the app's own, not the browser's -->
      <div v-if="deleting" class="modal-backdrop" @click.self="deleting = null">
        <div class="modal narrow">
          <h2 class="modal-title">Delete this listing?</h2>
          <p class="modal-body">
            <strong>{{ deleting.title }}</strong> will be removed from Decluttered. This cannot be undone.
          </p>
          <p v-if="deleteError" class="error">{{ deleteError }}</p>

          <div class="modal-actions">
            <button type="button" class="btn-quiet" @click="deleting = null">Keep it</button>
            <button type="button" class="btn-danger" :disabled="removing" @click="confirmDelete">
              {{ removing ? 'Deleting…' : 'Delete listing' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Plus, PackageX, MapPin, Pencil, Trash2, LayoutGrid, List, ChevronDown, Check, X, ImagePlus, Video, Lock } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import { itemsApi } from '~/composables/useApi'
import { upload_api } from '~/api_factory/modules/upload'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'My Active Listings | Decluttered by Erranders' })

const items = ref([])
const loading = ref(true)
const error = ref('')

/** Grid or list. Remembered, because it is a preference rather than a per-visit choice. */
const view = ref('grid')
const setView = (next) => {
  view.value = next
  try {
    localStorage.setItem('decluttered-listings-view', next)
  } catch {}
}

const fetchListings = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await itemsApi.myListings()
    items.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value =
      err?.response?.data?.message || 'The listings API did not respond. Nothing is shown as a placeholder.'
    items.value = []
  } finally {
    loading.value = false
  }
}

/* ── Editing ── */
const editing = ref(null)
const saving = ref(false)
const formError = ref('')
const form = ref({
  title: '',
  price: 0,
  condition: '',
  location: '',
  description: '',
  type: 'sell',
  images: [],
  videos: [],
})

/** Same four the create form offers, so editing cannot invent a fifth condition. */
const conditions = ['Brand New', 'Like New', 'Good', 'Fair']
const conditionOpen = ref(false)
const uploading = ref('')
const mediaError = ref('')

const priceDisplay = computed(() => {
  const n = Number(form.value.price)
  return Number.isFinite(n) && n > 0 ? n.toLocaleString('en-NG') : ''
})

const onPrice = (e) => {
  const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 9)
  form.value.price = digits ? Number(digits) : 0
  e.target.value = digits ? Number(digits).toLocaleString('en-NG') : ''
}

const openEdit = (item) => {
  formError.value = ''
  form.value = {
    title: item.title || '',
    price: Number(item.price) || 0,
    condition: item.condition || '',
    location: item.location || '',
    description: item.description || '',
    type: item.type || 'sell',
    images: Array.isArray(item.images) ? [...item.images] : [],
    videos: Array.isArray(item.videos) ? [...item.videos] : [],
  }
  conditionOpen.value = false
  mediaError.value = ''
  editing.value = item
}

/** Upload straight to Cloudinary through the backend, then hold the URL until Save. */
const uploadOne = async (file, kind) => {
  uploading.value = kind;
  mediaError.value = '';
  try {
    const res = await upload_api.uploadFile(file, kind);
    const url = res?.data?.url || res?.url || res?.data?.secure_url;
    if (!url) throw new Error('no url');
    return url;
  } catch (e) {
    mediaError.value = e?.response?.data?.message || 'That file could not be uploaded';
    return null;
  } finally {
    uploading.value = '';
  }
};

const onImagePick = async (e) => {
  const files = Array.from(e.target.files || []).slice(0, 5 - form.value.images.length);
  for (const file of files) {
    const url = await uploadOne(file, 'image');
    if (url) form.value.images.push(url);
  }
  e.target.value = '';
};

const onVideoPick = async (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const url = await uploadOne(file, 'video');
    if (url) form.value.videos.push(url);
  }
  e.target.value = '';
};

const saveEdit = async () => {
  if (!editing.value) return
  saving.value = true
  formError.value = ''
  try {
    const { data } = await itemsApi.update(editing.value._id, {
      title: form.value.title.trim(),
      price: Number(form.value.price) || 0,
      condition: form.value.condition,
      location: form.value.location.trim(),
      description: form.value.description,
      images: form.value.images,
      videos: form.value.videos,
    })
    // Update in place, so the list does not jump while someone is editing.
    const updated = data?.item || data
    const index = items.value.findIndex((i) => i._id === editing.value._id)
    if (index !== -1 && updated) items.value[index] = { ...items.value[index], ...updated }
    editing.value = null
  } catch (e) {
    formError.value = e?.response?.data?.message || 'That change could not be saved'
  } finally {
    saving.value = false
  }
}

/* ── Deleting ── */
const deleting = ref(null)
const removing = ref(false)
const deleteError = ref('')

const askDelete = (item) => {
  deleteError.value = ''
  deleting.value = item
}

const confirmDelete = async () => {
  if (!deleting.value) return
  removing.value = true
  deleteError.value = ''
  try {
    await itemsApi.remove(deleting.value._id)
    items.value = items.value.filter((i) => i._id !== deleting.value._id)
    deleting.value = null
  } catch (e) {
    deleteError.value =
      e?.response?.data?.message || 'That listing could not be deleted. It may be in an active trade.'
  } finally {
    removing.value = false
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem('decluttered-listings-view')
    if (saved === 'grid' || saved === 'list') view.value = saved
  } catch {}
  fetchListings()
})
</script>

<style scoped>
.container-query-wrap { container-type: inline-size; }
.item-carousel { overflow: hidden; }
.item-carousel:hover .item-carousel-track > div { animation-play-state: paused; }
@keyframes scroll-carousel {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* View switch */
.view-switch {
  display: inline-flex;
  padding: 3px;
  border-radius: 10px;
  border: 1px solid #e2ded6;
  background: #fff;
}

.view-switch button {
  display: grid;
  place-items: center;
  width: 32px;
  height: 30px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
}

.view-switch button.on {
  background: #f1f5f9;
  color: #0f172a;
}

/* Card actions */
.action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #e2ded6;
  background: #fff;
  color: #0f172a;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}

.action:hover {
  border-color: #ff5c1a;
  color: #ff5c1a;
}

.action.locked {
  cursor: not-allowed;
  border-color: #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  font-weight: 650;
}

.action.danger:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* Dialogs */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(3px);
}

.modal {
  width: 100%;
  max-width: 480px;
  max-height: 88vh;
  overflow-y: auto;
  padding: 22px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
}

.modal.narrow {
  max-width: 420px;
}

.modal-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.modal-body {
  margin: 0 0 14px;
  font-size: 14.5px;
  line-height: 1.5;
  color: #475569;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.flabel {
  font-size: 12.5px;
  font-weight: 700;
  color: #334155;
}

.field input,
.field textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d9d5cd;
  font-size: 14.5px;
  color: #0f172a;
  outline: none;
}

.field input:focus,
.field textarea:focus {
  border-color: #ff5c1a;
}

.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-primary {
  padding: 10px 16px;
  border: 0;
  border-radius: 10px;
  background: #ff5c1a;
  color: #fff;
  font-size: 14px;
  font-weight: 750;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
}

.btn-quiet {
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #d9d5cd;
  background: #fff;
  color: #0f172a;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.btn-danger {
  padding: 10px 16px;
  border: 0;
  border-radius: 10px;
  background: #dc2626;
  color: #fff;
  font-size: 14px;
  font-weight: 750;
  cursor: pointer;
}

.error {
  margin: 0;
  font-size: 13.5px;
  font-weight: 650;
  color: #b91c1c;
}

/* Condition picker inside the dialog */
.pick {
  position: relative;
}

.pick-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d9d5cd;
  background: #fff;
  color: #0f172a;
  font-size: 14.5px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.pick-trigger .placeholder {
  color: #94a3b8;
  font-weight: 500;
}

.pick-trigger[aria-expanded='true'] {
  border-color: #ff5c1a;
}

.pick-menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 5px);
  z-index: 20;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #e2ded6;
  background: #fff;
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.14);
}

.pick-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 11px 12px;
  border: 0;
  border-bottom: 1px solid #f1f5f9;
  background: transparent;
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.pick-option:last-child {
  border-bottom: 0;
}

.pick-option:hover {
  background: #fff7ed;
}

.pick-option.on {
  color: #ff5c1a;
  font-weight: 750;
}

/* Media */
.media-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.media-thumb {
  position: relative;
  width: 74px;
  height: 74px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2ded6;
  background: #f8fafc;
}

.media-thumb.wide {
  width: 132px;
}

.media-x {
  position: absolute;
  top: 3px;
  right: 3px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border: 0;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  color: #fff;
  cursor: pointer;
}

.media-add {
  display: grid;
  place-items: center;
  gap: 2px;
  width: 74px;
  height: 74px;
  border-radius: 10px;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
}

.media-add.wide {
  width: 132px;
  height: 74px;
}

.media-add:hover {
  border-color: #ff5c1a;
  color: #ff5c1a;
}

.hidden-input {
  display: none;
}

.media-error {
  margin-top: 6px;
  font-size: 12.5px;
  font-weight: 650;
  color: #b91c1c;
}
</style>
