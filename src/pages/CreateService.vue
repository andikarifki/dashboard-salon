<template>
    <div class="flex h-screen bg-gray-100">
        <Sidebar />
        <div class="flex-1 p-8 flex flex-col overflow-y-auto">
            <Header :user="user" @logout="logout" />
            <div class="bg-white shadow-md rounded-lg p-8 mt-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-6">Tambah Service Baru</h2>
                <div class="space-y-4">
                    <div>
                        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nama Service</label>
                        <input v-model="newService.name" id="name" type="text"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nama Service">
                    </div>
                    <div>
                        <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Deskripsi
                            Service</label>
                        <textarea v-model="newService.description" id="description"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Deskripsi Service" maxlength="80"></textarea>
                        <p class="text-gray-500 text-xs italic">Maksimal 80 karakter</p>
                    </div>
                    <div>
                        <label for="price" class="block text-gray-700 text-sm font-bold mb-2">Harga Service</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 sm:text-sm">Rp</span>
                            </div>
                            <input v-model="newService.price" id="price" type="number"
                                class="shadow appearance-none border rounded w-full py-2 pl-7 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Harga Service">
                        </div>
                    </div>
                    <div>
                        <label for="type" class="block text-gray-700 text-sm font-bold mb-2">Jenis Layanan</label>
                        <select v-model="newService.id_type" id="type"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option value="" disabled>Pilih Jenis Layanan</option>
                            <option v-for="type in serviceTypes" :key="type.id" :value="type.id">{{ type.name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label for="image" class="block text-gray-700 text-sm font-bold mb-2">Gambar Service</label>
                        <input type="file" id="image" @change="handleImageUpload"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            accept="image/*">
                        <img v-if="imagePreview" :src="imagePreview" alt="Pratinjau Gambar"
                            class="mt-4 max-h-40 w-auto rounded-md" />
                    </div>
                    <div class="flex items-center justify-start space-x-4">
                        <button @click="submitForm"
                            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Simpan Service
                        </button>
                        <button @click="$router.push('/services')"
                            class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Batal
                        </button>
                    </div>
                    <div v-if="formError" class="text-red-500 text-sm italic mt-2">{{ formError }}</div>
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