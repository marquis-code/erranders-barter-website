<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside class="w-full md:w-60 bg-white border-r border-slate-200 flex flex-col hidden md:flex sticky top-0 h-screen shrink-0">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/android-chrome-192x192.png" alt="Decluttered" class="h-8 w-8 rounded-lg object-contain shadow-xs" />
          <span class="font-black text-slate-900 tracking-tight text-lg">Decluttered<span class="text-[#FF5C1A]">.</span></span>
        </NuxtLink>
      </div>
      <nav class="p-3 flex-1 space-y-1">
        <NuxtLink to="/dashboard" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard') ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'">
          <LayoutDashboard class="w-4 h-4" /> Overview
        </NuxtLink>
        <NuxtLink to="/dashboard/listings" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/listings') ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'">
          <Package class="w-4 h-4" /> My Listings
        </NuxtLink>
        <NuxtLink to="/dashboard/trades" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/trades') ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'">
          <ArrowRightLeft class="w-4 h-4" /> Escrow Trades
        </NuxtLink>
        <NuxtLink to="/dashboard/offers" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/offers') ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'">
          <Repeat class="w-4 h-4" /> Trade Hub
        </NuxtLink>
        <NuxtLink to="/dashboard/services" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/services') ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'">
          <Briefcase class="w-4 h-4" /> My Services
        </NuxtLink>
        <NuxtLink to="/dashboard/availability" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/availability') ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'">
          <CalendarClock class="w-4 h-4" /> Availability
        </NuxtLink>
        <NuxtLink to="/dashboard/bookings" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/bookings') ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'">
          <CalendarDays class="w-4 h-4" /> Bookings
        </NuxtLink>
        <NuxtLink to="/dashboard/wallet" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/wallet') ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'">
          <Wallet class="w-4 h-4" /> Escrow Wallet
        </NuxtLink>
        <NuxtLink to="/dashboard/settings" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/settings') ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'">
          <Settings class="w-4 h-4" /> Settings
        </NuxtLink>
        <NuxtLink to="/messages" class="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/messages') ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'">
          <div class="flex items-center gap-2.5"><MessageCircle class="w-4 h-4" /> Messages</div>
          <span v-if="unreadChats.length > 0" class="bg-red-500 text-white text-xs px-1.5 py-0.2 rounded-full font-bold">{{ unreadChats.length }}</span>
        </NuxtLink>
      </nav>
      <div class="p-3 border-t border-slate-100">
        <button @click="showLogoutModal = true" class="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
          <LogOut class="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>

    <!-- Mobile Topbar -->
    <header class="md:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-40">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="/android-chrome-192x192.png" alt="Decluttered" class="h-7 w-7 rounded-lg object-contain shadow-xs" />
        <span class="font-black text-slate-900 tracking-tight text-base">Decluttered<span class="text-[#FF5C1A]">.</span></span>
      </NuxtLink>
      <div class="flex items-center gap-3">
        <NuxtLink to="/messages" class="relative text-slate-500">
          <MessageCircle class="w-6 h-6" />
          <span v-if="unreadChats.length > 0" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
        </NuxtLink>
        <button @click="mobileMenu = !mobileMenu" class="p-2 text-slate-500">
          <Menu v-if="!mobileMenu" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </header>

    <!-- Mobile Menu: a drawer with its own scroll and a pinned footer -->
    <div v-if="mobileMenu" class="mobile-drawer md:hidden">
      <header class="drawer-head">
        <div class="drawer-brand">
          <span class="drawer-name">Decluttered<span class="drawer-dot">.</span></span>
        </div>
        <button type="button" class="drawer-close" aria-label="Close menu" @click="mobileMenu = false">
          <X class="w-5 h-5" />
        </button>
      </header>

      <!-- Everything between the header and Sign out scrolls; the two ends do not. -->
      <nav class="drawer-nav">
        <p class="drawer-label">Menu</p>

        <NuxtLink
          v-for="link in mobileLinks"
          :key="link.to"
          :to="link.to"
          class="drawer-link"
          :class="{ on: route.path === link.to }"
          @click="mobileMenu = false"
        >
          <component :is="link.icon" class="drawer-icon" />
          <span>{{ link.label }}</span>
          <span v-if="link.badge" class="drawer-badge">{{ link.badge }}</span>
        </NuxtLink>
      </nav>

      <!-- Sign out sits on the bottom edge, always reachable. -->
      <footer class="drawer-foot">
        <button type="button" class="drawer-signout" @click="mobileMenu = false; showLogoutModal = true">
          <LogOut class="w-5 h-5" />
          Sign out
        </button>
      </footer>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>

    <!-- Logout Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div class="bg-white max-w-sm w-full rounded-2xl p-6 text-center border border-slate-200 relative">
        <div class="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <HeartCrack class="w-6 h-6" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-1">Leaving so soon?</h3>
        <p class="text-slate-500 text-sm mb-6">We'll keep your listings safe while you're away.</p>
        <div class="flex gap-3">
          <button @click="showLogoutModal = false" class="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 text-sm transition-colors">Cancel</button>
          <button @click="handleLogout" class="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 text-sm transition-colors">Sign Out</button>
        </div>
      </div>
    </div>

    <!-- Chat Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-[-20px] opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-[-20px] opacity-0"
    >
      <div v-if="showChatToast && latestMessage" class="z-[200] pointer-events-auto fixed top-20 right-4 max-w-sm w-full bg-white rounded-xl border border-slate-200 p-3.5 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors" @click="navigateToChat">
        <div class="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
          <MessageCircle class="w-5 h-5 text-brand-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-slate-900 truncate">New Message</p>
          <p class="text-sm text-slate-600 truncate mt-0.5">
            {{ latestMessage.message?.content || 'Sent an attachment' }}
          </p>
        </div>
        <button @click.stop="showChatToast = false" class="text-slate-400 hover:text-slate-600 shrink-0">
          <X class="w-5 h-5" />
        </button>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { LayoutDashboard, ArrowRightLeft, Wallet, Settings, LogOut, HeartCrack, Menu, X, MessageCircle, Repeat, Package, Briefcase, CalendarClock, CalendarDays } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { io } from 'socket.io-client'

