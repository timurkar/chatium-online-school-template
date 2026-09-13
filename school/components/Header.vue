<template>
  <header class="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
      <button type="button" class="md:hidden -ml-2 p-2 rounded-lg hover:bg-slate-100" aria-label="Меню" @click="menuOpen = !menuOpen">
        <Icon :name="menuOpen ? 'close' : 'menu'" size="w-6 h-6" />
      </button>

      <a :href="indexRoute.url()" class="flex items-center gap-2 shrink-0">
        <span class="w-9 h-9 rounded-xl bg-indigo-600 text-white grid place-items-center"><Icon name="graduation" size="w-5 h-5" /></span>
        <span class="font-black text-lg tracking-tight">{{ SCHOOL.name }}</span>
      </a>

      <nav class="hidden md:flex items-center gap-1 ml-4 text-sm">
        <a :href="coursesRoute.url()" class="px-3 py-2 rounded-lg hover:bg-slate-100" :class="{ 'bg-slate-100 font-semibold': active === 'courses' }">Курсы</a>
        <a :href="indexRoute.url() + '#how'" class="px-3 py-2 rounded-lg hover:bg-slate-100">Как проходит обучение</a>
        <a :href="indexRoute.url() + '#faq'" class="px-3 py-2 rounded-lg hover:bg-slate-100">Вопросы</a>
      </nav>

      <div class="flex items-center gap-2 ml-auto">
        <a
          :href="myRoute.url()"
          class="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium"
          :class="active === 'my' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-700'"
        >
          <Icon name="user" size="w-4 h-4" />
          <span class="hidden sm:inline">{{ signedIn ? 'Мои курсы' : 'Войти' }}</span>
        </a>
      </div>
    </div>

    <div v-if="menuOpen" class="md:hidden border-t border-slate-200 bg-white px-4 py-4">
      <nav class="grid gap-1 text-sm">
        <a :href="coursesRoute.url()" class="px-3 py-2 rounded-lg hover:bg-slate-100 font-medium">Курсы</a>
        <a :href="indexRoute.url() + '#how'" class="px-3 py-2 rounded-lg hover:bg-slate-100">Как проходит обучение</a>
        <a :href="indexRoute.url() + '#faq'" class="px-3 py-2 rounded-lg hover:bg-slate-100">Вопросы</a>
        <a :href="myRoute.url()" class="px-3 py-2 rounded-lg hover:bg-slate-100">{{ signedIn ? 'Мои курсы' : 'Войти' }}</a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Icon from './Icon.vue'
import { SCHOOL } from '../shared/config'
import { indexRoute } from '../index'
import { coursesRoute } from '../courses'
import { myRoute } from '../my'

withDefaults(defineProps<{ active?: 'home' | 'courses' | 'my' | 'learn' }>(), { active: 'home' })

const menuOpen = ref(false)
const signedIn = ref(false)

onMounted(() => {
  signedIn.value = ctx.user?.type === 'Real'
})
</script>
