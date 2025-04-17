<template>
    <div class="flex justify-end mb-4 relative">
        <button @click="toggleDropdown" class="focus:outline-none">
            <div class="flex items-center">
                <i class="fa-solid fa-user mr-2"></i><span>{{ user.username || user.name || 'Pengguna' }}</span>
                <svg class="fill-current h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                </svg>
            </div>
        </button>
        <div v-if="isDropdownOpen" class="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
            <router-link to="/profile" class="block px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none">
                Profil Saya
            </router-link>
            <button @click="logout"
                class="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 focus:outline-none">
                Logout
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'; // Pastikan axios sudah terinstall

export default {
    name: 'HeaderWithDropdown',
    data() {
        return {
            isDropdownOpen: false,
            user: {}, // Inisialisasi user sebagai objek kosong
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
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
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

<style scoped>
/* Anda bisa menambahkan style khusus untuk header ini di sini */
</style>