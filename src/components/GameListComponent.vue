<template>
    <v-container style="background-color: #1b1b1b; color:#ffffff;">
        <v-row>
            <v-col v-for="game in games" :key="game.name" sm="3" md="3">
                <v-card @click="moveToDetail(game.id)" class="hover-card"
                    style="background-color: #1b1b1b; color:#ffffff;">
                    <!-- 넣을 데이터 조금씩 더 추가예정 -->
                    <v-img :src="game.imagePath" height="200px"></v-img>
                    <v-card-title>{{ game.gameName }}</v-card-title>
                    <v-card-text>{{ game.difficult }}</v-card-text>
                    <v-card-text>{{ game.price }}</v-card-text>
                    <v-card-actions>
                        <v-btn icon>
                            <v-icon>{{ 'mdi-star' }}</v-icon>
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
    methods: {
        moveToDetail(id) {
            // console.log(id);
            this.$router.push("/game/detail/" + id)
        }
    }

};
</script>

<style scoped>
.hover-card {
    transition: transform 0.2s ease;
    border-radius: 15px;

}

.hover-card:hover {
    transform: translate(0px, -5px);
}
</style>