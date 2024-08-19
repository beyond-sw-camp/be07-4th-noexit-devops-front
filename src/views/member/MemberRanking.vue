<template>
    <v-container justify="center">
        <v-list>
            <v-row>
                <v-col cols="6">
                    <v-list-item-title class="font-weight-bold">닉네임</v-list-item-title>
                </v-col>
                <v-col cols="3">
                    <v-list-item-title class="font-weight-bold">rating</v-list-item-title>
                </v-col>
                <v-col cols="3">
                    <v-list-item-title class="font-weight-bold">리뷰 갯수</v-list-item-title>
                </v-col>
            </v-row>

            <v-list-item v-for="(member, index) in members" :key="member.id">
                <v-list-item-content>
                    <v-row no-gutters align="center">
                        <v-col cols="6">
                            <v-list-item-title>
                                <span>{{ index }}</span>{{ member.nickname }}</v-list-item-title>
                        </v-col>
                        <v-col cols="3">
                            <v-list-item-title>{{ member.point }}</v-list-item-title>
                        </v-col>
                        <v-col cols="3">
                            <v-list-item-title>{{ member.reviewCount }}</v-list-item-title>
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-pagination v-model:page="pagination.page" :length="pageCount" @input="fetchData"></v-pagination>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            members: [],
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Username', value: 'username' },
                { text: 'Email', value: 'email' },
                { text: 'Nickname', value: 'nickname' }
            ],
            itemsPerPage: 20,
            pagination: {
                page: 1,
            },
            pageCount: 0,
            loading: false,
        };
    },
    methods: {
        async fetchData() {
            this.loading = true;
            try {
                const url = `${process.env.VUE_APP_API_BASIC_URL}/member/ranking`;
                console.log(`Fetching data from: ${url}`);
                console.log(`With params: page=${this.pagination.page - 1}, size=${this.itemsPerPage}`);
                const response = await axios.get(url, {
                    params: {
                        page: this.pagination.page - 1, // API expects page starting from 0
                        size: this.itemsPerPage,
                    },
                });
                console.log('Response data:', response.data);
                this.members = response.data.result.content;
                this.pageCount = Math.ceil(response.data.totalElements / this.itemsPerPage);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                this.loading = false;
            }
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        pagination: {
            handler() {
                this.fetchData();
            },
            deep: true,
        }
    }
};
</script>

<style scoped>
/* Add custom styles here */
</style>
