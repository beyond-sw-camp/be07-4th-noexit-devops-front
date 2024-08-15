<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col>
                    <h2 class="font-weight-bold">WishList({{ wishGameList.length }})</h2>
                    <v-divider></v-divider>
                    <GameListComponent :games="wishGameList" />
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import GameListComponent from '@/components/GameListComponent.vue'
import axios from 'axios';

export default {
    components: {
        GameListComponent,
    },
    data() {
        return {
            wishlist: [],
            wishGameList: [],
            gameList: []
        };
    },
    // created() {
    //     this.fetchWishlist();
    // },
    methods: {
        async fetchWishlist() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/wishlist`);
                this.wishlist = response.data.result;
                console.log(this.wishlist)
                const gameInfo = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/list`);
                this.gameList = gameInfo.data.result;
                // 위시리스트 받아와서 gameId들 조회
                // 그 번호 아이디인 놈들을 
            } catch (e) {
                console.error("정보가 존재하지 않습니다", e);
            }
        }
    },
    mounted() {
        this.fetchWishlist();
    }
};
</script>
