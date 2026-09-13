<template>
  <div class="min-h-screen flex flex-col">
    <AdminHeader :active="tab" />

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-black tracking-tight">Панель управления</h1>
          <p class="mt-1 text-slate-500">Курсы, уроки, студенты и заявки</p>
        </div>
        <a :href="adminCourseRoute.url()" class="h-11 px-5 rounded-full bg-indigo-600 text-white font-medium inline-flex items-center gap-2 hover:bg-indigo-700">
          <Icon name="plus" size="w-4 h-4" /> Новый курс
        </a>
      </div>


      <!-- Демо-данные -->
      <section v-if="!courses.length" class="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex-1">
          <div class="font-bold">Таблицы пустые — начните с демо-данных</div>
          <p class="mt-1 text-sm text-slate-600">Загрузим 6 курсов с обложками, преподавателями и 33 уроками (первые уроки открытые, с демо-видео). Потом всё можно отредактировать или удалить.</p>
        </div>
        <button type="button" class="h-11 px-5 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-700 disabled:opacity-50 shrink-0" :disabled="busy" @click="seed(false)">{{ busy ? 'Наполняем…' : 'Наполнить демо-данными' }}</button>
      </section>
      <p v-else class="mt-4 text-xs text-slate-400">
        Нужен чистый старт?
        <button type="button" class="underline hover:text-slate-700" :disabled="busy" @click="seed(true)">сбросить и наполнить демо-данными заново</button>
        (удалит все курсы и уроки, записи студентов не тронет).
      </p>

      <div class="mt-6 inline-flex p-1 rounded-full bg-slate-200/70 text-sm font-medium">
        <button type="button" class="h-9 px-4 rounded-full transition" :class="tab === 'courses' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-900'" @click="tab = 'courses'">Курсы <span class="ml-1 text-xs text-slate-400">{{ courses.length }}</span></button>
        <button type="button" class="h-9 px-4 rounded-full transition" :class="tab === 'students' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-900'" @click="tab = 'students'">Студенты <span class="ml-1 text-xs" :class="pendingCount ? 'text-amber-600 font-bold' : 'text-slate-400'">{{ pendingCount ? pendingCount + ' новых' : enrollments.length }}</span></button>
      </div>

      <p v-if="error" class="mt-4 text-sm text-rose-600 rounded-xl bg-rose-50 p-3">{{ error }}</p>

      <!-- Courses -->
      <section v-if="tab === 'courses'" class="mt-6">
        <EmptyState v-if="!courses.length" icon="book" title="Курсов пока нет" text="Создайте первый курс или наполните школу демо-курсами.">
          <a :href="adminCourseRoute.url()" class="h-11 px-5 rounded-full bg-indigo-600 text-white font-medium inline-flex items-center">Создать курс</a>
          <button type="button" class="h-11 px-5 rounded-full border border-slate-300 font-medium hover:bg-white" :disabled="busy" @click="seed(false)">Демо-курсы</button>
        </EmptyState>
        <div v-else class="bg-white rounded-2xl border border-slate-200/80 overflow-x-auto">
          <table class="w-full text-sm min-w-[760px]">
            <thead class="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <tr><th class="p-4">Курс</th><th class="p-4">Уровень</th><th class="p-4 text-right">Уроков</th><th class="p-4 text-right">Цена</th><th class="p-4 text-right">Студентов</th><th class="p-4">Статус</th><th class="p-4"></th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="c in courses" :key="c.id" class="hover:bg-slate-50/70">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <CourseCover :image-hash="c.imageHash" :title="c.title" :width="120" wrapper-class="w-14 h-10 rounded-lg shrink-0" icon-size="w-4 h-4" />
                    <div class="min-w-0">
                      <a :href="adminCourseRoute.query({ id: c.id }).url()" class="font-medium hover:underline line-clamp-1">{{ c.title }}</a>
                      <div class="text-xs text-slate-400">{{ c.teacherName }}<span v-if="c.featured"> · ★ на главной</span></div>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-slate-500">{{ c.levelLabel }}</td>
                <td class="p-4 text-right">{{ c.lessonsCount }}</td>
                <td class="p-4 text-right whitespace-nowrap font-semibold">{{ c.priceFormatted }}</td>
                <td class="p-4 text-right">{{ studentsIn(c.id) }}</td>
                <td class="p-4">
                  <button type="button" class="rounded-full px-2.5 py-1 text-xs font-medium" :class="c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'" :disabled="busy" @click="toggleStatus(c)">{{ COURSE_STATUSES[c.status as CourseStatus] }}</button>
                </td>
                <td class="p-4 text-right whitespace-nowrap">
                  <a :href="courseRoute.query({ id: c.id }).url()" target="_blank" class="inline-grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-500" title="Открыть на сайте"><Icon name="arrow-right" size="w-4 h-4" /></a>
                  <a :href="adminCourseRoute.query({ id: c.id }).url()" class="inline-grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-500" title="Редактировать"><Icon name="edit" size="w-4 h-4" /></a>
                  <button type="button" class="inline-grid place-items-center w-9 h-9 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600" title="Удалить" :disabled="busy" @click="deleteCourse(c)"><Icon name="trash" size="w-4 h-4" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Students -->
      <section v-if="tab === 'students'" class="mt-6">
        <div class="flex flex-wrap gap-2 mb-4">
          <button type="button" class="h-9 px-3 rounded-full text-sm border" :class="statusFilter === '' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-300'" @click="statusFilter = ''">Все</button>
          <button v-for="(label, key) in ENROLLMENT_STATUSES" :key="key" type="button" class="h-9 px-3 rounded-full text-sm border" :class="statusFilter === key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-300'" @click="statusFilter = key">{{ label }}</button>
        </div>
        <EmptyState v-if="!filteredEnrollments.length" icon="graduation" title="Пока никого" text="Здесь появятся заявки и записи студентов." />
        <div v-else class="bg-white rounded-2xl border border-slate-200/80 overflow-x-auto">
          <table class="w-full text-sm min-w-[760px]">
            <thead class="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <tr><th class="p-4">Студент</th><th class="p-4">Курс</th><th class="p-4">Прогресс</th><th class="p-4">Дата</th><th class="p-4">Статус</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="e in filteredEnrollments" :key="e.id" class="hover:bg-slate-50/70">
                <td class="p-4">
                  <div class="font-medium">{{ e.studentName }}</div>
                  <div class="text-xs text-slate-500">{{ e.studentContact }}</div>
                </td>
                <td class="p-4">{{ e.courseTitle }}</td>
                <td class="p-4 w-48"><ProgressBar :done="e.completedLessons.length" :total="lessonsTotal(e.courseId)" :show-label="false" /><div class="text-xs text-slate-400 mt-1">{{ e.completedLessons.length }} / {{ lessonsTotal(e.courseId) }}</div></td>
                <td class="p-4 text-slate-500 whitespace-nowrap">{{ formatDate(e.createdAt) }}</td>
                <td class="p-4">
                  <select :value="e.status" class="h-9 px-2 rounded-full border text-sm bg-white" :class="e.status === 'pending' ? 'border-amber-400 text-amber-800' : 'border-slate-300'" :disabled="busy" @change="(ev: Event) => setStatus(e, (ev.target as HTMLSelectElement).value)">
                    <option v-for="(label, key) in ENROLLMENT_STATUSES" :key="key" :value="key">{{ label }}</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminHeader from '../components/AdminHeader.vue'
