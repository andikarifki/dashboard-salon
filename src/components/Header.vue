<template>
    <div class="flex justify-end mb-4">
        <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
</template>

<script>
export default {
    name: 'Header',
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    methods: {
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

<style scoped>
/* Anda bisa menambahkan style khusus untuk header ini di sini */
</style>