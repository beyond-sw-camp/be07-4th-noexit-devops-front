<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col>
                    <h2 class="font-weight-bold">WishList({{ wishlist.length }})</h2>
                    <v-divider></v-divider>
                    <GameListComponent :games="wishlist" />
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
            wishlist: []
        };
    },
    methods: {
        async fetchWishlist() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/wishlist`);
                this.wishlist = response.data.result;
                console.log(this.wishlist)
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
