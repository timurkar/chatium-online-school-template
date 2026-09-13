<template>
  <div class="min-h-screen flex flex-col">
    <AdminHeader active="form" />

    <main class="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      <nav class="text-sm text-slate-500 flex items-center gap-2">
        <a :href="adminRoute.url()" class="hover:text-slate-900">Курсы</a><span>/</span>
        <a :href="adminCourseRoute.query({ id: course.id }).url()" class="hover:text-slate-900">{{ course.title }}</a><span>/</span>
        <span class="text-slate-900">{{ lesson ? lesson.title : 'Новый урок' }}</span>
      </nav>
      <div class="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 class="text-3xl md:text-4xl font-black tracking-tight">{{ lesson ? 'Редактирование урока' : 'Новый урок' }}</h1>
        <a v-if="lesson" :href="learnRoute.query({ course: course.id, lesson: lesson.id }).url()" target="_blank" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900">Открыть на сайте <Icon name="arrow-right" size="w-4 h-4" /></a>
      </div>

      <form class="mt-8 grid lg:grid-cols-[1fr_360px] gap-8 items-start" @submit.prevent="save">
        <div class="space-y-4">
          <label class="block">
            <span class="text-sm text-slate-600">Название</span>
            <input v-model="form.title" required class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 bg-white" />
          </label>
          <label class="block">
            <span class="text-sm text-slate-600">Короткое описание (в программе курса)</span>
            <input v-model="form.description" class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 bg-white" />
          </label>
          <label class="block">
            <span class="text-sm text-slate-600">Конспект урока — поддерживаются заголовки «## », списки «- » и **жирный**</span>
            <textarea v-model="form.content" rows="16" class="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 font-mono text-sm bg-white"></textarea>
          </label>
        </div>

        <aside class="space-y-4">
          <section class="rounded-2xl bg-white border border-slate-200/80 p-5 space-y-3">
            <h2 class="font-bold">Видео</h2>
            <p class="text-sm text-slate-500">Выберите или загрузите файл в хранилище Chatium — видео будет отдаваться потоком через встроенный плеер.</p>
            <StorageFilePicker v-model="form.videoHash" kind="video" button-title="Выбрать видео из хранилища…" />
            <div v-if="form.videoHash" class="rounded-xl overflow-hidden bg-slate-900 aspect-video">
              <StorageVideoPlayer :key="form.videoHash" :hash="form.videoHash" />
            </div>
            <details class="text-sm">
              <summary class="cursor-pointer text-slate-500 hover:text-slate-900">Или внешняя ссылка (YouTube, VK Video, Rutube, mp4)</summary>
              <input v-model="form.videoUrl" class="mt-2 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" placeholder="https://…" />
              <p class="mt-1 text-xs text-slate-400">Используется, если видео из хранилища не выбрано.</p>
            </details>
          </section>

          <section class="rounded-2xl bg-white border border-slate-200/80 p-5 space-y-3">
            <label class="block">
              <span class="text-sm text-slate-600">Длительность, минут</span>
              <input v-model.number="form.durationMinutes" type="number" min="0" class="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500" />
            </label>
            <label class="inline-flex items-center gap-2 cursor-pointer"><input v-model="form.isFree" type="checkbox" class="w-5 h-5 accent-indigo-600" /><span class="text-sm">Открытый урок — доступен без записи на курс</span></label>
          </section>

          <p v-if="error" class="text-sm text-rose-600 rounded-xl bg-rose-50 p-3">{{ error }}</p>

          <div class="flex flex-wrap gap-3">
            <button type="submit" class="h-12 px-7 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 inline-flex items-center gap-2" :disabled="saving">
              <Icon v-if="saving" name="spinner" size="w-5 h-5 animate-spin" />
              {{ saving ? 'Сохраняем…' : lesson ? 'Сохранить урок' : 'Создать урок' }}
            </button>
            <a :href="adminCourseRoute.query({ id: course.id }).url()" class="h-12 px-5 rounded-full border border-slate-300 font-medium inline-flex items-center hover:bg-white">Отмена</a>
            <button v-if="lesson" type="button" class="ml-auto h-12 px-4 rounded-full text-rose-600 hover:bg-rose-50 font-medium" :disabled="saving" @click="remove">Удалить</button>
          </div>
        </aside>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import StorageFilePicker from '@vault/sdk/StorageFilePicker.vue'
import StorageVideoPlayer from '@vault/sdk/StorageVideoPlayer.vue'
import AdminHeader from '../components/AdminHeader.vue'
import Icon from '../../school/components/Icon.vue'
import { learnRoute } from '../../school/learn'
import { adminRoute } from '../index'
import { adminCourseRoute } from '../course'
import { lessonCreateRoute } from '../api/lessons/create'
import { lessonUpdateRoute } from '../api/lessons/update'
import { lessonDeleteRoute } from '../api/lessons/delete'

const props = defineProps<{ course: any; lesson: any | null; lessonsCount: number }>()

const form = reactive({
  title: props.lesson?.title ?? '',
  description: props.lesson?.description ?? '',
  content: props.lesson?.content ?? '',
  videoHash: (props.lesson?.videoHash ?? null) as string | null,
  videoUrl: props.lesson?.videoUrl ?? '',
  durationMinutes: props.lesson?.durationMinutes ?? 15,
  isFree: props.lesson?.isFree ?? props.lessonsCount === 0,
})
const saving = ref(false)
const error = ref('')

function payload() {
  return {
    title: form.title,
    description: form.description,
    content: form.content,
    videoHash: form.videoHash || undefined,
    videoUrl: form.videoUrl || undefined,
    durationMinutes: Math.max(0, Math.floor(Number(form.durationMinutes) || 0)),
    isFree: !!form.isFree,
  }
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (props.lesson) await lessonUpdateRoute.query({ id: props.lesson.id }).run(ctx, payload())
    else await lessonCreateRoute.query({ course: props.course.id }).run(ctx, payload())
    window.location.href = adminCourseRoute.query({ id: props.course.id }).url()
  } catch (e: any) {
    error.value = e?.message || 'Не удалось сохранить урок'
    saving.value = false
  }
}

async function remove() {
  if (!props.lesson || !window.confirm(`Удалить урок «${props.lesson.title}»?`)) return
  saving.value = true
  try {
    await lessonDeleteRoute.query({ id: props.lesson.id }).run(ctx)
    window.location.href = adminCourseRoute.query({ id: props.course.id }).url()
  } catch (e: any) {
    error.value = e?.message || 'Не удалось удалить урок'
    saving.value = false
  }
}
</script>
