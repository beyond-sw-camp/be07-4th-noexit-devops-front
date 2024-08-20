<template>
    <v-app>
        <v-container style=" background-color: #1b1b1b; color:#ffffff;">
            <ReservationListComponent />
            <!-- <ReservationList /> -->

        </v-container>
    </v-app>
</template>

<script>
import ReservationListComponent from '@/components/ReservationListComponent.vue';
// import ReservationList from '@/views/reservation/ReservationList.vue';

export default {
    components: {
        ReservationListComponent,
        // ReservationList
    },
    data() {
        return {

        }
    },
}
</script>