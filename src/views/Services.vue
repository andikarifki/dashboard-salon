<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 p-6 flex flex-col">
      <Header :user="user" @logout="logout" />

      <h2 class="text-2xl font-bold">Services</h2>

      <router-link to="/services/create"
        class="bg-blue-500 text-white text-center px-3 py-2 rounded mt-4 inline-block max-w-32">
        Tambah
      </router-link>
      <div class="mt-4 flex items-center gap-3">
        <label for="typeFilter" class="text-base font-medium">Filter Jenis:</label>
        <select id="typeFilter" v-model="selectedTypeId" @change="fetchFilteredServices"
          class="border border-gray-300 px-3 py-2 rounded text-base">
          <option value="">Semua</option>
          <option v-for="type in typeServices" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
      </div>
      <div class="mt-4 flex items-center">
        <label for="search" class="mr-3 text-base font-medium">Cari Layanan:</label>
        <input type="text" id="search" v-model="searchQuery" @input="searchServices"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-base"
          placeholder="Masukkan nama layanan" />
      </div>
      <div class="overflow-x-auto mt-8">
        <table class="min-w-full table-fixed border-collapse border border-gray-200 text-base">
          <thead>
            <tr class="bg-gray-100">
              <th class="border-b px-3 py-2 w-32">Nama</th>
              <th class="border-b px-3 py-2 w-64">Deskripsi</th>
              <th class="border-b px-3 py-2 w-24">Harga</th>
              <th class="border-b px-3 py-2 w-32">Jenis</th>
              <th class="border-b px-3 py-2 w-52">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in filteredServices" :key="service.id">
              <td class="border-b px-3 py-2 truncate" :title="service.name">
                {{ service.name }}
              </td>
              <td class="border-b px-3 py-2 break-words whitespace-normal">
                {{ service.description }}
              </td>
              <td class="border-b px-3 py-2">Rp {{ service.price }}</td>
              <td class="border-b px-3 py-2 truncate" :title="service.type_service.name">
                {{ service.type_service.name }}
              </td>
              <td class="border-b px-3 py-2 text-center space-x-2">
                <router-link :to="`/services/edit/${service.id}`"
                  class="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                  <i class="fas fa-pen"></i>
                </router-link>
                <button @click="deleteService(service.id)" class="bg-red-500 text-white px-3 py-1 rounded text-sm">
                  <i class="fas fa-trash-can"></i>
                </button>
                <button @click="viewServiceDetail(service)" class="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showDetail" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-8 rounded shadow-lg w-96 text-center">
          <h3 class="text-xl font-bold mb-6">Detail Service</h3>
          <div v-if="currentService.image" class="mt-4 flex justify-center">
            <img :src="currentService.image" alt="Image" class="max-w-full h-auto object-contain rounded-lg shadow-md"
              style="max-height: 600px" />
          </div>

          <table class="mt-6 w-full text-base" style="table-layout: fixed;">
            <tbody>
              <tr>
                <td class="py-3 px-4 font-semibold text-left w-36">Nama Service:</td>
                <td class="py-3 px-4 text-left">{{ currentService?.name }}</td>
              </tr>

              <tr>
                <td class="py-3 px-4 font-semibold text-left w-48">Deskripsi:</td>
                <td class="py-3 px-4 text-left break-words whitespace-normal">{{ currentService?.description }}</td>
              </tr>

              <tr>
                <td class="py-3 px-4 font-semibold text-left w-32">Harga:</td>
                <td class="py-3 px-4 text-left">Rp{{ currentService?.price }}</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-semibold text-left w-36">Jenis Layanan:</td>
                <td class="py-3 px-4 text-left">
                  {{ currentService?.type_service.name }}
                </td>
              </tr>
            </tbody>
          </table>
          <button @click="showDetail = false" class="bg-gray-400 text-white px-5 py-2 rounded mt-4 text-base">
            Tutup
          </button>
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
    };
  },
  computed: {
    filteredServices() {
      return this.services.filter(service => {
        const typeFilter = !this.selectedTypeId || service.id_type == this.selectedTypeId;
        const searchFilter = !this.searchQuery || service.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return typeFilter && searchFilter;
      });
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
      } catch (error) {
        console.error("Gagal menghapus service:", error);
      }
    },
  },
};
</script>