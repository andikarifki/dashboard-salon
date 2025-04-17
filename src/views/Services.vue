<template>
  <div class="min-h-screen bg-gray-100 flex">
    <Sidebar />

    <div class="flex-1 p-8">
      <Header :user="user" @logout="logout" />

      <div class="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Layanan</h2>

        <div class="flex justify-between items-center mb-6">
          <router-link to="/services/create"
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            <i class="fas fa-plus mr-2"></i> Tambah Layanan
          </router-link>

          <div class="flex items-center space-x-4">
            <div>
              <label for="typeFilter" class="block text-gray-700 text-sm font-bold mb-2">Filter Jenis:</label>
              <div class="relative">
                <select id="typeFilter" v-model="selectedTypeId" @change="fetchFilteredServices"
                  class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm">
                  <option value="">Semua Jenis</option>
                  <option v-for="type in typeServices" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i class="fas fa-chevron-down"></i>
                </div>
              </div>
            </div>

            <div>
              <label for="search" class="block text-gray-700 text-sm font-bold mb-2">Cari Layanan:</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
                <input type="text" id="search" v-model="searchQuery" @input="searchServices"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm pl-10"
                  placeholder="Cari nama layanan..." />
              </div>
            </div>

            <div>
              <label for="priceSort" class="block text-gray-700 text-sm font-bold mb-2">Urutkan Harga:</label>
              <select id="priceSort" v-model="priceSortOrder" @change="applyPriceSort"
                class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm">
                <option value="">Default</option>
                <option value="asc">Termurah ke Termahal</option>
                <option value="desc">Termahal ke Termurah</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full leading-normal">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nama Layanan
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Harga
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Jenis
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in paginatedServices" :key="service.id" class="hover:bg-gray-50">
                <td class="px-5 py-3 border-b border-gray-200 text-sm">
                  <p class="text-gray-900 whitespace-no-wrap truncate" :title="service.name">
                    {{ service.name }}
                  </p>
                </td>
                <td class="px-5 py-3 border-b border-gray-200 text-sm">
                  <p class="text-gray-900 break-words whitespace-normal">
                    {{ service.description }}
                  </p>
                </td>
                <td class="px-5 py-3 border-b border-gray-200 text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">Rp {{ service.price }}</p>
                </td>
                <td class="px-5 py-3 border-b border-gray-200 text-sm">
                  <p class="text-gray-900 whitespace-no-wrap truncate" :title="service.type_service.name">
                    {{ service.type_service.name }}
                  </p>
                </td>
                <td class="px-5 py-3 border-b border-gray-200 text-center text-sm">
                  <div class="inline-flex space-x-2">
                    <router-link :to="`/services/edit/${service.id}`"
                      class="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs"
                      title="Edit">
                      <i class="fas fa-pen"></i>
                    </router-link>
                    <button @click="deleteService(service.id)"
                      class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs"
                      title="Hapus">
                      <i class="fas fa-trash-can"></i>
                    </button>
                    <button @click="viewServiceDetail(service)"
                      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs"
                      title="Detail">
                      <i class="fas fa-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredServices.length === 0">
                <td colspan="5" class="px-5 py-5 border-b border-gray-200 text-sm text-gray-500 text-center">
                  Tidak ada data layanan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-center items-center mt-6">
          <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
            Sebelumnya
          </button>
          <span class="text-gray-700 mx-3">Halaman {{ currentPage }} dari {{ totalPages }}</span>
          <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
            Berikutnya
          </button>
        </div>
      </div>

      <div v-if="showDetail" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-800">Detail Layanan</h3>
            <button @click="showDetail = false" class="text-gray-500 hover:text-gray-700 focus:outline-none">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div v-if="currentService.image" class="mb-4 rounded-md overflow-hidden shadow-md">
            <img :src="currentService.image" alt="Gambar Layanan" class="w-full h-auto object-cover"
              style="max-height: 300px;">
          </div>

          <div class="grid grid-cols-1 gap-4 text-sm">
            <div>
              <label class="block text-gray-700 font-semibold mb-1">Nama Layanan:</label>
              <p class="text-gray-900">{{ currentService?.name }}</p>
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-1">Deskripsi:</label>
              <p class="text-gray-900 break-words whitespace-normal">{{ currentService?.description }}</p>
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-1">Harga:</label>
              <p class="text-gray-900">Rp {{ currentService?.price }}</p>
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-1">Jenis Layanan:</label>
              <p class="text-gray-900">{{ currentService?.type_service?.name }}</p>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button @click="showDetail = false"
              class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Sidebar from "../components/Sidebar.vue";
import Header from "../components/Header.vue";
import { debounce } from 'lodash'; // Import debounce

export default {
  components: {
    Sidebar,
    Header,
  },
  data() {
    return {
      user: {},
      services: [],
      typeServices: [],
      selectedTypeId: "",
      searchQuery: "",
      showDetail: false,
      currentService: null,
      perPage: 10, // Jumlah item per halaman
      currentPage: 1,
      priceSortOrder: '', // '', 'asc', 'desc'
    };
  },
  computed: {
    filteredServices() {
      let filtered = this.services.filter(service => {
        const typeFilter = !this.selectedTypeId || service.id_type == this.selectedTypeId;
        const searchFilter = !this.searchQuery || service.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return typeFilter && searchFilter;
      });

      if (this.priceSortOrder === 'asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (this.priceSortOrder === 'desc') {
        filtered.sort((a, b) => b.price - a.price);
      }

      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredServices.length / this.perPage);
    },
    paginatedServices() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.filteredServices.slice(startIndex, endIndex);
    },
  },
  async created() {
    try {
      const response = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      this.user = response.data;
      this.fetchServices();
      this.fetchTypeServices();
    } catch (error) {
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  },
  methods: {
    async fetchServices() {
      try {
        const response = await axios.get("/services", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.services = response.data;
        this.currentPage = 1; // Reset ke halaman pertama setelah data baru dimuat
      } catch (error) {
        console.error("Gagal mengambil data services:", error);
      }
    },
    async fetchTypeServices() {
      try {
        const response = await axios.get("/type-services", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.typeServices = response.data;
      } catch (error) {
        console.error("Gagal mengambil data jenis layanan:", error);
      }
    },
    async viewServiceDetail(service) {
      try {
        const response = await axios.get(`/services/${service.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.currentService = response.data;
        this.showDetail = true;
        console.log("Gambar yang diterima:", this.currentService.image);
      } catch (error) {
        console.error("Gagal mengambil detail service:", error);
      }
    },
    async deleteService(id) {
      if (!confirm("Yakin ingin menghapus service ini?")) return;
      try {
        await axios.delete(`/services/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.services = this.services.filter((service) => service.id !== id);
        this.currentPage = 1; // Reset ke halaman pertama setelah menghapus
      } catch (error) {
        console.error("Gagal menghapus service:", error);
      }
    },
    fetchFilteredServices() {
      this.currentPage = 1; // Reset ke halaman pertama saat filter jenis berubah
    },
    searchServices: debounce(function () {
      this.currentPage = 1; // Reset ke halaman pertama saat pencarian berubah
    }, 300),
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    applyPriceSort() {
      this.currentPage = 1; // Reset ke halaman pertama saat urutan harga berubah
    },
  },
};
</script>