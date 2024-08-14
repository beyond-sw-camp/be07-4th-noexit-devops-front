<template>
    <v-app>
        <v-container>
            <MypageHeaderComponent />
            <ReviewList />
            <ReviewListComponent />
        </v-container>
    </v-app>

</template>


<script>
import ReviewListComponent from '@/components/ReviewListComponent.vue';
import MypageHeaderComponent from '@/components/common/MypageSideBarComponent.vue'
import ReviewList from '@/views/review/ReviewList.vue'

export default {
    components: {
        ReviewListComponent,
        MypageHeaderComponent,
        ReviewList
    },
}
</script>