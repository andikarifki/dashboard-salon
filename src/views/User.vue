<template>
    <div class="flex h-screen">
        <Sidebar />
        <div class="flex-1 p-6 flex flex-col">
            <h2 class="text-2xl font-bold">User</h2>
            <div class="mb-4 flex justify-end">
                <router-link to="/register"
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Tambah Akun
                </router-link>
            </div>
            <div class="overflow-x-auto mt-6">
                <div v-if="loading">Memuat data...</div>
                <div v-else-if="error">Terjadi kesalahan saat memuat data: {{ error }}</div>
                <table class="min-w-full table-auto border-collapse border border-gray-200" v-else>
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border-b px-4 py-2 text-center">ID</th>
                            <th class="border-b px-4 py-2 text-center">Nama</th>
                            <th class="border-b px-4 py-2 text-center">Email</th>
                            <th class="border-b px-4 py-2 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td class="border-b px-4 py-2 text-center">{{ user.id }}</td>
                            <td class="border-b px-4 py-2 text-center">{{ user.name }}</td>
                            <td class="border-b px-4 py-2 text-center">{{ user.email }}</td>
                            <td class="border-b px-4 py-2 text-center">
                                <button @click="deleteUser(user.id)"
                                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment'; // Anda perlu menginstal moment.js jika ingin format tanggal yang lebih baik
import Sidebar from '../components/Sidebar.vue';

export default {
    components: {
        Sidebar
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
                const response = await axios.get('http://localhost:8000/api/users');
                this.users = response.data;
            } catch (err) {
                this.error = err.message;
                console.error('Gagal memuat data pengguna:', err);
            } finally {
                this.loading = false;
            }
        },
        async deleteUser(userId) {
            if (confirm(`Apakah Anda yakin ingin menghapus pengguna dengan ID ${userId}?`)) {
                try {
                    await axios.delete(`http://localhost:8000/api/users/${userId}`);
                    // Setelah berhasil menghapus, perbarui daftar pengguna
                    this.fetchUsers();
                    alert('Pengguna berhasil dihapus.');
                } catch (error) {
                    this.error = error.message;
                    console.error('Gagal menghapus pengguna:', error);
                    alert('Gagal menghapus pengguna.');
                }
            }
        },
        formatDate(dateString) {
            if (!dateString) return '';
            return moment(dateString).format('YYYY-MM-DD HH:mm:ss');
        },
    },
};
</script>