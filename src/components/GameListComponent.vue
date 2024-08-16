<template>
    <v-container>
        <v-row>
            <v-col v-for="game in games" :key="game.name" sm="3" md="3">
                <v-card>
                    <!-- 넣을 데이터 조금씩 더 추가예정 -->
                    <v-img :src="game.image" height="200px"></v-img>
                    <v-card-title>{{ game.gameName }}</v-card-title>
                    <v-card-text>{{ game.difficult }}</v-card-text>
                    <v-card-text>{{ game.price }}</v-card-text>
                    <v-card-actions>
                        <v-btn icon @click="likeGame(game.id)">
                            <v-icon>{{ 'mdi-heart' }}</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import axios from "axios";

export default {
    props: {
        games: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            wishList: [],

        }
    },
    methods: {
        async likeGame(id) {
            try{
            for (const value of this.wishList) {
                if(value.gameId === id) { // 위시리스트에 있다 -> 삭제
                    await axios.patch(`${process.env.VUE_APP_API_BASIC_URL}/wishlist/delete/${value.id}`);
                    alert("해당 게임이 위시리스트에 삭제되었습니다.");
                    window.location.reload()
                }else { // 없다 -> 추가
                    await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/wishlist/${value.id}`);
                    alert("해당 게임이 위시리스트에 추가되었습니다.");
                    window.location.reload()
                }
            }
            }catch(e) {
                console.log(e);
            }
        }

    }

};
</script>