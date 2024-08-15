<template>
    <v-app>
        <v-container>
            <ReservationListComponent />
        </v-container>
    </v-app>
</template>
  
<script>
import ReservationListComponent from '@/components/ReservationListComponent.vue';
export default {
    components: {
        ReservationListComponent
    },
    data() {
        return {

        }
    },
}
</script>