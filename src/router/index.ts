import { createRouter, createWebHashHistory } from 'vue-router'
import type {RouteRecordRaw} from 'vue-router';
import GamePage from "../components/GamePage.vue";
import Register from "../components/Register.vue";
import PlayerPage from "../components/PlayerPage.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Register',
        component: Register
    },
    {
        path: '/player',
        name: 'PlayerPage',
        component: PlayerPage
    },
    {
        path: '/game',
        name: 'GamePage',
        component: GamePage
    },


]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router