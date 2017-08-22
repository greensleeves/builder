<template>
<div @click="go">
    <div v-once>hello gyus, I'm <p> {{name}}!</p></div>
    <ul>
        <li v-for="name in filteredList">{{name}}</li>
    </ul>
</div>
</template>

<script>

import Rx from 'rxjs/Rx';

export default {
    data() {
        return {
            name: 'Vue',
            list: []
        }
    },
    computed: {
        filteredList() {

            return this.list.filter(item => item > 1)

        }
    },
    methods: {
        go() {

            this.list.push(6);

        }
    },
    created() {

        Rx.Observable.of(1, 2, 3).subscribe(item => this.list.push(item));

    }
}

</script>

<style lang="sass" scoped>
$color: tomato

div
    color: $color

    p
        font-weight: bold
        color: black

</style>