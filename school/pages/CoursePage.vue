<template>
  <div class="min-h-screen flex flex-col">
    <Header active="courses" />

    <main class="flex-1">
      <!-- Hero -->
      <section class="bg-slate-900 text-white">
        <div class="max-w-7xl mx-auto px-4 py-10 md:py-14 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div>
            <nav class="text-sm text-slate-400 flex items-center gap-2">
              <a :href="indexRoute.url()" class="hover:text-white">Главная</a><span>/</span>
              <a :href="coursesRoute.url()" class="hover:text-white">Курсы</a><span>/</span>
              <span class="text-slate-200 line-clamp-1">{{ course.title }}</span>
            </nav>
            <div class="mt-5 flex flex-wrap gap-2">
              <span class="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">{{ course.levelLabel }}</span>
              <span v-if="course.isFree" class="px-3 py-1 rounded-full bg-emerald-500 text-xs font-bold">Бесплатно</span>
            </div>
            <h1 class="mt-4 text-3xl md:text-5xl font-black tracking-tight leading-tight">{{ course.title }}</h1>
            <p class="mt-4 text-lg text-slate-300 max-w-2xl">{{ course.description }}</p>
            <div class="mt-6 flex flex-wrap gap-6 text-sm text-slate-300">
              <span class="inline-flex items-center gap-2"><Icon name="book" size="w-4 h-4" /> {{ course.lessonsCount }} {{ pluralize(course.lessonsCount, 'урок', 'урока', 'уроков') }}</span>
              <span class="inline-flex items-center gap-2"><Icon name="clock" size="w-4 h-4" /> {{ formatDuration(course.totalMinutes) }} видео</span>
              <span class="inline-flex items-center gap-2"><Icon name="graduation" size="w-4 h-4" /> {{ course.durationWeeks }} {{ pluralize(course.durationWeeks, 'неделя', 'недели', 'недель') }}</span>
            </div>
            <div class="mt-8 flex items-center gap-3">
              <span class="w-12 h-12 rounded-full bg-white/10 grid place-items-center text-2xl">{{ course.teacherEmoji }}</span>
              <div><div class="font-semibold">{{ course.teacherName }}</div><div class="text-sm text-slate-400">{{ course.teacherTitle }}</div></div>
            </div>
          </div>

          <!-- Enroll card -->
          <aside class="rounded-2xl bg-white text-slate-900 p-6 shadow-xl lg:sticky lg:top-24">
            <CourseCover :image-hash="course.imageHash" :emoji="course.emoji" :title="course.title" :seed="course.id" wrapper-class="aspect-[16/10] rounded-xl" emoji-class="text-6xl" />
            <div class="mt-5 flex items-baseline gap-3">
              <span class="text-3xl font-black" :class="course.isFree ? 'text-emerald-600' : ''">{{ course.priceFormatted }}</span>
              <span v-if="course.oldPriceFormatted" class="text-slate-400 line-through">{{ course.oldPriceFormatted }}</span>
            </div>

            <template v-if="enrollmentStatus === 'active' || enrollmentStatus === 'completed'">
              <ProgressBar class="mt-4" :done="completedLessons.length" :total="lessons.length" />
              <a :href="learnRoute.query({ course: course.id }).url()" class="mt-4 w-full h-12 rounded-full bg-indigo-600 text-white font-semibold inline-flex items-center justify-center gap-2 hover:bg-indigo-700">
                <Icon name="play" size="w-4 h-4" /> {{ completedLessons.length ? 'Продолжить обучение' : 'Начать обучение' }}
              </a>
            </template>
            <template v-else-if="enrollmentStatus === 'pending'">
              <div class="mt-4 rounded-xl bg-amber-50 text-amber-800 text-sm p-3">Заявка принята. Менеджер свяжется с вами, чтобы подтвердить запись.</div>
              <a v-if="freeLesson" :href="learnRoute.query({ course: course.id, lesson: freeLesson.id }).url()" class="mt-3 w-full h-12 rounded-full border border-slate-300 font-medium inline-flex items-center justify-center gap-2 hover:bg-slate-50">
                <Icon name="play" size="w-4 h-4" /> Смотреть открытые уроки
              </a>
            </template>
            <template v-else>
              <a :href="enrollRoute.query({ course: course.id }).url()" class="mt-4 w-full h-12 rounded-full bg-indigo-600 text-white font-semibold inline-flex items-center justify-center gap-2 hover:bg-indigo-700">
                {{ course.isFree ? 'Начать бесплатно' : 'Записаться на курс' }} <Icon name="arrow-right" size="w-4 h-4" />
              </a>
              <a v-if="freeLesson" :href="learnRoute.query({ course: course.id, lesson: freeLesson.id }).url()" class="mt-3 w-full h-12 rounded-full border border-slate-300 font-medium inline-flex items-center justify-center gap-2 hover:bg-slate-50">
                <Icon name="play" size="w-4 h-4" /> Посмотреть первый урок
              </a>
              <p class="mt-3 text-xs text-slate-500 text-center">{{ course.isFree ? 'Нужен только вход по email или телефону' : 'Оплата после подтверждения заявки · возврат 14 дней' }}</p>
            </template>
          </aside>
        </div>
      </section>

      <div class="max-w-7xl mx-auto px-4 grid lg:grid-cols-[1.4fr_1fr] gap-10">
        <div>
          <!-- What you learn -->
          <section v-if="course.whatYouLearn.length" class="mt-12">
            <h2 class="text-2xl font-black tracking-tight">Чему вы научитесь</h2>
            <ul class="mt-5 grid sm:grid-cols-2 gap-3">
              <li v-for="item in course.whatYouLearn" :key="item" class="flex gap-3 rounded-xl bg-white border border-slate-200/80 p-4 text-sm">
                <Icon name="check-circle" size="w-5 h-5 text-emerald-600 shrink-0" /> {{ item }}
              </li>
            </ul>
          </section>

          <!-- About -->
          <section class="mt-12">
            <h2 class="text-2xl font-black tracking-tight">О курсе</h2>
            <p class="mt-4 text-slate-600 leading-relaxed whitespace-pre-line">{{ course.fullDescription }}</p>
          </section>

          <!-- Program -->
          <section class="mt-12">
            <div class="flex items-end justify-between gap-4">
              <h2 class="text-2xl font-black tracking-tight">Программа</h2>
              <span class="text-sm text-slate-500">{{ lessons.length }} {{ pluralize(lessons.length, 'урок', 'урока', 'уроков') }} · {{ formatDuration(course.totalMinutes) }}</span>
            </div>
            <ol class="mt-5 divide-y divide-slate-100 rounded-2xl bg-white border border-slate-200/80">
              <li v-for="(l, i) in lessons" :key="l.id">
                <a :href="learnRoute.query({ course: course.id, lesson: l.id }).url()" class="flex items-center gap-4 p-4 hover:bg-slate-50">
                  <span class="w-9 h-9 rounded-full grid place-items-center text-sm font-bold shrink-0" :class="completedLessons.includes(l.id) ? 'bg-emerald-100 text-emerald-700' : l.isFree || enrolled ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400'">
                    <Icon v-if="completedLessons.includes(l.id)" name="check" size="w-4 h-4" />
                    <Icon v-else-if="!l.isFree && !enrolled" name="lock" size="w-4 h-4" />
                    <template v-else>{{ i + 1 }}</template>
                  </span>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium">{{ l.title }}</div>
                    <div class="text-sm text-slate-500 line-clamp-1">{{ l.description }}</div>
                  </div>
                  <span v-if="l.isFree && !enrolled" class="hidden sm:inline px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">Открыт</span>
                  <span class="text-sm text-slate-400 shrink-0">{{ l.durationMinutes }} мин</span>
                </a>
              </li>
              <li v-if="!lessons.length" class="p-6 text-center text-slate-500">Уроки скоро появятся</li>
            </ol>
          </section>
        </div>

        <aside class="mt-12">
          <div class="rounded-2xl bg-white border border-slate-200/80 p-6">
            <h3 class="font-bold">Преподаватель</h3>
            <div class="mt-4 flex items-center gap-4">
              <span class="w-16 h-16 rounded-2xl bg-indigo-50 grid place-items-center text-4xl">{{ course.teacherEmoji }}</span>
              <div><div class="font-semibold">{{ course.teacherName }}</div><div class="text-sm text-slate-500">{{ course.teacherTitle }}</div></div>
            </div>
          </div>
          <div class="mt-4 rounded-2xl bg-white border border-slate-200/80 p-6 text-sm space-y-3">
            <div class="flex gap-3"><Icon name="clock" size="w-5 h-5 text-indigo-600 shrink-0" /><span>Доступ к материалам навсегда, учитесь в своём темпе</span></div>
            <div class="flex gap-3"><Icon name="check-circle" size="w-5 h-5 text-indigo-600 shrink-0" /><span>Сертификат после защиты итогового проекта</span></div>
            <div class="flex gap-3"><Icon name="refresh" size="w-5 h-5 text-indigo-600 shrink-0" /><span>Возврат в течение 14 дней после старта</span></div>
          </div>
        </aside>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import CourseCover from '../components/CourseCover.vue'
import ProgressBar from '../components/ProgressBar.vue'
import { formatDuration, pluralize } from '../shared/format'
import { indexRoute } from '../index'
import { coursesRoute } from '../courses'
import { enrollRoute } from '../enroll'
import { learnRoute } from '../learn'

const props = defineProps<{ course: any; lessons: any[]; enrollmentStatus: string | null; completedLessons: string[] }>()

const enrolled = computed(() => props.enrollmentStatus === 'active' || props.enrollmentStatus === 'completed')
const freeLesson = computed(() => props.lessons.find(l => l.isFree) ?? null)
</script>
