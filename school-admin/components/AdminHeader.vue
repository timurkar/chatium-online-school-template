<template>
  <header class="sticky top-0 z-40 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
      <a :href="adminRoute.url()" class="flex items-center gap-2 shrink-0">
        <span class="w-9 h-9 rounded-xl bg-slate-900 text-white grid place-items-center"><Icon name="settings" size="w-4 h-4" /></span>
        <span class="font-black text-lg tracking-tight">{{ SCHOOL.name }} <span class="text-slate-400 font-medium">· админка</span></span>
      </a>
      <nav class="hidden sm:flex items-center gap-1 ml-4 text-sm">
        <a :href="adminRoute.query({ tab: 'courses' }).url()" class="px-3 py-2 rounded-lg hover:bg-slate-100" :class="{ 'bg-slate-100 font-semibold': active === 'courses' }">Курсы</a>
        <a :href="adminRoute.query({ tab: 'students' }).url()" class="px-3 py-2 rounded-lg hover:bg-slate-100" :class="{ 'bg-slate-100 font-semibold': active === 'students' }">Студенты и заявки</a>
      </nav>
      <a :href="indexRoute.url()" target="_blank" class="ml-auto inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-slate-300 text-sm font-medium hover:bg-slate-50">
        Открыть сайт <Icon name="arrow-right" size="w-4 h-4" />
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import Icon from '../../school/components/Icon.vue'
import { SCHOOL } from '../../school/shared/config'
import { indexRoute } from '../../school/index'
import { adminRoute } from '../index'

withDefaults(defineProps<{ active?: 'courses' | 'students' | 'form' }>(), { active: 'courses' })
</script>
