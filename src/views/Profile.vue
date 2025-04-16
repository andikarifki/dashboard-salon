<template>
    <div class="flex h-screen">
        <Sidebar />
        <div class="flex-1 p-6 flex flex-col">
            <Header :user="loggedInUser" @logout="logout" />

            <h2 class="text-2xl font-bold mb-4">Profil Pengguna</h2>

            <div v-if="loading">
                Memuat data profil...
            </div>
            <div v-else-if="error">
                Terjadi kesalahan saat memuat profil: {{ error }}
            </div>
            <div v-else-if="profile">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-xl font-semibold mb-4">Informasi Akun</h3>
                    <div class="mb-2">
                        <label class="block text-gray-700 text-sm font-bold mb-1">Nama:</label>
                        <p class="text-gray-800">{{ profile.name }}</p>
                    </div>
                    <div class="mb-2">
                        <label class="block text-gray-700 text-sm font-bold mb-1">Email:</label>
                        <p class="text-gray-800">{{ profile.email }}</p>
                    </div>
                    <div class="mb-2" v-if="profile.role">
                        <label class="block text-gray-700 text-sm font-bold mb-1">Role:</label>
                        <p class="text-gray-800">{{ profile.role }}</p>
                    </div>

                    <!-- <router-link to="/profile/edit"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 inline-block">
                        Edit Profil
                    </router-link> -->
                </div>
            </div>
            <div v-else>
                Tidak ada data profil yang ditemukan.
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
        Header,
    },
    data() {
        return {
            loggedInUser: {}, // Data pengguna yang sedang login (dari Header)
            profile: null, // Data profil pengguna yang dilihat
            loading: false,
            error: null,
        };
    },
    async created() {
        this.fetchProfile();
    },
    methods: {
        async fetchProfile() {
            this.loading = true;
            this.error = null;
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    this.$router.push('/login');
                    return;
                }
                const response = await axios.get('http://localhost:8000/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.profile = response.data;
                this.loggedInUser = response.data; // Asumsi data profil sama dengan data pengguna header
                this.loading = false;
            } catch (error) {
                console.error('Gagal memuat profil:', error);
                this.error = 'Gagal memuat data profil.';
                this.loading = false;
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    this.$router.push('/login');
                }
            }
        },
        async logout() {
            try {
                await axios.post("/api/user/logout", {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                localStorage.removeItem("token");
                this.$router.push("/login");
            } catch (error) {
                console.error("Logout error:", error);
            }
        },
    },
};
</script>

<style scoped>
/* Style khusus untuk halaman profil */
</style>