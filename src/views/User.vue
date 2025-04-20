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
                    <span class="px-2 py-1 font-semibold rounded-full" :class="{
                      'bg-blue-100 text-blue-800': user.role === 'user',
                      'bg-yellow-100 text-yellow-800': user.role === 'editor',
                      'bg-gray-200 text-gray-800': user.role === 'admin',
                    }">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-5 py-3 border-b border-gray-200 text-center text-sm">
                    <div class="inline-flex space-x-2">
                      <button v-if="user.name !== 'admin'" @click="confirmDeleteUser(user.id, user.name)"
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
        console.log('Respons dari API:', response); // Tambahkan ini untuk debugging

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
          this.$router.push('/user'); // Redirect ke '/user' jika data tidak valid
        }
      } catch (err) {
        console.error("Gagal memuat data pengguna:", err);
        this.$toast.error("Gagal memuat data pengguna.");
        if (axios.isAxiosError(err) && err.response) {
          console.error("Detail respons error:", err.response.data);
          this.$toast.error(err.response.data.message || "Terjadi kesalahan pada server.");
        }
        this.$router.push('/user'); // Redirect ke '/user' jika terjadi error
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
  },
};
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>