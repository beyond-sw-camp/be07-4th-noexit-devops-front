<template>
    <MypageHeaderComponent />
    <GameListComponent :games="wishlist" />
</template>

<script>
import GameListComponent from '@/components/GameListComponent.vue'
import MypageHeaderComponent from '@/components/MypageHeaderComponent.vue'
import axios from 'axios';

export default {
    components: {
        GameListComponent,
        MypageHeaderComponent,
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
