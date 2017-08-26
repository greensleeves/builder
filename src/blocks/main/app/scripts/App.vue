<template>
    <div>
        <button @click="triggerComponent">{{computedTriggerMsg}} компонент</button>
        <div v-if="showComp">
            <hello></hello>
        </div>
    </div>
</template>

<script>
// import hello from '../../hello/scripts/Hello.vue';

export default {
    data: {
        triggerMsg: ['Показать', 'Скрыть'],
        showComp: false,
        hi: 1
    },

    computed: {

        computedTriggerMsg() {

            return !this.showComp ? this.triggerMsg[0] : this.triggerMsg[1]

        }

    },

    methods: {
        triggerComponent(event) {

            console.log(this.hi);

            this.showComp = !this.showComp;

        }
    },

    components: {
        hello: () => import('../../hello/scripts/Hello.vue')
    }
}
</script>

<style lang="sass" scoped>
$bg: #ccc

div
    background: $bg

</style>