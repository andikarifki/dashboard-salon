<template>
    <div class="bg-gray-100 py-16">
        <header class="bg-indigo-600 text-white py-4 sticky top-0 z-10">
  <div class="container mx-auto px-4 flex items-center justify-between">
    <router-link to="/salon" class="text-xl font-bold hover:text-indigo-200 transition duration-300 mr-8">
      Cantik Salon
    </router-link>
    <nav>
      <ul class="flex space-x-6">
        <li>
          <router-link to="/salon" class="hover:text-indigo-200 transition duration-300">Home</router-link>
        </li>
        <li class="relative">
          <button @click="toggleLayananDropdown" class="hover:text-indigo-200 focus:outline-none flex items-center transition duration-300">
            Layanan
            <svg class="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div v-if="isLayananDropdownOpen" class="absolute left-0 mt-2 w-48 bg-white shadow-md rounded-md z-20">
            <router-link to="/layanan/potong" class="block px-4 py-2 text-gray-800 hover:bg-indigo-100 transition duration-300">Potong</router-link>
            <router-link to="/layanan/coloring" class="block px-4 py-2 text-gray-800 hover:bg-indigo-100 transition duration-300">Coloring</router-link>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</header>
      <div class="container mx-auto px-4 mt-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">Layanan Unggulan Kami</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="service in services" :key="service.id" class="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
            <div v-if="service.image">
              <img :src="'http://localhost:8000/storage/' + service.image"
                   :alt="service.name" class="w-full h-56 object-cover">
            </div>
            <div v-else class="bg-gray-200 h-56 flex items-center justify-center">
              <span class="text-gray-500 italic">Tidak ada gambar</span>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-700 mb-3">{{ service.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ service.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-gray-800 font-bold text-lg">${{ service.price }}</span>
                <button class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  Pesan Sekarang
                </button>
              </div>
            </div>
          </div>
          <div v-if="loading" class="col-span-full text-center py-8">
            <svg class="animate-spin h-6 w-6 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-600 mt-2">Memuat layanan...</p>
          </div>
          <div v-else-if="error" class="col-span-full text-center py-8">
            <p class="text-red-500 font-semibold">Terjadi kesalahan saat memuat layanan.</p>
            <pre class="text-xs text-red-500 mt-2">{{ error }}</pre>
          </div>
          <div v-else-if="services.length === 0 && !loading && !error" class="col-span-full text-center py-8">
            <p class="text-gray-600 italic">Belum ada layanan yang tersedia.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { RouterLink } from 'vue-router';
  
  const services = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const isLayananDropdownOpen = ref(false);
  
  const toggleLayananDropdown = () => {
    isLayananDropdownOpen.value = !isLayananDropdownOpen.value;
  };
  
  onMounted(async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('http://localhost:8000/api/services');
      if (!response.ok) {
        const message = `HTTP error! status: ${response.status}`;
        throw new Error(message);
      }
      const data = await response.json();
      console.log(data.map(service => service.image));
      services.value = data;
    } catch (err) {
      error.value = err;
      console.error("Gagal memuat layanan:", err);
    } finally {
      loading.value = false;
    }
  });
  </script>