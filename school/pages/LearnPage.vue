<template>
  <div class="min-h-screen flex flex-col bg-white">
    <Header active="learn" />

    <div class="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid lg:grid-cols-[320px_1fr] gap-8 items-start">
      <!-- Sidebar -->
      <aside class="lg:sticky lg:top-24 order-2 lg:order-1">
        <a :href="courseRoute.query({ id: course.id }).url()" class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><Icon name="arrow-left" size="w-4 h-4" /> К странице курса</a>
        <h2 class="mt-2 font-bold text-lg leading-snug">{{ course.title }}</h2>
        <ProgressBar v-if="enrolled" class="mt-3" :done="completed.length" :total="lessons.length" />
        <ol class="mt-4 space-y-1 max-h-[60vh] overflow-y-auto pr-1">
          <li v-for="(l, i) in lessons" :key="l.id">
            <a
              :href="learnRoute.query({ course: course.id, lesson: l.id }).url()"
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm"
              :class="lesson && l.id === lesson.id ? 'bg-indigo-50 text-indigo-900 font-semibold' : 'hover:bg-slate-50'"
            >
              <span class="w-7 h-7 rounded-full grid place-items-center text-xs font-bold shrink-0" :class="completed.includes(l.id) ? 'bg-emerald-100 text-emerald-700' : l.isFree || enrolled ? 'bg-slate-100 text-slate-600' : 'bg-slate-100 text-slate-400'">
                <Icon v-if="completed.includes(l.id)" name="check" size="w-3.5 h-3.5" />
                <Icon v-else-if="!l.isFree && !enrolled" name="lock" size="w-3.5 h-3.5" />
                <template v-else>{{ i + 1 }}</template>
              </span>
              <span class="flex-1 min-w-0 line-clamp-2">{{ l.title }}</span>
              <span class="text-xs text-slate-400 shrink-0">{{ l.durationMinutes }}′</span>
            </a>
          </li>
        </ol>
      </aside>

      <!-- Content -->
      <main class="order-1 lg:order-2 min-w-0">
        <EmptyState v-if="!lesson" icon="book" title="В курсе пока нет уроков" text="Загляните позже — материалы скоро появятся." />

        <template v-else-if="!canAccess">
          <div class="rounded-3xl bg-slate-900 text-white p-8 md:p-12">
            <div class="w-14 h-14 rounded-2xl bg-white/10 grid place-items-center"><Icon name="lock" size="w-7 h-7" /></div>
            <h1 class="mt-5 text-2xl md:text-3xl font-black tracking-tight">{{ lesson.title }}</h1>
            <p class="mt-3 text-slate-300 max-w-xl">Этот урок доступен студентам курса. {{ enrollmentStatus === 'pending' ? 'Ваша заявка уже у нас — как только менеджер её подтвердит, урок откроется.' : 'Запишитесь на курс, чтобы открыть все материалы.' }}</p>
            <div class="mt-6 flex flex-wrap gap-3">
              <a v-if="enrollmentStatus !== 'pending'" :href="enrollRoute.query({ course: course.id }).url()" class="h-12 px-6 rounded-full bg-white text-slate-900 font-semibold inline-flex items-center gap-2 hover:bg-slate-200">{{ course.isFree ? 'Начать бесплатно' : 'Записаться' }} <Icon name="arrow-right" size="w-4 h-4" /></a>
              <a v-if="firstFree" :href="learnRoute.query({ course: course.id, lesson: firstFree.id }).url()" class="h-12 px-6 rounded-full border border-white/30 font-medium inline-flex items-center gap-2 hover:bg-white/10"><Icon name="play" size="w-4 h-4" /> Открытый урок</a>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
            <span>Урок {{ index + 1 }} из {{ lessons.length }} · {{ lesson.durationMinutes }} мин</span>
            <a v-if="adminUrl" :href="adminUrl" class="inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100"><Icon name="edit" size="w-3.5 h-3.5" /> Редактировать урок</a>
          </div>
          <h1 class="mt-1 text-2xl md:text-4xl font-black tracking-tight">{{ lesson.title }}</h1>

          <div class="mt-6 rounded-2xl overflow-hidden bg-slate-900" :class="lesson.videoHash ? '' : 'aspect-video'">
            <StorageVideoPlayer v-if="lesson.videoHash" :key="lesson.videoHash" :hash="lesson.videoHash" />
            <iframe v-else-if="embedUrl" :src="embedUrl" class="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <video v-else-if="lesson.videoUrl && isDirectVideo(lesson.videoUrl)" :src="lesson.videoUrl" controls class="w-full h-full"></video>
            <div v-else class="w-full h-full grid place-items-center text-slate-400">
              <div class="text-center"><Icon name="play" size="w-12 h-12 mx-auto opacity-50" /><div class="mt-2 text-sm">Видео к этому уроку появится позже</div></div>
            </div>
          </div>

          <article class="mt-8 max-w-3xl">
            <template v-for="(block, i) in contentBlocks" :key="i">
              <h2 v-if="block.type === 'h2'" class="mt-8 text-xl font-bold">{{ block.text }}</h2>
              <h3 v-else-if="block.type === 'h3'" class="mt-6 text-lg font-bold">{{ block.text }}</h3>
              <ul v-else-if="block.type === 'ul'" class="mt-3 space-y-1.5 list-disc pl-5 text-slate-700">
                <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
              </ul>
              <p v-else-if="block.type === 'p'" class="mt-3 text-slate-700 leading-relaxed" v-html="block.html"></p>
            </template>
          </article>

          <div class="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-3">
            <button
              v-if="enrolled"
              type="button"
              class="h-12 px-6 rounded-full font-semibold inline-flex items-center gap-2 disabled:opacity-50"
              :class="isCompleted ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'"
              :disabled="busy"
              @click="toggleCompleted"
            >
              <Icon :name="isCompleted ? 'check-circle' : 'check'" size="w-5 h-5" /> {{ isCompleted ? 'Урок пройден' : 'Отметить пройденным' }}
            </button>
            <a v-else-if="!signedIn || enrollmentStatus !== 'pending'" :href="enrollRoute.query({ course: course.id }).url()" class="h-12 px-6 rounded-full bg-indigo-600 text-white font-semibold inline-flex items-center gap-2 hover:bg-indigo-700">
              {{ course.isFree ? 'Начать курс бесплатно' : 'Записаться на курс' }} <Icon name="arrow-right" size="w-4 h-4" />
            </a>
            <a v-if="next" :href="learnRoute.query({ course: course.id, lesson: next.id }).url()" class="ml-auto h-12 px-6 rounded-full border border-slate-300 font-medium inline-flex items-center gap-2 hover:bg-slate-50">
              Следующий урок <Icon name="arrow-right" size="w-4 h-4" />
            </a>
            <a v-else-if="enrolled" :href="myRoute.url()" class="ml-auto h-12 px-6 rounded-full border border-slate-300 font-medium inline-flex items-center gap-2 hover:bg-slate-50">В личный кабинет</a>
          </div>
          <p v-if="error" class="mt-3 text-sm text-rose-600">{{ error }}</p>
        </template>
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import ProgressBar from '../components/ProgressBar.vue'
import EmptyState from '../components/EmptyState.vue'
import StorageVideoPlayer from '@vault/sdk/StorageVideoPlayer.vue'
import { isDirectVideo, toEmbedUrl } from '../shared/format'
import { courseRoute } from '../course'
import { learnRoute } from '../learn'
import { enrollRoute } from '../enroll'
import { myRoute } from '../my'
import { completeLessonRoute } from '../api/enrollments/complete-lesson'