const route = useRoute()
const router = useRouter()
const { logout, token, user } = useAuth()

const mobileMenu = ref(false)
const showLogoutModal = ref(false)

const unreadChats = ref([])
const showChatToast = ref(false)
const latestMessage = ref(null)
let socket = null

const isActive = (path) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}

const mobileLinks = computed(() => [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/listings', label: 'My listings', icon: Package },
  { to: '/dashboard/trades', label: 'Escrow trades', icon: ArrowRightLeft },
  { to: '/dashboard/offers', label: 'Trade hub', icon: Repeat },
  { to: '/dashboard/services', label: 'My services', icon: Briefcase },
  { to: '/dashboard/availability', label: 'Availability', icon: CalendarClock },
  { to: '/dashboard/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/dashboard/wallet', label: 'Escrow wallet', icon: Wallet },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/messages', label: 'Messages', icon: MessageCircle, badge: unreadChats.value.length || 0 },
])

const handleLogout = () => {
  showLogoutModal.value = false
  logout()
  router.push('/login')
}

const navigateToChat = () => {
  if (latestMessage.value) {
    router.push(`/chat?chatId=${latestMessage.value.chatId}`)
    showChatToast.value = false
    unreadChats.value = unreadChats.value.filter(c => c.chatId !== latestMessage.value.chatId)
  }
}

onMounted(() => {
  if (process.client && token.value) {
    try {
      socket = io(useRuntimeConfig().public.apiBaseUrl.replace('/api/v1', ''), {
        auth: { token: `Bearer ${token.value}` },
        transports: ['polling'],
      })
      
      socket.on('chatNotification', (data) => {
        if (typeof window !== 'undefined' && window.location.pathname.includes('/chat') && window.location.search.includes(data.chatId)) return;
        
        latestMessage.value = data
        showChatToast.value = true
        unreadChats.value.push(data)
        
        setTimeout(() => {
          showChatToast.value = false
        }, 5000)
      })
    } catch (err) {
      console.warn('Socket init failed:', err)
    }
  }
})

onUnmounted(() => {
  if (socket) socket.disconnect()
})
</script>

<style scoped>
/* The drawer: fixed height, header and footer pinned, only the middle scrolls. */
.mobile-drawer {
  position: fixed;
  inset: 0;
  z-index: 45;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.drawer-head {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  padding-top: calc(14px + env(safe-area-inset-top));
  border-bottom: 1px solid #eee9e1;
}

.drawer-name {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #14110d;
}

.drawer-dot {
  color: #ff5c1a;
}

.drawer-close {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #eee9e1;
  background: #fff;
  color: #14110d;
}

.drawer-nav {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 10px 12px 16px;
}

.drawer-label {
  margin: 11px 6px 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #948d84;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px;
  border-radius: 11px;
  font-size: 15.5px;
  font-weight: 650;
  color: #14110d;
  text-decoration: none;
}

.drawer-link:hover {
  background: #faf7f2;
}

.drawer-link.on {
  background: #fff1e8;
  color: #ff5c1a;
  font-weight: 750;
}

.drawer-icon {
  width: 20px;
  height: 20px;
  flex: none;
}

.drawer-badge {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 999px;
  background: #ff5c1a;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.drawer-foot {
  flex: none;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid #eee9e1;
  background: #fff;
}

.drawer-signout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 15px;
  font-weight: 750;
}
</style>
