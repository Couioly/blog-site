<template>
  <a :href="book.url" target="_blank" rel="noopener noreferrer" class="book-card"
     @mouseenter="showPopup($event)" @mouseleave="hidePopup">

    <!-- 封面 -->
    <div class="book-cover">
      <img :src="book.cover_url" :alt="book.book_name" loading="lazy" />
      <span v-if="book.rating_score" class="book-rating-tag">
        {{ book.rating_score.toFixed(1) }}
      </span>
    </div>

    <!-- 信息区 -->
    <div class="book-info">
      <h3 class="book-title">{{ book.book_name }}</h3>
      <p class="book-author">{{ book.author }}</p>
      <p v-if="book.publisher" class="book-pub">{{ book.publisher }} · {{ book.pub_year }}</p>
      <div v-if="book.tags?.length" class="book-tags">
        <span v-for="tag in book.tags.slice(0, 3)" :key="tag" class="book-tag">{{ tag }}</span>
      </div>
    </div>

    <!-- 悬停详情弹窗 -->
    <Teleport to="body">
      <div v-if="popupVisible" class="book-popup" :style="popupStyle"
           @mouseenter="popupHover = true" @mouseleave="onPopupLeave">
        <div class="popup-title">{{ book.book_name }}</div>
        <div class="popup-author">{{ book.author }}</div>
        <div class="popup-rating" v-if="book.rating_score">
          ★ {{ book.rating_score.toFixed(1) }}
          <span v-if="book.rating_total">（{{ book.rating_total }}人评价）</span>
        </div>
        <table class="popup-meta" v-if="book.publisher || book.pub_year || book.pages || book.price">
          <tr v-if="book.publisher"><td>出版社</td><td>{{ book.publisher }}</td></tr>
          <tr v-if="book.pub_year"><td>出版年</td><td>{{ book.pub_year }}</td></tr>
          <tr v-if="book.pages"><td>页数</td><td>{{ book.pages }}</td></tr>
          <tr v-if="book.price"><td>定价</td><td>{{ book.price }}</td></tr>
          <tr v-if="book.isbn"><td>ISBN</td><td>{{ book.isbn }}</td></tr>
          <tr v-if="book.binding"><td>装帧</td><td>{{ book.binding }}</td></tr>
        </table>
        <p v-if="book.summary" class="popup-summary">{{ book.summary.slice(0, 200) }}{{ book.summary.length > 200 ? '...' : '' }}</p>
        <div v-if="book.tags?.length" class="popup-tags">
          <span v-for="tag in book.tags" :key="tag" class="popup-tag">{{ tag }}</span>
        </div>
      </div>
    </Teleport>
  </a>
</template>

<script setup lang="ts">
interface BookItem {
  id: number; book_name: string; author: string
  cover_url: string; rating_score: number; rating_total: number
  summary: string; publisher: string; pub_year: string
  pages: string; price: string; isbn: string; binding: string
  tags: string[]; url: string
}

defineProps<{ book: BookItem }>()

const popupVisible = ref(false)
const popupHover = ref(false)
const popupX = ref(0)
const popupY = ref(0)
let timer: ReturnType<typeof setTimeout> | null = null

const popupStyle = computed(() => ({
  left: `${popupX.value}px`, top: `${popupY.value}px`
}))

function showPopup(e: MouseEvent) {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    const w = 320
    let x = e.clientX + 16, y = e.clientY - 10
    if (x + w > window.innerWidth - 16) x = e.clientX - w - 16
    if (y + 480 > window.innerHeight - 16) y = window.innerHeight - 480 - 16
    if (x < 16) x = 16; if (y < 16) y = 16
    popupX.value = x; popupY.value = y
    popupVisible.value = true
  }, 400)
}

function hidePopup() {
  if (timer) clearTimeout(timer)
  if (popupHover.value) return
  timer = setTimeout(() => {
    popupVisible.value = false
    popupHover.value = false
  }, 150)
}

// Popup 自身 mouseleave 时直接关闭
function onPopupLeave() {
  popupHover.value = false
  popupVisible.value = false
  if (timer) clearTimeout(timer)
}
</script>

<style scoped>
/* ... 保持原有卡片样式不变 ... */
.book-card {
  display: flex; flex-direction: column; text-decoration: none; color: inherit;
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  overflow: hidden; box-shadow: var(--shadow-soft); transition: all 0.25s ease; cursor: pointer;
}
.book-card:hover { border-color: var(--coral); box-shadow: var(--shadow-soft-lg); transform: translateY(-3px); }

.book-cover {
  position: relative; width: 100%; aspect-ratio: 3/4; overflow: hidden;
  background: linear-gradient(135deg, #F5F8F0 0%, #E8EFE8 100%);
}
.book-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.book-card:hover .book-cover img { transform: scale(1.06); }

.book-rating-tag {
  position: absolute; top: 8px; right: 8px; padding: 2px 8px;
  font-size: 0.75rem; font-weight: 600; color: #292524;
  background: rgba(255,183,178,0.88); backdrop-filter: blur(8px); border-radius: 6px;
}

.book-info { padding: 0.85rem 1rem 1rem; display: flex; flex-direction: column; gap: 0.15rem; flex: 1; }
.book-title { font-size: 0.9rem; font-weight: 600; color: var(--text); margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.book-author { font-size: 0.78rem; color: var(--text-muted); margin: 0; }
.book-pub { font-size: 0.7rem; color: var(--text-muted); margin: 0; opacity: 0.75; }
.book-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 0.4rem; }
.book-tag { font-size: 0.68rem; padding: 1px 6px; border: 1px solid var(--border); border-radius: 4px; color: var(--text-muted); background: var(--surface-hover); }

/* ---- 详情弹窗 ---- */
.book-popup {
  position: fixed; z-index: 1000; width: 320px; max-height: 460px; overflow-y: auto;
  background: var(--bg); border: 1px solid var(--border); border-radius: 1rem;
  padding: 1.25rem; box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  font-size: 0.85rem; line-height: 1.6;
}
.popup-title { font-weight: 700; font-size: 1rem; color: var(--text); margin-bottom: 0.25em; }
.popup-author { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4em; }
.popup-rating { font-size: 0.85rem; color: var(--coral); font-weight: 600; margin-bottom: 0.5em; }
.popup-rating span { font-weight: 400; font-size: 0.75rem; color: var(--text-muted); }
.popup-meta { width: 100%; border-collapse: collapse; margin-bottom: 0.5em; }
.popup-meta td { padding: 2px 0; font-size: 0.75rem; }
.popup-meta td:first-child { color: var(--text-muted); width: 50px; white-space: nowrap; }
.popup-meta td:last-child { color: var(--text-secondary); }
.popup-summary { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.6; margin: 0.5em 0; }
.popup-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 0.5em; }
.popup-tag { font-size: 0.68rem; padding: 1px 6px; border: 1px solid var(--border); border-radius: 4px; color: var(--text-muted); background: var(--surface-hover); }
</style>
