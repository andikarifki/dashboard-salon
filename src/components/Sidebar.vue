<template>
    <aside class="bg-gray-800 text-white w-64 p-4">
        <h2 class="text-xl font-bold mb-4">Cantik Salon</h2>
        <ul>
            <li class="mb-2">
                <router-link to="/dashboard" class="block hover:bg-gray-700 p-2 rounded">Dashboard</router-link>
            </li>
            <li class="mb-2">
                <router-link to="/services" class="block hover:bg-gray-700 p-2 rounded">Services</router-link>
            </li>
            <li class="mb-2">
                <router-link to="/user" class="block hover:bg-gray-700 p-2 rounded">Users</router-link>
            </li>
        </ul>
    </aside>
</template>

<script>
export default {
    name: 'Sidebar', // Tambahkan nama komponen
};
</script>