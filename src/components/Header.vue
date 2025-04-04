<template>
    <div class="flex justify-between items-center mb-4">
        <div>
            <p class="text-lg">Selamat datang, {{ user.name }}!</p>
        </div>
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
        logout() {
            this.$emit('logout');
        },
    },
};
</script>

<style scoped>
/* Anda bisa menambahkan style khusus untuk header ini di sini */
</style>