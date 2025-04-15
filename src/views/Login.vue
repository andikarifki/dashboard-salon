<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" id="email" v-model="email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Masukkan email Anda" required />
        </div>
        <div class="mb-6 relative">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            :type="passwordFieldType"
            id="password"
            v-model="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
            placeholder="Masukkan password Anda"
            required
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer" @click="togglePasswordVisibility">
            <i v-if="passwordFieldType === 'password'" class="fas fa-eye h-5 w-5"></i>
            <i v-else class="fas fa-eye-slash h-5 w-5"></i>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <button type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      email: "",
      password: "",
      passwordFieldType: 'password',
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("/user/login", {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

        if (response.data.user && response.data.user.role) {
          localStorage.setItem("userRole", response.data.user.role);
          this.router.push("/dashboard");
        } else {
          console.warn("Respons login tidak menyertakan informasi role pengguna.");
          localStorage.setItem("userRole", 'guest');
          this.router.push("/dashboard");
        }

      } catch (error) {
        alert("Login gagal! Periksa email dan password.");
        console.error("Login error:", error.response?.data || error);
      }
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
  },
};
</script>

<style scoped>
/* Gaya yang sudah ada bisa dihapus karena kita menggunakan Tailwind */
</style>