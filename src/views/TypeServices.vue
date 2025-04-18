<template>
    <div class="flex h-screen bg-gray-100">
        <Sidebar />
        <div class="flex-1 p-8 flex flex-col overflow-hidden">
            <Header :user="user" @logout="logout" />

            <div class="bg-white shadow-md rounded-lg overflow-y-auto mt-6">
                <div class="p-6">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Jenis Layanan</h2>
                    <router-link to="/type-services/create"
                        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-block mb-4">
                        <i class="fas fa-plus mr-2"></i> Tambah Jenis
                    </router-link>

                    <div class="overflow-x-auto">
                        <table class="min-w-full leading-normal">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th
                                        class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Nama Jenis Layanan
                                    </th>
                                    <th
                                        class="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="type in typeServices" :key="type.id" class="hover:bg-gray-50">
                                    <td class="px-5 py-3 border-b border-gray-200 text-sm">
                                        <div class="pl-8">
                                            <p class="text-gray-900 whitespace-no-wrap">{{ type.name }}</p>
                                        </div>
                                    </td>
                                    <td class="px-5 py-3 border-b border-gray-200 text-center text-sm">
                                        <div class="inline-flex space-x-2">
                                            <button @click="deleteTypeService(type.id)"
                                                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-xs">
                                                <i class="fas fa-trash-can mr-2"></i> Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="typeServices.length === 0">
                                    <td colspan="2"
                                        class="px-5 py-5 border-b border-gray-200 text-sm text-gray-500 text-center">
                                        Tidak ada data jenis layanan.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
            typeServices: [], // Array untuk menyimpan data jenis layanan
        };
    },
    async created() {
        try {
            const response = await axios.get("/user/profile", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            this.user = response.data;
            this.fetchTypeServices(); // Panggil method untuk mengambil data jenis layanan
        } catch (error) {
            localStorage.removeItem("token");
            this.$router.push("/login");
        }
    },
    methods: {
        async fetchTypeServices() {
            try {
                const response = await axios.get("/type-services", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                this.typeServices = response.data;
            } catch (error) {
                console.error("Gagal mengambil data jenis layanan:", error);
            }
        },

        async fetchFilteredServices() {
            try {
                let url = "/services";
                if (this.selectedTypeId) {
                    url = `/services/type/${this.selectedTypeId}`;
                }
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                this.services = response.data;
            } catch (error) {
                console.error("Gagal memfilter services:", error);
            }
        },

        async deleteTypeService(id) {
            if (!confirm("Yakin ingin menghapus jenis layanan ini?")) return;
            try {
                await axios.delete(`/type-services/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                this.typeServices = this.typeServices.filter(type => type.id !== id);
            } catch (error) {
                console.error("Gagal menghapus jenis layanan:", error);
            }
        },
    },
};
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>