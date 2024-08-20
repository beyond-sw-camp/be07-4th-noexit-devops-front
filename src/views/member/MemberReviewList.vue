<template>
    <v-app style=" background-color: #1b1b1b; color:#ffffff;">
        <v-container>
            <v-row>
                <MypageSideBarComponent />
                <v-col>

                    <!-- <ReviewList /> -->
                    <h2 class="font-weight-bold">Review</h2>
                    <v-divider :thickness="6"></v-divider>
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
        // ReviewList,
        MypageSideBarComponent,
    },
}
</script>