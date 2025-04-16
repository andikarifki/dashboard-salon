<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 p-6 flex flex-col">
      <Header />

      <h2 class="text-2xl font-bold mb-4">Tambah Akun Baru</h2>

      <form @submit.prevent="register">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nama:</label>
          <input type="text" id="name" v-model="form.name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required>
          <div v-if="errors.name" class="text-red-500 text-xs italic">{{ errors.name[0] }}</div>
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input type="email" id="email" v-model="form.email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required>
          <div v-if="errors.email" class="text-red-500 text-xs italic">{{ errors.email[0] }}</div>
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input type="password" id="password" v-model="form.password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required>
          <div v-if="errors.password" class="text-red-500 text-xs italic">{{ errors.password[0] }}</div>
        </div>
        <div class="mb-4">
          <label for="role" class="block text-gray-700 text-sm font-bold mb-2">Role:</label>
          <select id="role" v-model="form.role"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
          <div v-if="errors.role" class="text-red-500 text-xs italic">{{ errors.role[0] }}</div>
        </div>
        <div class="flex items-center justify-between">
          <button type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Daftar
          </button>
          <router-link to="/users"
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Kembali ke Daftar Pengguna
          </router-link>
        </div>
      </form>
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