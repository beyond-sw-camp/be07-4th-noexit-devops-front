<template>
    <v-container>
        <v-row>
            <v-col cols="12" v-for="(review, index) in visibleReviews" :key="index">
                <v-card @click="showDetail(review)" class="mb-4">
                    <v-card-title>{{ review.title }}</v-card-title>
                    <v-card-text>{{ review.excerpt }}</v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row v-if="!showAll">
            <v-col cols="12" class="text-center">
                <v-btn @click="loadMoreReviews">더보기</v-btn>
            </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title>{{ selectedReview.title }}</v-card-title>
                <v-card-text>
                    {{ selectedReview.content }}
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="dialog = false">닫기</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            reviews: [
                {
                    title: "후기 1",
                    excerpt: "이것은 후기 1의 요약입니다.",
                    content: "이것은 후기 1의 전체 내용입니다."
                },
                {
                    title: "후기 2",
                    excerpt: "이것은 후기 2의 요약입니다.",
                    content: "이것은 후기 2의 전체 내용입니다."
                },
                // 추가적인 후기를 여기에 넣으세요
            ],
            visibleReviews: [], // 화면에 표시할 후기 목록
            selectedReview: {}, // 선택한 후기 상세보기
            dialog: false, // 상세보기 다이얼로그 표시 여부
            showAll: false, // 전체 후기 표시 여부
            itemsPerPage: 5, // 한 번에 표시할 후기 개수
        };
    },
    methods: {
        showDetail(review) {
            this.selectedReview = review;
            this.dialog = true;
        },
        loadMoreReviews() {
            const currentLength = this.visibleReviews.length;
            const nextItems = this.reviews.slice(currentLength, currentLength + this.itemsPerPage);
            this.visibleReviews = [...this.visibleReviews, ...nextItems];

            if (this.visibleReviews.length >= this.reviews.length) {
                this.showAll = true;
            }
        }
    },
    mounted() {
        this.loadMoreReviews(); // 초기 로딩 시 첫 페이지 로드
    }
};
</script>