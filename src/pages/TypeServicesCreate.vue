<template>
    <div class="flex h-screen">
        <Sidebar />
        <div class="flex-1 p-6 flex flex-col">
            <h2 class="text-2xl font-bold mb-4">Tambah Jenis Layanan Baru</h2>

            <Header :user="user" @logout="logout" />

            <div class="bg-white p-6 rounded shadow-md mt-4">
                <form @submit.prevent="createTypeService">
                    <div class="mb-4">
                        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nama Jenis Layanan:</label>
                        <input type="text" id="name" v-model="name"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Contoh: Potong Rambut, Pewarnaan, dll." required>
                        <div v-if="error" class="text-red-500 text-xs italic">{{ error }}</div>
                    </div>
                    <div class="flex items-center justify-between">
                        <button type="submit"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Simpan
                        </button>
                        <button type="button" @click="$router.push('/type-services')"
                            class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Batal
                        </button>
                    </div>
                </form>
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
            name: '',
            error: null,
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
        async createTypeService() {
            try {
                const response = await axios.post('/type-services', { name: this.name }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                console.log('Jenis layanan berhasil ditambahkan:', response.data);
                this.$router.push('/type-services'); // Redirect ke halaman daftar jenis layanan
            } catch (error) {
                console.error('Gagal menambahkan jenis layanan:', error.response ? error.response.data : error);
                this.error = error.response && error.response.data && error.response.data.errors && error.response.data.errors.name
                    ? error.response.data.errors.name[0]
                    : 'Terjadi kesalahan saat menambahkan jenis layanan.';
            }
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