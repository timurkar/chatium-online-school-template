<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 max-w-3xl mx-auto w-full px-4 py-16">
      <EmptyState icon="close" title="Страница не найдена" :text="message">
        <a :href="coursesRoute.url()" class="h-11 px-5 rounded-full bg-indigo-600 text-white font-medium inline-flex items-center">К курсам</a>
        <a :href="indexRoute.url()" class="h-11 px-5 rounded-full border border-slate-300 font-medium inline-flex items-center hover:bg-white">На главную</a>
      </EmptyState>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import EmptyState from '../components/EmptyState.vue'
import { indexRoute } from '../index'
import { coursesRoute } from '../courses'

defineProps<{ message: string }>()
</script>
