<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded shadow-lg w-96">
            <h3 class="text-lg font-bold mb-4">Tambah Service Baru</h3>
            <form @submit.prevent="handleSubmit">
                <input v-model="formData.name" placeholder="Nama Service" class="border p-2 rounded w-full mb-2"
                    required />
                <input v-model="formData.description" placeholder="Deskripsi Service"
                    class="border p-2 rounded w-full mb-2" required />
                <input v-model="formData.price" placeholder="Harga Service" type="number"
                    class="border p-2 rounded w-full mb-2" required />
                <input type="file" @change="handleImageUpload" class="border p-2 rounded w-full mb-2" />
                <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded w-full">Tambah Service</button>
                <button @click="$emit('close')" type="button"
                    class="bg-gray-500 text-white px-4 py-2 rounded w-full mt-2">Batal</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'CreateServiceForm',
    data() {
        return {
            formData: {
                name: '',
                description: '',
                price: '',
                image: null,
            },
        };
    },
    methods: {
        handleImageUpload(event) {
            this.formData.image = event.target.files[0];
            console.log('File dipilih di CreateForm:', this.formData.image);
        },
        async handleSubmit() {
            try {
                const formData = new FormData();
                formData.append('name', this.formData.name);
                formData.append('description', this.formData.description);
                formData.append('price', this.formData.price);

                if (this.formData.image) {
                    formData.append('image', this.formData.image);
                }

                const response = await axios.post('/services', formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                this.$emit('serviceAdded', response.data);
                this.$emit('close');
            } catch (error) {
                console.error('Gagal menambah service di CreateForm:', error.response?.data || error);
                // Tambahkan logika error handling sesuai kebutuhan Anda
            }
        },
    },
};
</script>

<style scoped>
/* Gaya khusus untuk CreateServiceForm jika diperlukan */
</style>