<template>
  <div class="min-h-screen flex flex-col">
    <Header active="my" />
    <main class="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      <h1 class="text-3xl md:text-4xl font-black tracking-tight">Привет, {{ userName }}!</h1>
      <p class="mt-1 text-slate-500">Ваши курсы и прогресс</p>

      <div v-if="justEnrolled" class="mt-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 p-4 flex gap-3">
        <span class="text-2xl">🎉</span>
        <div><div class="font-semibold">Заявка принята</div><div class="text-sm">Менеджер свяжется с вами, чтобы подтвердить запись и помочь с оплатой. Открытые уроки курса доступны уже сейчас.</div></div>
      </div>

      <EmptyState v-if="!enrollments.length" class="mt-8" emoji="🎓" title="Вы пока не записаны ни на один курс" text="Выберите курс — первые уроки открыты бесплатно.">
        <a :href="coursesRoute.url()" class="h-11 px-5 rounded-full bg-indigo-600 text-white font-medium inline-flex items-center">Смотреть курсы</a>
      </EmptyState>

      <div v-else class="mt-8 space-y-4">
        <div v-for="e in enrollments" :key="e.id" class="rounded-2xl bg-white border border-slate-200/80 p-5 flex flex-col sm:flex-row sm:items-center gap-5">
          <span class="w-16 h-16 rounded-2xl bg-indigo-50 grid place-items-center text-4xl shrink-0">{{ e.courseEmoji }}</span>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <a :href="courseRoute.query({ id: e.courseId }).url()" class="font-bold text-lg hover:underline">{{ e.courseTitle }}</a>
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="statusClass(e.status)">{{ ENROLLMENT_STATUSES[e.status as EnrollmentStatus] }}</span>
            </div>
            <ProgressBar v-if="e.status === 'active' || e.status === 'completed'" class="mt-3 max-w-md" :done="e.completedLessons.length" :total="e.lessonsTotal" />
            <p v-else-if="e.status === 'pending'" class="mt-2 text-sm text-slate-500">Ждём подтверждения заявки. Открытые уроки уже доступны.</p>
            <p v-else class="mt-2 text-sm text-slate-500">Запись отменена. Можно записаться снова.</p>
          </div>
          <a
            :href="e.status === 'cancelled' ? enrollRoute.query({ course: e.courseId }).url() : learnRoute.query({ course: e.courseId }).url()"
            class="shrink-0 h-11 px-5 rounded-full font-medium inline-flex items-center gap-2"
            :class="e.status === 'completed' ? 'border border-slate-300 hover:bg-slate-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'"
          >
            <Icon name="play" size="w-4 h-4" />
            {{ e.status === 'completed' ? 'Пересмотреть' : e.status === 'cancelled' ? 'Записаться снова' : e.completedLessons.length ? 'Продолжить' : 'Начать' }}
          </a>
        </div>
      </div>

      <div class="mt-10 flex flex-wrap gap-3 items-center">
        <a :href="coursesRoute.url()" class="text-sm text-indigo-600 hover:underline">Посмотреть другие курсы</a>
        <button type="button" class="ml-auto text-sm text-slate-500 hover:text-slate-900" @click="signOut">Выйти</button>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import ProgressBar from '../components/ProgressBar.vue'
import EmptyState from '../components/EmptyState.vue'
import { ENROLLMENT_STATUSES, EnrollmentStatus } from '../shared/config'
import { indexRoute } from '../index'
import { coursesRoute } from '../courses'
import { courseRoute } from '../course'
import { learnRoute } from '../learn'
import { enrollRoute } from '../enroll'

defineProps<{ enrollments: any[]; userName: string; justEnrolled: string }>()

function statusClass(status: string) {
  switch (status) {
    case 'active': return 'bg-indigo-50 text-indigo-700'
    case 'completed': return 'bg-emerald-50 text-emerald-700'
    case 'pending': return 'bg-amber-50 text-amber-700'
    default: return 'bg-slate-100 text-slate-500'
  }
}

async function signOut() {
  const response = await fetch('/s/auth/sign-out', { method: 'POST' })
  if (response.ok) window.location.href = indexRoute.url()
}
</script>
