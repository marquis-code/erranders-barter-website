<template>
  <div class="flex flex-col min-h-screen">
    <AppNavbar />
    <main :class="['flex-grow overflow-x-clip', route.path === '/' ? '' : 'pt-28']">
      <slot />
    </main>
    <AppFooter v-if="route.path === '/'" />
    <ChatWidget />
    <!-- Kept off the profile: it overlays the listing grid and forces the page to scroll. -->
    <CatchUpBanner v-if="!route.path.startsWith('/profile')" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import ChatWidget from '~/components/ChatWidget.vue'
import CatchUpBanner from '~/components/CatchUpBanner.vue'

const route = useRoute()
</script>