<template>
<div>
    <button @click="trigger">Показать!</button>
    <div v-if="show">
        <inner-comp></inner-comp>
    </div>
</div>
</template>

<script>

export default {
    data() {
        return {
            show: false
        }
    },
    components: {
        'inner-comp': () => import('./InnerComp.vue')
    },
    methods: {
        trigger() {

            this.show = !this.show;

        }
    }
}

</script>

<style lang="sass" scoped>

$color: black

div
    color: $color

</style>