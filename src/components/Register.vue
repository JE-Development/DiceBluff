<template>

<div class="center full-size">
    <div style="margin-bottom: 300px">
        <div class="center-horizontal">
            <h1>Dice Bluff</h1>
        </div>
        <div>
            <input
                ref="usernameinput"
                :value="username"
                placeholder="Nutzername"
                class="register-input"/>
        </div>
        <div style="margin-top: 10px"/>
        <div>
            <input
                ref="passinput"
                :value="pass"
                placeholder="Passwort"
                class="register-input"/>
        </div>
        <div style="margin-top: 10px"/>
        <div class="button-layout center-horizontal">
            <button class="register-button center-horizontal" @click="onClickJoin">
                <p style="margin-top: 5px">Spiel beitreten</p>
            </button>
        </div>
    </div>
</div>

</template>


<script>
import {Engine} from "@/components/code/Engine";

export default {
    //npm run dev | npm run build
    name: "Register",
    data() {
        return {
            username: "",
            pass: "",
            engine: new Engine()
        };
    },

    created() {

    },
    mounted() {
        this.username = this.getCookies("username")
        this.pass = this.getCookies("pass")
    },
    methods: {
        onClickJoin(){
            let username = this.$refs.usernameinput.value;
            let pass = this.$refs.passinput.value;

            if(pass === "lost mafia"){
                this.setCookies("username", username)
                this.setCookies("pass", pass)
                this.setCookies("host", "false")

                this.registerPlayer()

                this.$router.push('/player');
            }else if(pass === "lost mafia host"){
                this.setCookies("username", username)
                this.setCookies("pass", pass)
                this.setCookies("host", "true")

                this.registerPlayer()

                this.$router.push('/player');
            }
        },

        registerPlayer(){
            this.engine.registerPlayer(this.getCookies("username"))
        },

        getCookies(key){
            return this.$cookies.get(key);
        },
        setCookies(key, value){
            return this.$cookies.set(key, value, 2147483647);
        },
    }
}
</script>