<template>
  <div class="container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p>Belum punya akun? <router-link to="/register">Daftar</router-link></p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
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
        this.$router.push("/dashboard");
      } catch (error) {
        alert("Login gagal! Periksa email dan password.");
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 300px;
  margin: 50px auto;
  text-align: center;
}
input, button {
  display: block;
  width: 100%;
  margin: 10px 0;
}
</style>
