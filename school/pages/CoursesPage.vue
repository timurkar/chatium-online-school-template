<template>
  <div class="min-h-screen flex flex-col">
    <Header active="courses" />
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      <h1 class="text-3xl md:text-4xl font-black tracking-tight">{{ query ? `Поиск: «${query}»` : 'Все курсы' }}</h1>
      <p class="mt-1 text-slate-500">{{ courses.length }} {{ pluralize(courses.length, 'курс', 'курса', 'курсов') }}</p>

      <div class="mt-6 flex flex-wrap gap-2">
        <a :href="coursesRoute.url()" class="h-10 px-4 rounded-full border text-sm font-medium inline-flex items-center" :class="!filter.level ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-300 hover:border-slate-500'">Все уровни</a>
        <a v-for="(label, key) in LEVELS" :key="key" :href="coursesRoute.query({ level: key }).url()" class="h-10 px-4 rounded-full border text-sm font-medium inline-flex items-center" :class="filter.level === key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-300 hover:border-slate-500'">{{ label }}</a>
      </div>

      <form class="mt-4 flex gap-2 max-w-lg" @submit.prevent="reload">
        <label class="relative flex-1">
          <span class="absolute inset-y-0 left-3 flex items-center text-slate-400"><Icon name="search" size="w-4 h-4" /></span>
          <input v-model="query" type="search" placeholder="Найти курс" class="w-full h-11 pl-9 pr-3 rounded-full bg-white border border-slate-300 outline-none focus:border-indigo-500 text-sm" />
        </label>
        <button type="submit" class="h-11 px-5 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">Найти</button>
      </form>

      <div class="mt-8" :aria-busy="loading">
        <p v-if="error" class="text-rose-600">{{ error }}</p>
        <EmptyState v-else-if="!loading && !courses.length" icon="search" title="Ничего не нашли" text="Попробуйте изменить запрос или выбрать другой уровень.">
          <a :href="coursesRoute.url()" class="h-11 px-5 rounded-full bg-slate-900 text-white font-medium inline-flex items-center">Показать все курсы</a>
        </EmptyState>
        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" :class="{ 'opacity-50': loading }">
          <CourseCard v-for="c in courses" :key="c.id" :course="c" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import CourseCard from '../components/CourseCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { LEVELS } from '../shared/config'
import { pluralize } from '../shared/format'
import { coursesRoute } from '../courses'
import { coursesListRoute } from '../api/courses/list'

const props = defineProps<{ courses: any[]; filter: { q: string; level: string } }>()

const courses = ref<any[]>(props.courses)
const query = ref(props.filter.q)
const loading = ref(false)
const error = ref('')

async function reload() {
  loading.value = true
  error.value = ''
  try {
    courses.value = await coursesListRoute.query({ q: query.value.trim() || undefined, level: props.filter.level || undefined }).run(ctx)
  } catch {
    error.value = 'Не удалось загрузить курсы. Обновите страницу.'
  } finally {
    loading.value = false
  }
}
</script>
