<template>
    <div class="flex h-screen">
        <Sidebar />
        <div class="flex-1 p-6 flex flex-col">
            <Header :user="user" @logout="logout" />

            <h2 class="text-2xl font-bold mb-4">Edit Service</h2>

            <div class="bg-white p-6 rounded shadow-md mt-4" v-if="editingService">
                <input v-model="editingService.name" placeholder="Nama Service"
                    class="border p-2 rounded w-full mb-2" />
                <textarea v-model="editingService.description" placeholder="Deskripsi Service"
                    class="border p-2 rounded w-full mb-2"></textarea>
                <input v-model="editingService.price" placeholder="Harga Service" type="number"
                    class="border p-2 rounded w-full mb-2" />

                <select v-if="serviceTypes.length > 0 && editingService" v-model="editingService.id_type"
                    class="border p-2 rounded w-full mb-2">
                    <option value="" disabled>Pilih Jenis Layanan</option>
                    <option v-for="type in serviceTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                </select>

                <input type="file" @change="handleImageUpload" class="border p-2 rounded w-full mb-2"
                    accept="image/*" />
                <img v-if="imagePreview" :src="imagePreview" alt="Pratinjau Gambar Baru"
                    class="mt-2 max-h-40 w-auto mb-4" />
                <img v-else-if="editingService.image" :src="editingService.image" alt="Gambar Saat Ini"
                    class="mt-2 max-h-40 w-auto mb-4" />

                <button @click="updateService" class="bg-green-500 text-white px-4 py-2 rounded">Update Service</button>
                <button @click="$router.push('/services')"
                    class="bg-gray-400 text-white px-4 py-2 rounded ml-2">Batal</button>
                <div v-if="formError" class="text-red-500 mt-2">{{ formError }}</div>
            </div>
            <div v-else>
                Loading service details...
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
            editingService: null,
            imagePreview: null,
            formError: null,
            serviceTypes: [], // Tambahkan array untuk menyimpan jenis layanan
        };
    },
    async created() {
        try {
            const response = await axios.get("/user/profile", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            this.user = response.data;
            await this.fetchServiceTypes(); // Ambil data jenis layanan
            await this.fetchService();
        } catch (error) {
            localStorage.removeItem("token");
            this.$router.push("/login");
        }
    },
    methods: {
        async fetchServiceTypes() {
            try {
                const response = await axios.get('/type-services', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                this.serviceTypes = response.data;
            } catch (error) {
                console.error('Gagal mengambil jenis layanan:', error);
            }
        },

        async fetchService() {
            const serviceId = this.$route.params.id;
            try {
                const response = await axios.get(`/services/${serviceId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                this.editingService = { ...response.data };
            } catch (error) {
                console.error("Gagal mengambil detail service untuk edit:", error);
                this.$router.push('/services'); // Redirect kembali jika gagal mengambil data
            }
        },

        handleImageUpload(event) {
            const file = event.target.files[0];
            this.editingService.newImage = file;
            this.imagePreview = file ? URL.createObjectURL(file) : null;
        },

        async updateService() {
            try {
                const formData = new FormData();
                formData.append("name", this.editingService.name);
                formData.append("description", this.editingService.description);
                formData.append("price", this.editingService.price);
                formData.append("id_type", this.editingService.id_type); // Pastikan id_type juga dikirim
                if (this.editingService.newImage) {
                    formData.append("image", this.editingService.newImage);
                }

                await axios.post(`/services/${this.$route.params.id}?_method=PUT`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                this.$router.push('/services'); // Redirect kembali ke daftar layanan setelah berhasil update
                this.formError = null;
            } catch (error) {
                console.error("Gagal mengupdate service:", error.response?.data || error);
                this.formError = 'Terjadi kesalahan saat mengupdate service.';
            }
        },
    },
};
</script>