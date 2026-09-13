<template>
  <div class="min-h-screen flex flex-col">
    <AdminHeader active="form" />

    <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
      <a :href="adminRoute.url()" class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><Icon name="arrow-left" size="w-4 h-4" /> Ко всем курсам</a>
      <h1 class="mt-3 text-3xl md:text-4xl font-black tracking-tight">{{ course ? 'Редактирование курса' : 'Новый курс' }}</h1>

      <form class="mt-8 grid lg:grid-cols-[300px_1fr] gap-8 items-start" @submit.prevent="save">
        <div class="space-y-3">
          <CourseCover :image-hash="form.imageHash || null" :emoji="form.emoji || '📘'" :title="form.title || 'Курс'" :seed="course?.id ?? form.title" wrapper-class="aspect-[16/10] rounded-2xl" emoji-class="text-7xl" />
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFile" />
          <button type="button" class="w-full h-11 rounded-full border border-slate-300 font-medium inline-flex items-center justify-center gap-2 hover:bg-white disabled:opacity-50" :disabled="uploading" @click="fileInput?.click()">
            <Icon :name="uploading ? 'spinner' : 'image'" :size="uploading ? 'w-4 h-4 animate-spin' : 'w-4 h-4'" />
            {{ uploading ? 'Загружаем…' : form.imageHash ? 'Заменить обложку' : 'Загрузить обложку' }}
          </button>
          <button v-if="form.imageHash" type="button" class="w-full text-sm text-slate-500 hover:text-rose-600" @click="form.imageHash = ''">Убрать обложку</button>
          <p v-if="uploadError" class="text-sm text-rose-600">{{ uploadError }}</p>
          <label class="block">
            <span class="text-sm text-slate-600">Эмодзи-обложка (если нет фото)</span>
            <input v-model="form.emoji" class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 text-center text-xl" placeholder="📘" />
          </label>
          <div class="rounded-2xl bg-white border border-slate-200/80 p-4 space-y-3">
            <div class="font-semibold text-sm">Преподаватель</div>
            <div class="flex gap-2">
              <input v-model="form.teacherEmoji" class="w-14 h-11 text-center rounded-xl border border-slate-300 text-xl" placeholder="🧑‍🏫" />
              <input v-model="form.teacherName" class="flex-1 h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" placeholder="Имя" />
            </div>
            <input v-model="form.teacherTitle" class="w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" placeholder="Должность, опыт" />
          </div>
        </div>

        <div class="space-y-4">
          <label class="block">
            <span class="text-sm text-slate-600">Название</span>
            <input v-model="form.title" required class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" />
          </label>
          <label class="block">
            <span class="text-sm text-slate-600">Короткое описание (для карточки)</span>
            <input v-model="form.description" class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" />
          </label>
          <label class="block">
            <span class="text-sm text-slate-600">Подробное описание</span>
            <textarea v-model="form.fullDescription" rows="5" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-indigo-500"></textarea>
          </label>
          <label class="block">
            <span class="text-sm text-slate-600">Чему научитесь — по пункту на строку</span>
            <textarea v-model="form.whatYouLearnText" rows="4" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" placeholder="Проводить исследования&#10;Работать в Figma"></textarea>
          </label>
          <div class="grid sm:grid-cols-4 gap-4">
            <label class="block">
              <span class="text-sm text-slate-600">Цена, ₽ (0 — бесплатно)</span>
              <input v-model.number="form.price" required type="number" min="0" step="1" class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" />
            </label>
            <label class="block">
              <span class="text-sm text-slate-600">Старая цена</span>
              <input v-model.number="form.oldPrice" type="number" min="0" step="1" class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" placeholder="для скидки" />
            </label>
            <label class="block">
              <span class="text-sm text-slate-600">Недель</span>
              <input v-model.number="form.durationWeeks" required type="number" min="1" step="1" class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" />
            </label>
            <label class="block">
              <span class="text-sm text-slate-600">Уровень</span>
              <select v-model="form.level" class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 bg-white outline-none focus:border-indigo-500">
                <option v-for="(label, key) in LEVELS" :key="key" :value="key">{{ label }}</option>
              </select>
            </label>
          </div>
          <div class="flex flex-wrap gap-6 pt-2">
            <label class="inline-flex items-center gap-2 cursor-pointer"><input v-model="form.featured" type="checkbox" class="w-5 h-5 accent-indigo-600" /><span class="text-sm">Показывать на главной</span></label>
            <label class="inline-flex items-center gap-2 cursor-pointer"><input v-model="published" type="checkbox" class="w-5 h-5 accent-indigo-600" /><span class="text-sm">Опубликован</span></label>
          </div>

          <p v-if="error" class="text-sm text-rose-600 rounded-xl bg-rose-50 p-3">{{ error }}</p>

          <div class="flex flex-wrap gap-3 pt-2">
            <button type="submit" class="h-12 px-7 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 inline-flex items-center gap-2" :disabled="saving || uploading">
              <Icon v-if="saving" name="spinner" size="w-5 h-5 animate-spin" />
              {{ saving ? 'Сохраняем…' : course ? 'Сохранить курс' : 'Создать курс' }}
            </button>
            <a :href="adminRoute.url()" class="h-12 px-5 rounded-full border border-slate-300 font-medium inline-flex items-center hover:bg-white">Отмена</a>
          </div>
        </div>
      </form>

      <!-- Lessons -->
      <section v-if="course" class="mt-14">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h2 class="text-2xl font-black tracking-tight">Уроки</h2>
            <p class="text-slate-500 text-sm">{{ lessonList.length }} {{ pluralize(lessonList.length, 'урок', 'урока', 'уроков') }} · порядок меняется стрелками</p>
          </div>
          <button type="button" class="h-11 px-5 rounded-full bg-slate-900 text-white font-medium inline-flex items-center gap-2 hover:bg-slate-700" @click="openLesson(null)"><Icon name="plus" size="w-4 h-4" /> Добавить урок</button>
        </div>

        <ol class="mt-5 divide-y divide-slate-100 rounded-2xl bg-white border border-slate-200/80">
          <li v-for="(l, i) in lessonList" :key="l.id" class="p-4 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-slate-100 grid place-items-center text-sm font-bold text-slate-600 shrink-0">{{ i + 1 }}</span>
            <div class="flex-1 min-w-0">
              <div class="font-medium flex items-center gap-2 flex-wrap">
                {{ l.title }}
                <span v-if="l.isFree" class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">Открытый</span>
                <span v-if="l.videoUrl" class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">видео</span>
              </div>
              <div class="text-sm text-slate-500 line-clamp-1">{{ l.description }} · {{ l.durationMinutes }} мин</div>
            </div>
            <div class="flex items-center">
              <button type="button" class="w-9 h-9 rounded-full grid place-items-center hover:bg-slate-100 text-slate-500 disabled:opacity-30" :disabled="i === 0 || busy" title="Выше" @click="move(i, -1)"><Icon name="chevron-up" size="w-4 h-4" /></button>
              <button type="button" class="w-9 h-9 rounded-full grid place-items-center hover:bg-slate-100 text-slate-500 disabled:opacity-30" :disabled="i === lessonList.length - 1 || busy" title="Ниже" @click="move(i, 1)"><Icon name="chevron-down" size="w-4 h-4" /></button>
              <button type="button" class="w-9 h-9 rounded-full grid place-items-center hover:bg-slate-100 text-slate-500" title="Редактировать" @click="openLesson(l)"><Icon name="edit" size="w-4 h-4" /></button>
              <button type="button" class="w-9 h-9 rounded-full grid place-items-center hover:bg-rose-50 text-slate-400 hover:text-rose-600" title="Удалить" :disabled="busy" @click="deleteLesson(l)"><Icon name="trash" size="w-4 h-4" /></button>
            </div>
          </li>
          <li v-if="!lessonList.length" class="p-8 text-center text-slate-500">Уроков пока нет — добавьте первый</li>
        </ol>
      </section>
      <p v-else class="mt-10 text-sm text-slate-500 rounded-xl bg-slate-100 p-4">Уроки можно будет добавить после создания курса.</p>

      <!-- Lesson modal -->
      <div v-if="lessonForm" class="fixed inset-0 z-50 bg-slate-900/50 flex items-start justify-center p-4 overflow-y-auto" @click.self="lessonForm = null">
        <form class="w-full max-w-2xl bg-white rounded-2xl p-6 space-y-4 my-8" @submit.prevent="saveLesson">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold">{{ lessonForm.id ? 'Урок' : 'Новый урок' }}</h3>
            <button type="button" class="w-9 h-9 rounded-full grid place-items-center hover:bg-slate-100" @click="lessonForm = null"><Icon name="close" /></button>
          </div>
          <label class="block">
            <span class="text-sm text-slate-600">Название</span>
            <input v-model="lessonForm.title" required class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" />
          </label>
          <label class="block">
            <span class="text-sm text-slate-600">Короткое описание</span>
            <input v-model="lessonForm.description" class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" />
          </label>
          <div class="grid sm:grid-cols-[1fr_140px] gap-4">
            <label class="block">
              <span class="text-sm text-slate-600">Ссылка на видео (YouTube, VK Video, Rutube или mp4)</span>
              <input v-model="lessonForm.videoUrl" class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" placeholder="https://…" />
            </label>
            <label class="block">
              <span class="text-sm text-slate-600">Минут</span>
              <input v-model.number="lessonForm.durationMinutes" type="number" min="0" class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" />
            </label>
          </div>
          <label class="block">
            <span class="text-sm text-slate-600">Конспект урока — поддерживаются заголовки «## », списки «- » и **жирный**</span>
            <textarea v-model="lessonForm.content" rows="10" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 font-mono text-sm"></textarea>
          </label>
          <label class="inline-flex items-center gap-2 cursor-pointer"><input v-model="lessonForm.isFree" type="checkbox" class="w-5 h-5 accent-indigo-600" /><span class="text-sm">Открытый урок — доступен без записи на курс</span></label>
          <p v-if="lessonError" class="text-sm text-rose-600 rounded-xl bg-rose-50 p-3">{{ lessonError }}</p>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="h-11 px-6 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50" :disabled="busy">{{ busy ? 'Сохраняем…' : 'Сохранить урок' }}</button>
            <button type="button" class="h-11 px-5 rounded-full border border-slate-300 font-medium hover:bg-slate-50" @click="lessonForm = null">Отмена</button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { obtainStorageFilePutUrl } from '@app/storage'
