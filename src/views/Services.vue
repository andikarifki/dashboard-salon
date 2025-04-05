<template>
    <div class="flex h-screen">
        <Sidebar />
        <div class="flex-1 p-6 flex flex-col">
            <Header :user="user" @logout="logout" />

            <h2 class="text-2xl font-bold">Services </h2>


            <router-link to="/services/create"
                class="bg-blue-500 text-white text-center px-2 py-1 rounded mt-4 inline-block max-w-20">
                Tambah
            </router-link>

            <div class="overflow-x-auto mt-6">
                <table class="min-w-full table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border-b px-4 py-2">Nama Service</th>
                            <th class="border-b px-4 py-2">Deskripsi</th>
                            <th class="border-b px-4 py-2">Harga</th>
                            <th class="border-b px-4 py-2">Jenis Layanan</th>
                            <th class="border-b px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="service in services" :key="service.id">
                            <td class="border-b px-4 py-2">{{ service.name }}</td>
                            <td class="border-b px-4 py-2 break-words">{{ service.description }}</td>
                            <td class="border-b px-4 py-2">Rp {{ service.price }}</td>
                            <td class="border-b px-4 py-2">{{ service.type_service.name }}</td>
                            <td class="border-b px-4 py-2 text-center ">
                                <router-link :to="`/services/edit/${service.id}`"
                                    class="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</router-link>
                                <button @click="deleteService(service.id)"
                                    class="bg-red-500 text-white px-3 py-1 rounded mr-2">Hapus</button>
                                <button @click="viewServiceDetail(service)"
                                    class="bg-blue-500 text-white px-3 py-1 rounded">Detail</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="showDetail" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded shadow-lg w-96 text-center">
                    <h3 class="text-lg font-bold mb-4">Detail Service</h3>
                    <div v-if="currentService.image">
                        <img v-if="currentService.image" :src="currentService.image" alt="Image"
                            class="mt-4 w-full h-auto" />
                    </div>
                    <table class="mt-4 w-full">
                        <tbody>
                            <tr>
                                <td class="py-2 px-4 font-semibold text-left w-32">Nama Service:</td>
                                <td class="py-2 px-4 text-left">{{ currentService?.name }}</td>
                            </tr>

                            <tr>
                                <td class="py-2 px-4 font-semibold text-left w-40">Deskripsi:</td>
                                <td class="py-2 px-4 text-left">{{ currentService?.description }}</td>
                            </tr>

                            <tr>
                                <td class="py-2 px-4 font-semibold text-left w-28">Harga:</td>
                                <td class="py-2 px-4 text-left">Rp{{ currentService?.price }}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-semibold text-left w-28">Jenis Layanan:</td>
                                <td class="py-2 px-4 text-left">{{ currentService?.type_service.name }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button @click="showDetail = false"
                        class="bg-gray-400 text-white px-4 py-2 rounded ml-2 mt-2">Tutup</button>
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
        Header,
    },
    data() {
        return {
            user: {},
            services: [],
            showDetail: false,
            currentService: null,
        };
    },
    async created() {
        try {
            const response = await axios.get("/user/profile", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            this.user = response.data;
            this.fetchServices();
        } catch (error) {
            localStorage.removeItem("token");
            this.$router.push("/login");
        }
    },
    methods: {
        async fetchServices() {
            try {
                const response = await axios.get("/services", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                this.services = response.data;
            } catch (error) {
                console.error("Gagal mengambil data services:", error);
            }
        },

        async viewServiceDetail(service) {
            try {
                const response = await axios.get(`/services/${service.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                this.currentService = response.data;
                this.showDetail = true;
                console.log("Gambar yang diterima:", this.currentService.image);
            } catch (error) {
                console.error("Gagal mengambil detail service:", error);
            }
        },

        async deleteService(id) {
            if (!confirm("Yakin ingin menghapus service ini?")) return;
            try {
                await axios.delete(`/services/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                this.services = this.services.filter(service => service.id !== id);
            } catch (error) {
                console.error("Gagal menghapus service:", error);
            }
        },
    },
};
</script>