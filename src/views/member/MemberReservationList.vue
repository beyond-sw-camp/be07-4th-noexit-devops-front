<template>
    <v-app>
        <v-container>
            <v-row>
                <MypageSideBarComponent />
                <v-col>
                    <ReservationList />
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import ReservationList from '@/views/reservation/ReservationList.vue';
import MypageSideBarComponent from '@/components/common/MypageSideBarComponent.vue';
export default {
    components: {
        ReservationList,
        MypageSideBarComponent
    },
    data() {
        return {

        }
    },
}</script>