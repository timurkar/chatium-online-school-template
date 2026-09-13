<template>
  <footer class="mt-20 border-t border-slate-200 bg-white">
    <div class="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
      <div class="md:col-span-2">
        <div class="flex items-center gap-2">
          <span class="w-9 h-9 rounded-xl bg-indigo-600 text-white grid place-items-center"><Icon name="graduation" size="w-5 h-5" /></span>
          <span class="font-black text-lg tracking-tight">{{ SCHOOL.name }}</span>
        </div>
        <p class="mt-4 text-sm text-slate-500 max-w-md">{{ SCHOOL.description }}</p>
      </div>
      <div>
        <h3 class="font-semibold text-sm">Обучение</h3>
        <ul class="mt-3 space-y-2 text-sm text-slate-500">
          <li><a :href="coursesRoute.url()" class="hover:text-slate-900">Все курсы</a></li>
          <li><a :href="coursesRoute.query({ level: 'beginner' }).url()" class="hover:text-slate-900">Для начинающих</a></li>
          <li><a :href="myRoute.url()" class="hover:text-slate-900">Личный кабинет</a></li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold text-sm">Контакты</h3>
        <ul class="mt-3 space-y-2 text-sm text-slate-500">
          <li>{{ SCHOOL.phone }}</li>
          <li>{{ SCHOOL.email }}</li>
          <li>{{ SCHOOL.telegram }}</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-slate-100">
      <div class="max-w-7xl mx-auto px-4 py-5 text-xs text-slate-400 flex flex-wrap gap-2 justify-between">
        <span>© {{ year }} {{ SCHOOL.name }}</span>
        <span>Сделано на Chatium</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'
import { SCHOOL } from '../shared/config'
import { coursesRoute } from '../courses'
import { myRoute } from '../my'

const year = new Date().getFullYear()
</script>
