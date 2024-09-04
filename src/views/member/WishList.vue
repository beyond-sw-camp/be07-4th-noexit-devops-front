<template>
    <v-app style="background-color: #1b1b1b; color:#ffffff;">
        <v-container>
            <v-row>
                <MypageSideBarComponentVue :wishList="wishgamelist" />
                <v-col>
                    <h2 class="font-weight-bold">WishList({{ wishgamelist.length }})</h2>
                    <v-divider :thickness="6"></v-divider>
                    <GameListComponent :games="wishgamelist" />
                    <GameListComponent />
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import GameListComponent from '@/components/GameListComponent.vue'
import axios from 'axios';
import MypageSideBarComponentVue from '@/components/common/MypageSideBarComponent.vue';

export default {
    components: {
        GameListComponent, MypageSideBarComponentVue
    },
    data() {
        return {
            wishlist: [],
            gamelist: [],
            wishgamelist: [],
            //페이징 처리 했는데 페이징 번호가 보이지 않아서 myPage의 WishList가 12개밖에 보이지 않았음. 페이징처리를 없애던지 번호 마킹을 하던지 해야함.
            pageSize: 50,
            currentPage: 1,
            totalPages: 1,
            pagesPerRange: 5,
            isLoading: false
            // difficultyLevel: 1,
        };
    },
    created() {
        this.fetchWishlist();
    },
    methods: {
        async fetchWishlist() {
            // 위시리스트 받아와서 gameId들 조회
            // 그 번호 아이디인 놈들을 gameList에 넣음
            // 위에서 :games = gameList로 하면 됨
            try {

                let params = {
                    size: this.pageSize,
                    page: this.currentPage - 1,
                };
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/wishlist`, { params });
                const gameInfo = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/list`);

                this.wishlist = response.data.result.content;
                this.gamelist = gameInfo.data.result.content;
                console.log(this.wishlist);
                console.log(this.gamelist);



                for (let i = 0; i < this.gamelist.length; i++) {
                    for (let j = 0; j < this.wishlist.length; j++) {
                        if (this.wishlist[j].gameId === this.gamelist[i].id) {
                            this.wishgamelist.push(this.gamelist[i]);
                        }
                    }
                }
                for (let i = 0; i < this.wishgamelist.length; i++) {
                    console.log(this.wishgamelist[i]);
                }

            } catch (e) {
                console.error("정보가 존재하지 않습니다", e);
            }
        },

    },
    // mounted() {
    //     this.fetchWishlist();
    // }
};
</script>
