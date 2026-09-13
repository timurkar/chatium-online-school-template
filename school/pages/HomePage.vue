<template>
  <div class="min-h-screen flex flex-col">
    <Header active="home" />

    <main class="flex-1">
      <!-- Hero -->
      <section class="max-w-7xl mx-auto px-4 pt-10 md:pt-16">
        <div class="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <span class="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-600"></span> Первые уроки каждого курса — бесплатно
            </span>
            <h1 class="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">{{ SCHOOL.tagline }}</h1>
            <p class="mt-5 text-lg text-slate-600 max-w-xl">{{ SCHOOL.description }}</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a :href="coursesRoute.url()" class="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                Выбрать курс <Icon name="arrow-right" size="w-4 h-4" />
              </a>
              <a :href="indexRoute.url() + '#how'" class="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-slate-300 font-medium hover:bg-white">
                <Icon name="play" size="w-4 h-4" /> Как проходит обучение
              </a>
            </div>
            <div class="mt-10 grid grid-cols-3 gap-4 max-w-md">
              <div><div class="text-3xl font-black">{{ totalCourses }}</div><div class="text-sm text-slate-500">курсов</div></div>
              <div><div class="text-3xl font-black">4.9</div><div class="text-sm text-slate-500">средняя оценка</div></div>
              <div><div class="text-3xl font-black">2 400+</div><div class="text-sm text-slate-500">выпускников</div></div>
            </div>
          </div>
          <div class="relative hidden lg:block">
            <div class="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-indigo-200 via-violet-100 to-sky-100 blur-2xl opacity-80"></div>
            <div class="relative grid grid-cols-2 gap-4">
              <div v-for="(c, i) in courses.slice(0, 4)" :key="c.id" class="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm" :class="i % 2 ? 'translate-y-6' : ''">
                <CourseCover :image-hash="c.imageHash" :emoji="c.emoji" :title="c.title" :seed="c.id" wrapper-class="aspect-[16/10] rounded-xl" emoji-class="text-5xl" />
                <div class="mt-3 font-semibold text-sm line-clamp-1">{{ c.title }}</div>
                <div class="text-xs text-slate-500">{{ c.lessonsCount }} уроков · {{ c.priceFormatted }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Courses -->
      <section class="max-w-7xl mx-auto px-4 mt-20">
        <SectionTitle title="Популярные курсы" subtitle="Программы, с которых чаще всего начинают" :link-href="coursesRoute.url()" link-text="Все курсы" />
        <EmptyState v-if="!courses.length" emoji="📘" title="Курсов пока нет" text="Наполните школу демо-курсами одним кликом или добавьте свои через панель управления.">
          <button type="button" class="h-11 px-5 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50" :disabled="seeding" @click="seed">{{ seeding ? 'Наполняем…' : 'Наполнить демо-курсами' }}</button>
        </EmptyState>
        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard v-for="c in courses" :key="c.id" :course="c" />
        </div>
        <p v-if="seedError" class="mt-3 text-sm text-rose-600">{{ seedError }}</p>
      </section>

      <!-- How -->
      <section id="how" class="max-w-7xl mx-auto px-4 mt-20 scroll-mt-24">
        <SectionTitle title="Как проходит обучение" subtitle="Четыре шага от выбора курса до проекта в портфолио" />
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="(s, i) in STEPS" :key="s.title" class="rounded-2xl bg-white border border-slate-200/80 p-6">
            <div class="flex items-center justify-between">
              <span class="text-4xl">{{ s.emoji }}</span>
              <span class="text-sm font-bold text-slate-300">0{{ i + 1 }}</span>
            </div>
            <div class="mt-4 font-bold">{{ s.title }}</div>
            <p class="mt-2 text-sm text-slate-500">{{ s.text }}</p>
          </div>
        </div>
      </section>

      <!-- Teachers -->
      <section v-if="teachers.length" class="max-w-7xl mx-auto px-4 mt-20">
        <SectionTitle title="Преподаватели" subtitle="Практики, которые каждый день делают то, чему учат" />
        <div class="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
          <div v-for="t in teachers" :key="t.name" class="snap-start shrink-0 w-64 rounded-2xl bg-white border border-slate-200/80 p-5">
            <div class="w-16 h-16 rounded-2xl bg-indigo-50 grid place-items-center text-4xl">{{ t.emoji }}</div>
            <div class="mt-4 font-bold">{{ t.name }}</div>
            <div class="text-sm text-slate-500">{{ t.title }}</div>
            <a :href="courseRoute.query({ id: t.courseId }).url()" class="mt-3 inline-block text-sm text-indigo-600 hover:underline">{{ t.course }}</a>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="max-w-7xl mx-auto px-4 mt-20">
        <SectionTitle title="Истории студентов" />
        <div class="grid md:grid-cols-3 gap-4">
          <figure v-for="t in TESTIMONIALS" :key="t.name" class="rounded-2xl bg-slate-900 text-white p-6 flex flex-col">
            <blockquote class="text-sm leading-relaxed text-slate-200 flex-1">«{{ t.text }}»</blockquote>
            <figcaption class="mt-5 flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-white/10 grid place-items-center text-xl">{{ t.emoji }}</span>
              <div><div class="font-semibold text-sm">{{ t.name }}</div><div class="text-xs text-slate-400">{{ t.role }}</div></div>
            </figcaption>
          </figure>
        </div>
      </section>

      <!-- FAQ -->
      <section id="faq" class="max-w-3xl mx-auto px-4 mt-20 scroll-mt-24">
        <SectionTitle title="Частые вопросы" />
        <div class="divide-y divide-slate-200 rounded-2xl bg-white border border-slate-200/80">
          <details v-for="f in FAQ" :key="f.q" class="group p-5">
            <summary class="flex items-center justify-between cursor-pointer list-none font-semibold">
              {{ f.q }}
              <Icon name="chevron-down" size="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <p class="mt-3 text-sm text-slate-600">{{ f.a }}</p>
          </details>
        </div>
      </section>

      <!-- CTA -->
      <section class="max-w-7xl mx-auto px-4 mt-20">
        <div class="rounded-3xl bg-indigo-600 text-white px-8 py-12 md:px-14 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 class="text-3xl md:text-4xl font-black tracking-tight">Начните с бесплатного урока</h2>
            <p class="mt-2 text-indigo-100 max-w-xl">Не нужно ничего оплачивать заранее — посмотрите формат, познакомьтесь с преподавателем и решите, подходит ли вам курс.</p>
          </div>
          <a :href="coursesRoute.url()" class="shrink-0 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white text-indigo-700 font-semibold hover:bg-indigo-50">Смотреть курсы <Icon name="arrow-right" size="w-4 h-4" /></a>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import SectionTitle from '../components/SectionTitle.vue'
import CourseCard from '../components/CourseCard.vue'
import CourseCover from '../components/CourseCover.vue'
import EmptyState from '../components/EmptyState.vue'
import { SCHOOL } from '../shared/config'
import { FAQ, STEPS, TESTIMONIALS } from '../shared/content'
import { indexRoute } from '../index'
import { coursesRoute } from '../courses'
import { courseRoute } from '../course'
import { seedRoute } from '../seed'

const props = defineProps<{ courses: any[]; totalCourses: number }>()

const teachers = computed(() => {
  const seen = new Set<string>()
  return props.courses
    .filter(c => (seen.has(c.teacherName) ? false : (seen.add(c.teacherName), true)))
    .map(c => ({ name: c.teacherName, title: c.teacherTitle, emoji: c.teacherEmoji, course: c.title, courseId: c.id }))
})

const seeding = ref(false)
const seedError = ref('')
async function seed() {
  seeding.value = true
  seedError.value = ''
  try {
    await seedRoute.run(ctx)
    window.location.reload()
  } catch {
    seedError.value = 'Не удалось наполнить школу. Попробуйте открыть /seed вручную.'
    seeding.value = false
  }
}
</script>
