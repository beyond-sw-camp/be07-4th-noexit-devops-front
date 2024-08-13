<template>
    <v-app>
        <v-container>
            <MypageHeaderComponent />
            <ReviewListComponent />
        </v-container>
    </v-app>

</template>


<script>
import ReviewListComponent from '@/components/ReviewListComponent.vue';
import MypageHeaderComponent from '@/components/common/MypageSideBarComponent.vue'

export default {
    components: {
        ReviewListComponent,
        MypageHeaderComponent
    },
}
</script>