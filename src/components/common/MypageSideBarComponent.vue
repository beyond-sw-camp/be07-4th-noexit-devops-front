<template>
    <v-col cols="12" md="3" class="fixed-column" style=" background-color: #1b1b1b; color:#ffffff;">
        <div class="gray-background">
            <v-row>
                <v-col cols="12">
                    <v-row align="center">
                        <!-- <h1>회원 등급: {{ membershipGrade }}</h1> -->
                        <div>회원 등급</div>
                        <v-col cols="12">
                            <h1>GOLD</h1>
                        </v-col>
                    </v-row>
                    <v-divider class="white-divider"></v-divider>
                </v-col>
            </v-row>

            <!-- 
            <v-row>
                <v-col cols="12">
                    <v-row align="center">
                        <div>사용가능한 쿠폰</div>
                        <v-col cols="12">
                            <h1>3</h1>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row> -->
        </div>

        <v-row class="button-container" style=" background-color: #1b1b1b; color:#ffffff;">
            <v-toolbar-title>
                <div class="nav-container">
                    <router-link to="/mypage" class="link-btn"
                        :class="{ active: isActive('/mypage') }">마이페이지</router-link>
                    <router-link to="/reservation/myreservation" class="link-btn"
                        :class="{ active: isActive('/reservation/myreservation') }">Reservations</router-link>
                    <router-link to="/review/myall" class="link-btn"
                        :class="{ active: isActive('/review/myall') }">Reviews</router-link>
                    <router-link to="/wishlist" class="link-btn"
                        :class="{ active: isActive('/wishlist') }">WishList</router-link>
                </div>


            </v-toolbar-title>

        </v-row>
    </v-col>
</template>
<script>
export default {
    props: {
        wishList: {
            type: Array,
            required: true
        }
    }, methods: {
        isActive(path) {
            return this.$route.path === path;
        },
    }
}
</script>

<style scoped>
.nav-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;

}

.v-btn {
    all: unset;
    /* 모든 스타일 초기화 */
}

.gray-background {
    background-color: #565656;
    padding: 30px 40px;
    color: white;
    margin-bottom: 30px;
}

.v-toolbar-title {
    width: 100%;
}

.link-btn {
    font-size: 24px;
    font-weight: 400;
    padding: 12px;

    position: relative;
    color: white;
    text-decoration: none;
}

.link-btn:hover {
    color: #919191;

}

.link-btn.active {
    text-decoration: underline;
    text-decoration-thickness: 1px;
}
</style>