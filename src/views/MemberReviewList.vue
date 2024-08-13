<template>
    <MypageHeaderComponent />
    <ReviewListComponent />
</template>


<script>
import ReviewListComponent from '@/components/ReviewListComponent.vue';
import MypageHeaderComponent from '@/components/MypageSideBarComponent.vue'

export default {
    components: {
        ReviewListComponent,
        MypageHeaderComponent
    },
}
</script>