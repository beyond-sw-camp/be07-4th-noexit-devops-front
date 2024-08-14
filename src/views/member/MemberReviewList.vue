<template>
    <v-app>
        <v-container>
            <v-row>
                <MypageSideBarComponent />
                <v-col>
                    <ReviewListComponent :isUserReviews="true" />
                </v-col>
            </v-row>
        </v-container>
    </v-app>

</template>


<script>

import ReviewListComponent from '@/components/ReviewListComponent.vue';
import MypageSideBarComponent from '@/components/common/MypageSideBarComponent.vue'
// import ReviewList from '@/views/review/ReviewList.vue'

export default {
    components: {
        ReviewListComponent,
        MypageSideBarComponent,
    },
}
</script>