<template>
    <div class="flex h-screen">
        <Sidebar />
        <div class="flex-1 p-6 flex flex-col">

            <Header :user="user" @logout="logout" />
            <h2 class="text-2xl font-bold mb-4">Tambah Service Baru</h2>
            <div class="bg-white p-6 rounded shadow-md mt-4">
                <input v-model="newService.name" placeholder="Nama Service" class="border p-2 rounded w-full mb-2" />
                <textarea v-model="newService.description" placeholder="Deskripsi Service"
                    class="border p-2 rounded w-full mb-2"></textarea>
                <input v-model="newService.price" placeholder="Harga Service" type="number"
                    class="border p-2 rounded w-full mb-2" />
                <select v-model="newService.id_type" class="border p-2 rounded w-full mb-2">
                    <option value="" disabled>Pilih Jenis Layanan</option>
                    <option v-for="type in serviceTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                </select>
                <input type="file" @change="handleImageUpload" class="border p-2 rounded w-full mb-2"
                    accept="image/*" />
                <img v-if="imagePreview" :src="imagePreview" alt="Pratinjau Gambar" class="mt-2 max-h-40 w-auto" />

                <button @click="submitForm" class="bg-green-500 text-white px-4 py-2 rounded">Simpan Service</button>
                <button @click="$router.push('/services')"
                    class="bg-gray-400 text-white px-4 py-2 rounded ml-2">Batal</button>
                <div v-if="formError" class="text-red-500 mt-2">{{ formError }}</div>
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
            newService: {
                name: '',
                description: '',
                price: null,
                id_type: '',
                image: null,
            },
            serviceTypes: [],
            imagePreview: null,
            formError: null,
        };
    },
    async created() {
        try {
            const response = await axios.get("/user/profile", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            this.user = response.data;
            this.fetchServiceTypes();
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

        handleImageUpload(event) {
            const file = event.target.files[0];
            this.newService.image = file;
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                this.imagePreview = null;
            }
        },

        async submitForm() {
            try {
                const formData = new FormData();
                formData.append('name', this.newService.name);
                formData.append('description', this.newService.description);
                formData.append('price', this.newService.price);
                formData.append('id_type', this.newService.id_type);
                if (this.newService.image) {
                    formData.append('image', this.newService.image);
                }

                const response = await axios.post('/services', formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                this.$router.push('/services'); // Redirect ke halaman daftar layanan setelah berhasil
                this.resetForm();
                this.formError = null;
            } catch (error) {
                console.error('Gagal menambahkan service:', error.response?.data || error);
                this.formError = 'Terjadi kesalahan saat menambahkan service.';
            }
        },

        resetForm() {
            this.newService = { name: '', description: '', price: null, id_type: '', image: null };
            this.imagePreview = null;
            this.formError = null;
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