import Icon from '../../school/components/Icon.vue'
import CourseCover from '../../school/components/CourseCover.vue'
import ProgressBar from '../../school/components/ProgressBar.vue'
import EmptyState from '../../school/components/EmptyState.vue'
import { COURSE_STATUSES, CourseStatus, ENROLLMENT_STATUSES } from '../../school/shared/config'
import { courseRoute } from '../../school/course'
import { seedRoute } from '../../school/seed'
import { adminCourseRoute } from '../course'
import { courseUpdateRoute } from '../api/courses/update'
import { courseDeleteRoute } from '../api/courses/delete'
import { enrollmentUpdateStatusRoute } from '../api/enrollments/update-status'

const props = defineProps<{ courses: any[]; enrollments: any[]; initialTab: string }>()

type Tab = 'courses' | 'students'
const tab = ref<Tab>(props.initialTab === 'students' ? 'students' : 'courses')
const courses = ref<any[]>(props.courses)
const enrollments = ref<any[]>(props.enrollments)
const busy = ref(false)
const error = ref('')
const statusFilter = ref('')

const pendingCount = computed(() => enrollments.value.filter(e => e.status === 'pending').length)
const filteredEnrollments = computed(() => enrollments.value.filter(e => !statusFilter.value || e.status === statusFilter.value))

function studentsIn(courseId: string) {
  return enrollments.value.filter(e => e.courseId === courseId && e.status !== 'cancelled').length
}
function lessonsTotal(courseId: string) {
  return courses.value.find(c => c.id === courseId)?.lessonsCount ?? 0
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

async function run(action: () => Promise<void>) {
  busy.value = true
  error.value = ''
  try {
    await action()
  } catch (e: any) {
    error.value = e?.message || 'Не удалось выполнить действие'
  } finally {
    busy.value = false
  }
}

function toggleStatus(c: any) {
  return run(async () => {
    const updated = await courseUpdateRoute.query({ id: c.id }).run(ctx, {
      title: c.title,
      description: c.description,
      fullDescription: c.fullDescription,
      whatYouLearn: c.whatYouLearn,
      imageHash: c.imageHash ?? undefined,
      price: c.price,
      oldPrice: c.oldPrice ?? undefined,
      level: c.level,
      durationWeeks: c.durationWeeks,
      teacherName: c.teacherName,
      teacherTitle: c.teacherTitle,
      teacherImageHash: c.teacherImageHash ?? undefined,
      status: c.status === 'active' ? 'draft' : 'active',
      featured: c.featured,
      sortOrder: c.sortOrder,
    })
    courses.value = courses.value.map(x => (x.id === updated.id ? updated : x))
  })
}

function deleteCourse(c: any) {
  if (!window.confirm(`Удалить курс «${c.title}» вместе с уроками?`)) return
  return run(async () => {
    await courseDeleteRoute.query({ id: c.id }).run(ctx)
    courses.value = courses.value.filter(x => x.id !== c.id)
  })
}

function setStatus(e: any, status: string) {
  return run(async () => {
    const updated = await enrollmentUpdateStatusRoute.query({ id: e.id }).run(ctx, { status: status as any })
    if (updated) enrollments.value = enrollments.value.map(x => (x.id === updated.id ? { ...x, status: updated.status } : x))
  })
}

function seed(reset: boolean) {
  if (reset && !window.confirm('Удалить все курсы и уроки и наполнить школу демо-курсами заново?')) return
  return run(async () => {
    const result = await seedRoute.query(reset ? { reset: '1' } : {}).run(ctx)
    if (!result.seeded) {
      error.value = 'reason' in result ? String(result.reason) : 'Данные уже есть'
      return
    }
    window.location.reload()
  })
}
</script>
