<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 p-8 flex flex-col overflow-hidden">
      <Header :user="user" @logout="logout" />

      <div class="bg-white shadow-md rounded-lg overflow-y-auto mt-6">
        <div class="p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Manajemen Pengguna</h2>
          <router-link
            to="/register"
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-block mb-4"
          >
            <i class="fas fa-user-plus mr-2"></i> Tambah Akun
          </router-link>

          <div v-if="loading" class="text-center py-4">
            <i class="fas fa-spinner animate-spin text-gray-500 text-xl mr-2"></i> Memuat data...
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full leading-normal">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Nama
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
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
                    <span
                      class="px-2 py-1 font-semibold rounded-full"
                      :class="{
                        'bg-blue-100 text-blue-800': user.role === 'user',
                        'bg-yellow-100 text-yellow-800': user.role === 'editor',
                        'bg-gray-200 text-gray-800': user.role === 'admin',
                      }"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-5 py-3 border-b border-gray-200 text-center text-sm">
                    <div class="inline-flex space-x-2">
                      <button
                        v-if="user.role !== 'admin'"
                        @click="openEditModal(user)"
                        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-xs"
                      >
                        <i class="fas fa-edit"></i> Edit
                      </button>
                      <button
                        v-if="user.role !== 'admin'"
                        @click="confirmDeleteUser(user.id, user.name)"
                        class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-xs"
                      >
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

      <div
        v-if="isEditModalOpen"
        class="fixed z-10 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Edit Profil Pengguna
                  </h3>
                  <div class="mt-2">
                    <form @submit.prevent="updateUser">
                      <div class="mb-4">
                        <label for="editName" class="block text-gray-700 text-sm font-bold mb-2">Nama:</label>
                        <input
                          type="text"
                          id="editName"
                          v-model="editUser.name"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div class="mb-4">
                        <label for="editEmail" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input
                          type="email"
                          id="editEmail"
                          v-model="editUser.email"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div class="mb-4">
                        <label for="editRole" class="block text-gray-700 text-sm font-bold mb-2">Role:</label>
                        <select
                          id="editRole"
                          v-model="editUser.role"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="user">User</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div class="flex items-center justify-end mt-4">
                        <button
                          type="button"
                          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                          @click="closeEditModal"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Simpan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
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
      isEditModalOpen: false,
      editUser: {
        id: null,
        name: "",
        email: "",
        role: "user",
      },
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
        console.log("Respons dari API:", response); // Tambahkan ini untuk debugging

        if (response && response.data) {
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
        } else {
          console.error("Gagal memuat data: Respons tidak valid.", response);
          this.$toast.error("Gagal memuat data.");
          this.$router.push("/user"); // Redirect ke '/user' jika data tidak valid
        }
      } catch (err) {
        console.error("Gagal memuat data pengguna:", err);
        this.$toast.error("Gagal memuat data pengguna.");
        if (axios.isAxiosError(err) && err.response) {
          console.error("Detail respons error:", err.response.data);
          this.$toast.error(err.response.data.message || "Terjadi kesalahan pada server.");
        }
        this.$router.push("/user"); // Redirect ke '/user' jika terjadi error
      } finally {
        this.loading = false;
      }
    },
    confirmDeleteUser(userId, userName) {
      if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${userName}" dengan ID ${userId}?`)) {
        this.deleteUser(userId);
      }
    },
    async deleteUser(userId) {
      try {
        const token = localStorage.getItem("authToken");
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
    },
    formatDate(dateString) {
      if (!dateString) return "";
      return moment(dateString).format("YYYY-MM-DD HH:mm:ss");
    },
    openEditModal(user) {
      this.editUser = { ...user };
      this.isEditModalOpen = true;
    },
    closeEditModal() {
      this.isEditModalOpen = false;
      this.editUser = { id: null, name: "", email: "", role: "user" };
    },
    async updateUser() {
      try {
        const token = localStorage.getItem("authToken");
        await axios.put(`http://localhost:8000/api/users/${this.editUser.id}`, this.editUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.closeEditModal();
        this.fetchUsers();
        this.$toast.success("Profil pengguna berhasil diperbarui.");
      } catch (error) {
        console.error("Gagal memperbarui profil pengguna:", error);
        this.$toast.error("Gagal memperbarui profil pengguna.");
        if (axios.isAxiosError(error) && error.response) {
          console.error("Detail respons error:", error.response.data);
          this.$toast.error(error.response.data.message || "Terjadi kesalahan saat memperbarui.");
        }
      }
    },
  },
};
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>