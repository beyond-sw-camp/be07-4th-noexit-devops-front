<template>
    <MypageHeaderComponent />
    <GameListComponent />

</template>
<script>
import GameListComponent from '@/components/GameListComponent.vue'
import MypageHeaderComponent from '@/components/MypageHeaderComponent.vue'

export default {
    components: {
        GameListComponent,
        MypageHeaderComponent,
    }
}
</script>