import AdminHeader from '../components/AdminHeader.vue'
import Icon from '../../school/components/Icon.vue'
import CourseCover from '../../school/components/CourseCover.vue'
import { LEVELS } from '../../school/shared/config'
import { pluralize } from '../../school/shared/format'
import { adminRoute } from '../index'
import { adminCourseRoute } from '../course'
import { courseCreateRoute } from '../api/courses/create'
import { courseUpdateRoute } from '../api/courses/update'
import { lessonCreateRoute } from '../api/lessons/create'
import { lessonUpdateRoute } from '../api/lessons/update'
import { lessonDeleteRoute } from '../api/lessons/delete'
import { lessonsReorderRoute } from '../api/lessons/reorder'

const props = defineProps<{ course: any | null; lessons: any[]; uploadUrl: string }>()

const form = reactive({
  title: props.course?.title ?? '',
  description: props.course?.description ?? '',
  fullDescription: props.course?.fullDescription ?? '',
  whatYouLearnText: (props.course?.whatYouLearn ?? []).join('\n'),
  emoji: props.course?.emoji ?? '',
  imageHash: props.course?.imageHash ?? '',
  price: props.course?.price ?? 0,
  oldPrice: props.course?.oldPrice ?? null,
  level: props.course?.level ?? 'beginner',
  durationWeeks: props.course?.durationWeeks ?? 4,
  teacherName: props.course?.teacherName ?? '',
  teacherTitle: props.course?.teacherTitle ?? '',
  teacherEmoji: props.course?.teacherEmoji ?? '',
  featured: props.course?.featured ?? false,
  status: (props.course?.status ?? 'active') as 'active' | 'draft',
})
const published = computed({ get: () => form.status === 'active', set: v => (form.status = v ? 'active' : 'draft') })

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const saving = ref(false)
const error = ref('')
const busy = ref(false)

