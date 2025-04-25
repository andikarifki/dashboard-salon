<template>
    <div class="flex h-screen">
        <Sidebar />
        <div class="flex-1 p-6 flex flex-col">
            <Header :user="user" @logout="logout" />

            <h2 class="text-2xl font-bold">Image</h2>
            <div class="overflow-x-auto mt-6">
                <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="bg-white shadow rounded-lg p-6">
                        <div class="flex items-center justify-between">
                            <div class="text-gray-700 font-semibold">Carousel Images</div>
                            <button @click="fetchCarouselImages"
                                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Refresh
                            </button>
                        </div>
                        <div class="mt-4" v-if="carouselImages.length > 0">
                            <div v-for="image in carouselImages" :key="image.id" class="mb-2">
                                <img :src="image.url" alt="Carousel Image" class="rounded"
                                    style="max-width: 200px; height: auto;">
                                <p class="text-sm text-gray-500">
                                    URL: {{ image.url }}
                                </p>
                            </div>
                        </div>
                        <div v-else class="mt-4 text-gray-500">No carousel images available.</div>
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
        Header,
    },
    data() {
        return {
            user: {},
            carouselImages: [], // Array to store carousel images
        };
    },
    async created() {
        this.fetchCarouselImages();
    },
    methods: {
        async fetchCarouselImages() {
            try {
                const response = await axios.get("/carousel");
                this.carouselImages = response.data.data;
            } catch (error) {
                console.error("Error fetching carousel images:", error);
                this.carouselImages = [];
            }
        },
        logout() {
            localStorage.removeItem("token");
            this.$router.push("/login");
        },
    },
};
</script>