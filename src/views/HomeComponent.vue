<template>
    <v-app>
        <v-template>
            <GameListComponent :games="gameList" />
        </v-template>
    </v-app>
</template>

<script>
import GameListComponent from '@/components/GameListComponent.vue';
import axios from 'axios';
export default {
    components: {
        GameListComponent
    },
    data() {
        return {
            gameList: []
        };
    },
    async created() {
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/list`);
            this.gameList = response.data.result;
            console.log(this.gameList)
        } catch (e) {
            console.error("정보가 존재하지 않습니다", e);
        }
    }
}
</script>
