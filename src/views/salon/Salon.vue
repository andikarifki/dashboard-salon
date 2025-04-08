<template>
    <div class="bg-gray-100 py-10">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-gray-800 mb-6">Layanan Salon Kami</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="service in services" :key="service.id"
                    class="bg-white rounded-lg shadow-md overflow-hidden">
                    <img v-if="service.image" :src="'http://localhost:8000/storage/' + service.image"
                        :alt="service.name" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h3 class="text-xl font-semibold text-gray-700 mb-2">{{ service.name }}</h3>
                        <p class="text-gray-600 text-sm mb-3">{{ service.description }}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-800 font-bold">${{ service.price }}</span>
                            <button class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                                Pesan Sekarang
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="loading" class="col-span-full text-center py-4">
                    <p class="text-gray-600">Memuat layanan...</p>
                </div>
                <div v-else-if="error" class="col-span-full text-center py-4">
                    <p class="text-red-500">Terjadi kesalahan saat memuat layanan.</p>
                    <pre class="text-xs text-red-500">{{ error }}</pre>
                </div>
                <div v-else-if="services.length === 0 && !loading && !error" class="col-span-full text-center py-4">
                    <p class="text-gray-600">Belum ada layanan yang tersedia.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const services = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
    loading.value = true;
    error.value = null; // Reset error state on each load attempt
    try {
        const response = await fetch('http://localhost:8000/api/services');
        if (!response.ok) {
            const message = `HTTP error! status: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json();
        console.log(data.map(service => service.image)); // <--- Letakkan di sini
        services.value = data;
    } catch (err) {
        error.value = err;
        console.error("Gagal memuat layanan:", err);
    } finally {
        loading.value = false;
    }
});
</script>