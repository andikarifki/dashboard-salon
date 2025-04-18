<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 p-8 flex flex-col overflow-y-auto">
      <Header />

      <div class="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Tambah Akun Baru</h2>

        <form @submit.prevent="register" class="space-y-4">
          <div>
            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nama:</label>
            <input type="text" id="name" v-model="form.name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required placeholder="Masukkan nama">
            <div v-if="errors.name" class="text-red-500 text-xs italic mt-1">{{ errors.name[0] }}</div>
          </div>

          <div>
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input type="email" id="email" v-model="form.email"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required placeholder="Masukkan alamat email">
            <div v-if="errors.email" class="text-red-500 text-xs italic mt-1">{{ errors.email[0] }}</div>
          </div>

          <div>
            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input type="password" id="password" v-model="form.password"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required placeholder="Masukkan password">
            <div v-if="errors.password" class="text-red-500 text-xs italic mt-1">{{ errors.password[0] }}</div>
          </div>

          <div>
            <label for="role" class="block text-gray-700 text-sm font-bold mb-2">Role:</label>
            <div class="relative">
              <select id="role" v-model="form.role"
                class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
            <div v-if="errors.role" class="text-red-500 text-xs italic mt-1">{{ errors.role[0] }}</div>
          </div>

          <div class="flex items-center justify-start space-x-4">
            <button type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Daftar
            </button>
            <router-link to="/users"
              class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Batal
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';

export default {
  components: {
    Sidebar,
    Header
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        role: 'user', // Set default role
      },
      errors: {},
    };
  },
  methods: {
    async register() {
      this.errors = {};
      try {
        const response = await axios.post('http://localhost:8000/api/user/register', this.form);
        console.log('Registrasi berhasil:', response.data);
        alert('Akun berhasil ditambahkan!');
        this.$router.push('/users'); // Redirect ke halaman daftar pengguna setelah berhasil
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors;
        } else {
          console.error('Gagal mendaftar:', error);
          alert('Terjadi kesalahan saat mendaftar.');
        }
      }
    },
  },
};
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>