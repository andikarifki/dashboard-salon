<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 p-6 flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-2xl font-bold">Dashboard</h2>
          <p class="text-lg">Selamat datang, {{ user.name }}!</p>
        </div>
        <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <button @click="showCreateForm = true" class="bg-blue-500 text-white px-4 py-2 rounded mt-4">Tambah
        Service</button>

      <div v-if="showCreateForm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded shadow-lg w-96">
          <h3 class="text-lg font-bold mb-4">Tambah Service Baru</h3>
          <form @submit.prevent="addService">
            <input v-model="newService.name" placeholder="Nama Service" class="border p-2 rounded w-full mb-2"
              required />
            <input v-model="newService.description" placeholder="Deskripsi Service"
              class="border p-2 rounded w-full mb-2" required />
            <input v-model="newService.price" placeholder="Harga Service" type="number"
              class="border p-2 rounded w-full mb-2" required />
            <input type="file" @change="handleImageUpload" class="border p-2 rounded w-full mb-2" />
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded w-full">Tambah Service</button>
            <button @click="showCreateForm = false" type="button"
              class="bg-gray-500 text-white px-4 py-2 rounded w-full mt-2">Batal</button>
          </form>
        </div>
      </div>

      <div class="overflow-x-auto mt-6">
        <table class="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="border-b px-4 py-2">Nama Service</th>
              <th class="border-b px-4 py-2">Deskripsi</th>
              <th class="border-b px-4 py-2">Harga</th>
              <th class="border-b px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.id">
              <td class="border-b px-4 py-2">{{ service.name }}</td>
              <td class="border-b px-4 py-2">{{ service.description }}</td>
              <td class="border-b px-4 py-2">Rp{{ service.price }}</td>
              <td class="border-b px-4 py-2">
                <button @click="editService(service)"
                  class="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                <button @click="deleteService(service.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded mr-2">Hapus</button>
                <button @click="viewServiceDetail(service)"
                  class="bg-blue-500 text-white px-3 py-1 rounded">Detail</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="editingService" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded shadow-lg w-96 text-center">
          <h3 class="text-lg font-bold mb-4">Edit Service</h3>
          <input v-model="editingService.name" placeholder="Nama Service" class="border p-2 rounded w-full mb-2" />
          <input v-model="editingService.description" placeholder="Deskripsi Service"
            class="border p-2 rounded w-full mb-2" />
          <input v-model="editingService.price" placeholder="Harga Service" type="number"
            class="border p-2 rounded w-full mb-2" />

          <input type="file" @change="handleEditImageUpload" class="border p-2 rounded w-full mb-2" />

          <button @click="updateService" class="bg-green-500 text-white px-4 py-2 rounded">Update</button>
          <button @click="editingService = null" class="bg-gray-400 text-white px-4 py-2 rounded ml-2">Batal</button>
        </div>
      </div>

      <div v-if="showDetail" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded shadow-lg w-96 text-center">
          <h3 class="text-lg font-bold mb-4">Detail Service</h3>
          <div v-if="currentService.image">
            <img v-if="currentService.image" :src="currentService.image" alt="Image" class="mt-4 w-full h-auto" />
          </div>
          <p><strong>Nama Service:</strong> {{ currentService.name }}</p>
          <p><strong>Deskripsi:</strong> {{ currentService.description }}</p>
          <p><strong>Harga:</strong> Rp{{ currentService.price }}</p>
          <button @click="showDetail = false" class="bg-gray-400 text-white px-4 py-2 rounded ml-2">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Sidebar from "../components/Sidebar.vue";

export default {
  components: {
    Sidebar, // Daftarkan komponen Sidebar agar dapat digunakan di template
  },
  data() {
    return {
      user: {},
      services: [],
      newService: { name: "", description: "", price: "", image: null },
      editingService: null,
      showCreateForm: false,
      showDetail: false,
      currentService: null,
    };
  },
  async created() {
    try {
      const response = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      this.user = response.data;
      this.fetchServices();
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

    async logout() {
      try {
        await axios.post("/user/logout", {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
      localStorage.removeItem("token");
      this.$router.push("/login");
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      this.newService.image = file;
      console.log("File dipilih:", file);
    },

    async addService() {
      try {
        const formData = new FormData();
        formData.append("name", this.newService.name);
        formData.append("description", this.newService.description);
        formData.append("price", this.newService.price);

        if (this.newService.image) {
          formData.append("image", this.newService.image);
        }

        const response = await axios.post("/services", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });

        this.services.push(response.data);
        this.newService = { name: "", description: "", price: "", image: null };
        this.showCreateForm = false;
      } catch (error) {
        console.error("Gagal menambah service:", error.response?.data || error);
      }
    },

    handleEditImageUpload(event) {
      const file = event.target.files[0];
      this.editingService.newImage = file; // Simpan file baru
      console.log("File yang dipilih untuk edit:", file);
    },

    editService(service) {
      this.editingService = { ...service };
    },

    async updateService() {
      try {
        const formData = new FormData();
        formData.append("name", this.editingService.name);
        formData.append("description", this.editingService.description);
        formData.append("price", this.editingService.price);
        formData.append("image", this.editingService.newImage);

        const response = await axios.post(`/services/${this.editingService.id}?_method=PUT`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const index = this.services.findIndex(service => service.id === this.editingService.id);
        if (index !== -1) {
          this.services[index] = { ...response.data };
        }

        this.editingService = null;
      } catch (error) {
        console.error("Gagal mengupdate service:", error.response?.data || error);
      }
    },

    async deleteService(id) {
      if (!confirm("Yakin ingin menghapus service ini?")) return;
      try {
        await axios.delete(`/services/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.services = this.services.filter(service => service.id !== id);
      } catch (error) {
        console.error("Gagal menghapus service:", error);
      }
    },
  },
};
</script>