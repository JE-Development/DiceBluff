<template>

    <div class="center-horizontal">
        <button :class="setClass" ref="border" @click="click" v-if="mode !== '6'">
            {{ num }}
        </button>
        <button class="dice-border-m dice-line6" ref="border" @click="click" v-else>
            {{ num }}
        </button>
        <button class="absolute on-bottom" :class="setClass" ref="border" @click="click" v-if="mode !== '6'">
            {{ num }}
        </button>
        <button class="dice-border-m dice-line6 absolute on-bottom" ref="border" @click="click" v-else>
            {{ num }}
        </button>
    </div>

</template>


<script>

import EventBus from "@/components/code/EventBusEvent";

export default {
    name: "Dice",
    data() {
        return {
            baseClass: "dice-border",
            setClass: ""
        };
    },

    props: {
        num: String,
        mode: String,

    },

    created() {
        this.setClass = this.baseClass
    },
    mounted() {
        this.setClasses()
    },

    updated() {
        console.log("updated")
        this.setClasses()
    },

    methods: {

        click() {
            EventBus.emit('dice-num', this.num)
            EventBus.emit('dice-mode', this.mode)
        },

        setClasses() {
            if (this.mode === "1") {
                this.setClass = this.baseClass + " dice-line1"
            } else if (this.mode === "2") {
                this.setClass = this.baseClass + " dice-line2"
            } else if (this.mode === "3") {
                this.setClass = this.baseClass + " dice-line3"
            } else if (this.mode === "4") {
                this.setClass = this.baseClass + " dice-line4"
            } else if (this.mode === "5") {
                this.setClass = this.baseClass + " dice-line5"
            }
        },


        getCookies(key) {
            return this.$cookies.get(key);
        },
        setCookies(key, value) {
            return this.$cookies.set(key, value, 2147483647);
        },
    }
}
</script>