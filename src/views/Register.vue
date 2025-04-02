<template>
  <div class="container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input type="text" v-model="name" placeholder="Nama" required />
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <p>Sudah punya akun? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async register() {
      try {
        await axios.post("/user/register", {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        alert("Registrasi berhasil! Silakan login.");
        this.$router.push("/login");
      } catch (error) {
        alert("Registrasi gagal!");
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
