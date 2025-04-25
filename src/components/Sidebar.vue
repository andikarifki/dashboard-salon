<template>
  <div class="flex h-screen">
    <button v-if="!isOpen && !isMobile" @click="toggleSidebar"
      class="fixed top-4 left-4 bg-gray-700 text-white p-2 rounded z-20 hover:bg-gray-600 focus:outline-none">
      <i class="fas fa-bars"></i>
    </button>

    <aside class="bg-gray-800 text-white w-64 p-4 transition-transform duration-300 ease-in-out z-30"
      :class="{ '-translate-x-full': !isOpen }">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Cantik Salon</h2>
        <button @click="toggleSidebar" class="text-gray-400 hover:text-white focus:outline-none">
          <i :class="isOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
        </button>
      </div>
      <ul>
        <li class="mb-2">
          <router-link to="/dashboard" class="block hover:bg-gray-700 p-2 rounded">
            <i class="fas fa-home mr-2"></i>Dashboard
          </router-link>
        </li>
        <li class="mb-2">
          <router-link to="/services" class="block hover:bg-gray-700 p-2 rounded">
            <i class="fa-solid fa-list mr-2"></i>Services</router-link>
        </li>
        <li class="mb-2">
          <router-link to="/image" class="block hover:bg-gray-700 p-2 rounded">
            <i class="fa-solid fa-upload mr-2"></i>Image</router-link>
        </li>
        <li class="mb-2">
          <router-link to="/type-services" class="block hover:bg-gray-700 p-2 rounded">
            <i class="fa-brands fa-wpforms mr-2"></i>Type Services</router-link>
        </li>
        <li class="mb-2" v-if="isAdmin">
          <router-link to="/users" class="block hover:bg-gray-700 p-2 rounded">
            <i class="fa-solid fa-user-group mr-2"></i>User Management</router-link>
        </li>
      </ul>
    </aside>
    <div v-if="isOpen && isMobile" class="fixed inset-0 bg-black opacity-50 z-10" @click="toggleSidebar"></div>

    <div class="flex-1 overflow-auto p-4">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isOpen: true, // State untuk mengontrol apakah sidebar terbuka atau tertutup
      userRole: localStorage.getItem('userRole') || 'guest', // Ambil peran dari localStorage atau set default
      isMobile: window.innerWidth < 768, // Contoh breakpoint untuk mobile
    };
  },
  computed: {
    isAdmin() {
      return this.userRole === 'admin';
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
    handleResize() {
      this.isMobile = window.innerWidth < 768;
      // Jika di desktop (bukan mobile), pastikan sidebar selalu terbuka secara default
      if (!this.isMobile && !this.isOpen) {
        this.isOpen = true;
      }
    },
  },
};
</script>

<style scoped>
/* Gaya tambahan jika diperlukan */
</style>