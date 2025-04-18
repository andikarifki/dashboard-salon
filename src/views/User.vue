<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 p-8 flex flex-col overflow-hidden">
      <Header :user="user" @logout="logout" />

      <div class="bg-white shadow-md rounded-lg overflow-y-auto mt-6">
        <div class="p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Manajemen Pengguna</h2>
          <router-link to="/register"
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-block mb-4">
            <i class="fas fa-user-plus mr-2"></i> Tambah Akun
          </router-link>

          <div v-if="loading" class="text-center py-4">
            <i class="fas fa-spinner animate-spin text-gray-500 text-xl mr-2"></i> Memuat data...
          </div>
          <div v-else-if="error" class="text-red-500 py-4">
            <i class="fas fa-exclamation-triangle mr-2"></i> Terjadi kesalahan saat memuat data: {{ error }}
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full leading-normal">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                  <td class="px-5 py-3 border-b border-gray-200 text-sm">
                    <p class="text-gray-900 whitespace-no-wrap">{{ user.name }}</p>
                  </td>
                  <td class="px-5 py-3 border-b border-gray-200 text-sm">
                    <p class="text-gray-900 whitespace-no-wrap">{{ user.email }}</p>
                  </td>
                  <td class="px-5 py-3 border-b border-gray-200 text-sm">
                    <span class="px-2 py-1 font-semibold rounded-full"
                      :class="{ 'bg-blue-100 text-blue-800': user.role === 'user', 'bg-yellow-100 text-yellow-800': user.role === 'editor', 'bg-gray-200 text-gray-800': user.role === 'admin' }">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-5 py-3 border-b border-gray-200 text-center text-sm">
                    <div class="inline-flex space-x-2">
                      <button v-if="user.name !== 'admin'" @click="openEditModal(user)"
                        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-xs">
                        <i class="fas fa-pen"></i> Edit
                      </button>
                      <button v-if="user.name !== 'admin'" @click="deleteUser(user.id)"
                        class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-xs">
                        <i class="fas fa-trash"></i> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="users.length === 0 && !loading">
                  <td colspan="4" class="px-5 py-5 border-b border-gray-200 text-sm text-gray-500 text-center">
                    Tidak ada data pengguna.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="showEditModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
        aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
            @click="closeEditModal"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
            <form @submit.prevent="updateUser">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg font-medium text-gray-900 mb-4" id="modal-title">
                  <i class="fas fa-user-edit mr-2"></i> Edit Pengguna
                </h3>
                <div class="mb-4">
                  <label for="edit-modal-name" class="block text-gray-700 text-sm font-bold mb-2">Nama:</label>
                  <input type="text" id="edit-modal-name" v-model="editingUser.name"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div class="mb-4">
                  <label for="edit-modal-email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                  <input type="email" id="edit-modal-email" v-model="editingUser.email"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div class="mb-4">
                  <label for="edit-modal-role" class="block text-gray-700 text-sm font-bold mb-2">Role:</label>
                  <select id="edit-modal-role" v-model="editingUser.role"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="user">User</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="submit"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                  <i class="fas fa-save mr-2"></i> Simpan
                </button>
                <button type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="closeEditModal">
                  <i class="fas fa-times mr-2"></i> Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Sidebar from "../components/Sidebar.vue";
import Header from "../components/Header.vue";

export default {
  components: {
    Sidebar,
    Header,
  },
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      editingUser: null, // State untuk menyimpan data pengguna yang sedang diedit
      showEditModal: false, // State untuk mengontrol visibilitas modal edit
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("http://localhost:8000/api/users");
        let usersData = response.data;
        usersData.sort((a, b) => {
          if (a.role === "admin" && b.role !== "admin") {
            return -1;
          }
          if (a.role !== "admin" && b.role === "admin") {
            return 1;
          }
          return 0;
        });
        this.users = usersData;
      } catch (err) {
        this.error = err.message;
        console.error("Gagal memuat data pengguna:", err);
      } finally {
        this.loading = false;
      }
    },
    openEditModal(user) {
      this.editingUser = { ...user }; // Mengisi state editingUser dengan data pengguna yang akan diedit
      this.showEditModal = true; // Membuka modal edit
    },
    closeEditModal() {
      this.editingUser = null; // Menutup formulir edit
      this.showEditModal = false; // Menutup modal edit
    },
    async updateUser() {
      if (!this.editingUser) return;

      try {
        const token = localStorage.getItem("authToken"); // Asumsi Anda menyimpan token di localStorage
        const response = await axios.put(
          `http://localhost:8000/api/users/${this.editingUser.id}`, // Endpoint dengan ID pengguna
          {
            name: this.editingUser.name,
            email: this.editingUser.email,
            role: this.editingUser.role,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Berhasil memperbarui pengguna:", response.data);
        this.$toast.success("Pengguna berhasil diperbarui.");
        this.closeEditModal(); // Tutup modal edit setelah berhasil
        this.fetchUsers(); // Muat ulang daftar pengguna
      } catch (error) {
        this.error = error.message;
        console.error("Gagal memperbarui pengguna:", error);
        this.$toast.error("Gagal memperbarui pengguna.");
      }
    },
    async deleteUser(userId) {
      if (confirm(`Apakah Anda yakin ingin menghapus pengguna dengan ID ${userId}?`)) {
        try {
          const token = localStorage.getItem("authToken"); // Asumsi Anda menyimpan token di localStorage
          await axios.delete(`http://localhost:8000/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.fetchUsers();
          this.$toast.success("Pengguna berhasil dihapus.");
        } catch (error) {
          this.error = error.message;
          console.error("Gagal menghapus pengguna:", error);
          this.$toast.error("Gagal menghapus pengguna.");
        }
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      return moment(dateString).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>