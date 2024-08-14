<template>
    <v-app>
        <v-container>
            <MypageSideBarComponent />
            <ReviewListComponent />
        </v-container>
    </v-app>
</template>
  
<script>
import ReviewListComponent from '@/components/ReviewListComponent.vue';
import MypageSideBarComponent from '@/components/common/MypageSideBarComponent.vue';
export default {
    components: {
        ReviewListComponent,
        MypageSideBarComponent
    },
    data() {
        return {

        }
    },
}</script>