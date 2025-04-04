<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 p-6 flex flex-col">
      <h2 class="text-2xl font-bold">Dashboard</h2>

      <Header :user="user" @logout="logout" />

      <div class="overflow-x-auto mt-6">
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center justify-between">
              <div class="text-gray-700 font-semibold">Total Pengguna</div>
              <div class="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-semibold">
              </div>
            </div>
            <div class="mt-2 text-gray-500 text-sm">Informasi jumlah total pengguna terdaftar.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Sidebar from "../components/Sidebar.vue";
import Header from "../components/Header.vue";

export default {
  components: {
    Sidebar,
    Header
  },
  data() {
    return {
      user: {},
    };
  },
  async created() {
    try {
      const response = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      this.user = response.data;
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
  },
};
</script>