const lessonList = ref<any[]>([...props.lessons])
const lessonForm = ref<any | null>(null)
const lessonError = ref('')

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  uploadError.value = ''
  try {
    const putUrl = await obtainStorageFilePutUrl(ctx, { getPutUrl: props.uploadUrl })
    const body = new FormData()
    body.append('Filedata', file)
    const response = await fetch(putUrl, { method: 'POST', body })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const hash = (await response.text()).trim()
    if (!hash) throw new Error('Пустой ответ хранилища')
    form.imageHash = hash
  } catch (e: any) {
    uploadError.value = 'Не удалось загрузить обложку: ' + (e?.message || 'ошибка')
  } finally {
    uploading.value = false
    input.value = ''
  }
}

function payload() {
  return {
    title: form.title,
    description: form.description,
    fullDescription: form.fullDescription,
    whatYouLearn: form.whatYouLearnText.split('\n').map((s: string) => s.trim()).filter(Boolean),
    emoji: form.emoji || undefined,
    imageHash: form.imageHash || undefined,
    price: Number(form.price) || 0,
    oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
    level: form.level as 'beginner' | 'intermediate' | 'advanced',
    durationWeeks: Math.max(1, Math.floor(Number(form.durationWeeks) || 1)),
    teacherName: form.teacherName,
    teacherTitle: form.teacherTitle,
    teacherEmoji: form.teacherEmoji || undefined,
    status: form.status,
    featured: form.featured,
  }
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (props.course) {
      await courseUpdateRoute.query({ id: props.course.id }).run(ctx, payload())
      window.location.href = adminRoute.url()
    } else {
      const created = await courseCreateRoute.run(ctx, payload())
      window.location.href = adminCourseRoute.query({ id: created.id }).url()
    }
  } catch (e: any) {
    error.value = e?.message || 'Не удалось сохранить курс'
    saving.value = false
  }
}

