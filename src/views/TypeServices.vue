<template>
    <div class="flex h-screen">
        <Sidebar />
        <div class="flex-1 p-6 flex flex-col">
            <Header :user="user" @logout="logout" />

            <h2 class="text-2xl font-bold mb-4">Type Services</h2>
            <router-link to="/type-services/create"
                class="bg-blue-500 text-white text-center px-2 py-1 rounded mt-4 inline-block w-24">
                Tambah
            </router-link>

            <div class="overflow-x-auto mt-6">
                <table class="min-w-full table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border-b px-4 py-2">
                                Nama Jenis Layanan</th>
                            <th class="border-b px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="type in typeServices" :key="type.id">
                            <td class="border-b px-4 py-2">
                                <div class="flex justify-normal pl-8">
                                    {{ type.name }}
                                </div>
                            </td>
                            <td class="border-b px-4 py-2">
                                <div class="flex justify-center">
                                    <button @click="deleteTypeService(type.id)"
                                        class="bg-red-500 text-white px-3 py-1 rounded">Hapus
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
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