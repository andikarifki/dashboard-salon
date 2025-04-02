<template>
  <div class="max-w-3xl mx-auto p-6 text-center">
    <h2 class="text-2xl font-bold mb-4">Dashboard</h2>
    <p class="text-lg">Selamat datang, {{ user.name }}!</p>
    
    <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded mt-4">Logout</button>

    <h3 class="text-xl font-semibold mt-6">Daftar Services</h3>
    
    <button @click="showCreateForm = true" class="bg-blue-500 text-white px-4 py-2 rounded mt-4">Tambah Service</button>

   <!-- Modal Create Service -->
   <div v-if="showCreateForm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h3 class="text-lg font-bold mb-4">Tambah Service Baru</h3>
        <form @submit.prevent="addService">
          <input v-model="newService.name" placeholder="Nama Service" class="border p-2 rounded w-full mb-2" required />
          <input v-model="newService.description" placeholder="Deskripsi Service" class="border p-2 rounded w-full mb-2" required />
          <input v-model="newService.price" placeholder="Harga Service" type="number" class="border p-2 rounded w-full mb-2" required />
          <input type="file" @change="handleImageUpload" class="border p-2 rounded w-full mb-2" required />
          <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded w-full">Tambah Service</button>
          <button @click="showCreateForm = false" type="button" class="bg-gray-500 text-white px-4 py-2 rounded w-full mt-2">Batal</button>
        </form>
      </div>
    </div>

    <!-- Tabel Services -->
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
              <button @click="editService(service)" class="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
              <button @click="deleteService(service.id)" class="bg-red-500 text-white px-3 py-1 rounded">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Edit -->
    <div v-if="editingService" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded shadow-lg w-96 text-center">
        <h3 class="text-lg font-bold mb-4">Edit Service</h3>
        <input v-model="editingService.name" placeholder="Nama Service" class="border p-2 rounded w-full mb-2" />
        <input v-model="editingService.description" placeholder="description" type="text" class="border p-2 rounded w-full mb-2" />
        <input v-model="editingService.price" placeholder="Harga Service" type="number" class="border p-2 rounded w-full mb-2" />
        <button @click="updateService" class="bg-green-500 text-white px-4 py-2 rounded">Update</button>
        <button @click="editingService = null" class="bg-gray-400 text-white px-4 py-2 rounded ml-2">Batal</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {},
      services: [],
      newService: { name: "", description: "", price: "", image: "" },
      editingService: null,
      showCreateForm: false, // Menyimpan status apakah form create service terlihat atau tidak
    };
  },
  methods: {
    handleImageUpload(event) {
      this.newService.image = event.target.files[0];
  },
  async addService() {
    try {
      const formData = new FormData();
        formData.append("name", this.newService.name);
        formData.append("description", this.newService.description);
        formData.append("price", this.newService.price);
        formData.append("image", this.newService.image);

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
      console.error("Gagal menambah service:", error);
    }
  }
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

    toggleCreateForm() {
      this.showCreateForm = !this.showCreateForm;
    },

    editService(service) {
      this.editingService = { ...service };
    },

    async updateService() {
      try {
        await axios.put(`/services/${this.editingService.id}`, this.editingService, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.fetchServices();
        this.editingService = null;
      } catch (error) {
        console.error("Gagal mengupdate service:", error.response?.data || error.message);
        alert("Error: " + JSON.stringify(error.response?.data));
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

<style scoped>
/* Tambahkan style tambahan jika perlu */
</style>
