import { createRouter, createWebHashHistory } from 'vue-router'
import type {RouteRecordRaw} from 'vue-router';
import GamePage from "../components/GamePage.vue";
import Register from "../components/Register.vue";
import PlayerPage from "../components/PlayerPage.vue";
import InstructionPage from "@/components/InstructionPage.vue";
import PublicPage from "@/components/PublicPage.vue";
import Dashboard from "@/components/Dashboard.vue";
import BotPage from "@/components/BotPage.vue";
import JoinWithCode from "@/components/JoinWithCode.vue";

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
    {
        path: '/instruction',
        name: 'InstructionPage',
        component: InstructionPage
    },
    {
        path: '/public',
        name: 'PublicPage',
        component: PublicPage
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/bot',
        name: 'BotPage',
        component: BotPage
    },
    {
        path: '/code/:rc',
        name: 'JoinWithCode',
        component: JoinWithCode
    },


]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router