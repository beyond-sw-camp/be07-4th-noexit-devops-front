<template>
    <v-container>
        <v-row>
            <v-col v-for="item in wishlist" :key="item.id" sm="3" md="3">
                <v-card>
                    <v-img :src="item.image" height="200px"></v-img>
                    <v-card-title>{{ item.title }}</v-card-title>

                    <v-card-actions>
                        <v-btn icon>
                            <v-icon>{{ 'mdi-heart' }}</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import axios from 'axios';

export default {
    data() {
        return {
            wishlist: [
                { id: 1, title: "Item 1", image: "https://via.placeholder.com/200" },
                { id: 2, title: "Item 2", image: "https://via.placeholder.com/200" },
                { id: 3, title: "Item 3", image: "https://via.placeholder.com/200" },
                { id: 3, title: "Item 3", image: "https://via.placeholder.com/200" },
                { id: 3, title: "Item 3", image: "https://via.placeholder.com/200" },
                { id: 3, title: "Item 3", image: "https://via.placeholder.com/200" },
                { id: 3, title: "Item 3", image: "https://via.placeholder.com/200" },
            ]
        };
    },
    methods: {
        // toggleWishlist(item) {
        //     // 찜 상태 토글
        //     item.isFavorited = !item.isFavorited;
        // },

        async fetchWishlist() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/game/list`)
                this.wishlist = response.data.map(item => ({
                    id: item.id,
                    title: item.title,
                    image: item.image, // 서버 데이터에 따라 수정 필요
                    isFavorited: item.isFavorited || false, // 기본 값 false
                }));
            } catch (e) {
                console.error("정보가 존재하지 않습니다", e);
            }
        }
    }
};
</script>