function openLesson(l: any | null) {
  lessonError.value = ''
  lessonForm.value = l
    ? { id: l.id, title: l.title, description: l.description, content: l.content, videoUrl: l.videoUrl ?? '', durationMinutes: l.durationMinutes, isFree: l.isFree }
    : { id: null, title: '', description: '', content: '', videoUrl: '', durationMinutes: 15, isFree: lessonList.value.length === 0 }
}

async function saveLesson() {
  if (!props.course || !lessonForm.value) return
  busy.value = true
  lessonError.value = ''
  const f = lessonForm.value
  const body = { title: f.title, description: f.description, content: f.content, videoUrl: f.videoUrl || undefined, durationMinutes: Math.max(0, Math.floor(Number(f.durationMinutes) || 0)), isFree: !!f.isFree }
  try {
    if (f.id) {
      const updated = await lessonUpdateRoute.query({ id: f.id }).run(ctx, body)
      lessonList.value = lessonList.value.map(x => (x.id === updated.id ? updated : x))
    } else {
      const created = await lessonCreateRoute.query({ course: props.course.id }).run(ctx, body)
      lessonList.value = [...lessonList.value, created]
    }
    lessonForm.value = null
  } catch (e: any) {
    lessonError.value = e?.message || 'Не удалось сохранить урок'
  } finally {
    busy.value = false
  }
}

async function deleteLesson(l: any) {
  if (!window.confirm(`Удалить урок «${l.title}»?`)) return
  busy.value = true
  try {
    await lessonDeleteRoute.query({ id: l.id }).run(ctx)
    lessonList.value = lessonList.value.filter(x => x.id !== l.id)
  } catch (e: any) {
    error.value = e?.message || 'Не удалось удалить урок'
  } finally {
    busy.value = false
  }
}

async function move(index: number, delta: number) {
  if (!props.course) return
  const next = [...lessonList.value]
  const target = index + delta
  const item = next[index]
  if (!item || target < 0 || target >= next.length) return
  next.splice(index, 1)
  next.splice(target, 0, item)
  lessonList.value = next
  busy.value = true
  try {
    await lessonsReorderRoute.query({ course: props.course.id }).run(ctx, { ids: next.map(l => l.id) })
  } catch (e: any) {
    error.value = e?.message || 'Не удалось изменить порядок'
  } finally {
    busy.value = false
  }
}
</script>
