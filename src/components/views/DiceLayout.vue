<template>

    <div>
        <div class="flex">
            <Dice
                    v-for="(dat) in line1"
                    :num="dat"
                    mode="1"
            />
        </div>
        <div class="flex">
            <Dice
                    v-for="(dat) in line2"
                    :num="dat"
                    mode="2"
            />
        </div>
        <div class="flex">
            <Dice
                    v-for="(dat) in line3"
                    :num="dat"
                    mode="3"
            />
        </div>
        <div class="flex">
            <Dice
                    v-for="(dat) in line4"
                    :num="dat"
                    mode="4"
            />
        </div>
        <div class="flex">
            <Dice
                    v-for="(dat) in line5"
                    :num="dat"
                    mode="5"
            />
        </div>
        <div class="flex">
            <Dice
                v-for="(dat) in line51"
                :num="dat"
                mode="5"
            />
        </div>
        <div class="flex">
            <Dice
                    v-for="(dat) in line6"
                    :num="dat"
                    mode="6"
            />
        </div>
    </div>

</template>


<script>
import Dice from "@/components/views/Dice.vue";
import PlayerView from "@/components/views/PlayerView.vue";

export default {
    name: "DiceLayout",
    components: {PlayerView, Dice},
    data() {
        return {
          line1: [],
          line2: [],
          line3: [],
          line4: [],
          line5: [],
          line51: [],
          line6: [],
        };
    },

    props:{
    },

    created() {
        this.line1.push("31")
        this.line1.push("32")

        this.line2.push("41")
        this.line2.push("42")
        this.line2.push("43")

        this.line3.push("51")
        this.line3.push("52")
        this.line3.push("53")
        this.line3.push("54")

        this.line4.push("61")
        this.line4.push("62")
        this.line4.push("63")
        this.line4.push("64")
        this.line4.push("65")

        this.line5.push("1 Pasch")
        this.line5.push("2 Pasch")
        this.line5.push("3 Pasch")
        this.line51.push("4 Pasch")
        this.line51.push("5 Pasch")
        this.line51.push("6 Pasch")

        this.line6.push("21")
    },
    mounted() {

    },
    methods: {


        getCookies(key){
            return this.$cookies.get(key);
        },
        setCookies(key, value){
            return this.$cookies.set(key, value, 2147483647);
        },
    }
}
</script>