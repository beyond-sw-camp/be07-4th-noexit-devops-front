<template>
    <MypageHeaderComponent />
    <ReviewListComponent />
</template>


<script>
import ReviewListComponent from '@/components/ReviewListComponent.vue';
import MypageHeaderComponent from '@/components/MypageHeaderComponent.vue'

export default {
    components: {
        ReviewListComponent,
        MypageHeaderComponent
    },
}
</script>