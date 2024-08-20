<template>
    <v-app style=" background-color: #1b1b1b; color:#ffffff;">
        <v-container>
            <v-row>
                <MypageSideBarComponent />
                <v-col>
                    <ReservationList />
                    <!-- <ResevationListComponent /> -->
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import ReservationList from '@/views/reservation/ReservationList.vue';
import MypageSideBarComponent from '@/components/common/MypageSideBarComponent.vue';
// import ResevationListComponent from '@/components/ReservationListComponent.vue'
export default {
    components: {
        ReservationList,
        MypageSideBarComponent,
        //  ResevationListComponent

    },
    data() {
        return {

        }
    },
}</script>