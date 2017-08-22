<template>
    <div><hello></hello></div>
</template>

<script>
import hello from './Hello.vue';

export default {
    components: {
        hello
    }
}
</script>

<style lang="sass" scoped>
$bg: green

div
    background: $bg

</style>