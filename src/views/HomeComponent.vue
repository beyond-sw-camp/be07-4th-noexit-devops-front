<template>
    <v-app style="background-color: #1b1b1b; color:#ffffff;">
        <v-template>
            <v-row>
                <h2 class="font-weight-bold">Best 5</h2>
                <v-divider></v-divider>
                <BestGameListComponent :games="bestList" class="best-game" />
                <v-divider></v-divider>
                <v-col v-if="isWishList">
                    <h2 class="font-weight-bold">WishList({{ wishList.length }})</h2>
                    <GameListComponent :games="wishList" />
                </v-col>

            </v-row>
            <GameListComponent :games="gameList" style="background-color: #1b1b1b; color:#ffffff;" />
        </v-template>
    </v-app>
</template>

<script>
import BestGameListComponent from '@/components/BestGameListComponent.vue';
import GameListComponent from '@/components/GameListComponent.vue';
import axios from 'axios';
export default {
    components: {
        GameListComponent, BestGameListComponent
    },
    data() {
        return {
            gameList: [],
            bestList: [],
            wishList: [],
            isWishList: false,
        };
    },
    async created() {
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/list`);
            const best = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/list`);
            const wishlist = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/wishlist`);


            this.gameList = response.data.result;
            this.bestList = best.data.result.slice(0, 5);   // 최고 5개만 추출
            this.wishList = wishlist.data.result;
            if (this.wishList.length > 0) this.isWishList = true;
            console.log(this.gameList)
        } catch (e) {
            console.error("정보가 존재하지 않습니다", e);
        }
    },
}
</script>

<style></style>