const props = defineProps<{
  course: any
  lessons: any[]
  lesson: any | null
  canAccess: boolean
  enrolled: boolean
  enrollmentStatus: string | null
  signedIn: boolean
  completedLessons: string[]
  adminUrl: string | null
}>()

const completed = ref<string[]>([...props.completedLessons])
const busy = ref(false)
const error = ref('')

const index = computed(() => (props.lesson ? props.lessons.findIndex(l => l.id === props.lesson.id) : -1))
const next = computed(() => (index.value >= 0 ? props.lessons[index.value + 1] ?? null : null))
const firstFree = computed(() => props.lessons.find(l => l.isFree) ?? null)
const isCompleted = computed(() => !!props.lesson && completed.value.includes(props.lesson.id))
const embedUrl = computed(() => (props.lesson?.videoUrl ? toEmbedUrl(props.lesson.videoUrl) : null))

type Block = { type: 'h2' | 'h3'; text: string } | { type: 'ul'; items: string[] } | { type: 'p'; html: string }

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function inline(s: string) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code class="px-1 rounded bg-slate-100">$1</code>')
}

/** Очень простой markdown: заголовки ##/###, списки «- », абзацы, **жирный**. */
const contentBlocks = computed<Block[]>(() => {
  const blocks: Block[] = []
  const lines = String(props.lesson?.content ?? '').split(/\r?\n/)
  let para: string[] = []
  let list: string[] = []
  const flush = () => {
    if (para.length) blocks.push({ type: 'p', html: inline(para.join(' ')) })
    if (list.length) blocks.push({ type: 'ul', items: [...list] })
    para = []
    list = []
  }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { flush(); continue }
    if (line.startsWith('### ')) { flush(); blocks.push({ type: 'h3', text: line.slice(4) }); continue }
    if (line.startsWith('## ')) { flush(); blocks.push({ type: 'h2', text: line.slice(3) }); continue }
    if (line.startsWith('- ') || line.startsWith('• ')) { if (para.length) flush(); list.push(line.slice(2)); continue }
    if (list.length) flush()
    para.push(line)
  }
  flush()
  return blocks
})

async function toggleCompleted() {
  if (!props.lesson) return
  busy.value = true
  error.value = ''
  try {
    const result = await completeLessonRoute.query({ lesson: props.lesson.id }).run(ctx, { completed: !isCompleted.value })
    if (!result.ok) { error.value = result.error; return }
    completed.value = result.enrollment.completedLessons
  } catch {
    error.value = 'Не удалось сохранить прогресс'
  } finally {
    busy.value = false
  }
}
</script>
