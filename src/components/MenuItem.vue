<template>
    <div class="menu-content"></div>
</template>

<script>
export default {
    name: 'MenuItem',
    components: {
    }
}
</script>

<style scoped>
.menu-content{
    width: var(--menu-width);
    height: 100%;
    transition: width 0.3s ease-in-out;
}
</style>