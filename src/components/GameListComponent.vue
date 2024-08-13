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
export default {
    props: {
        games: {
            type: Array,
            required: true
        }
    },

};
</script>