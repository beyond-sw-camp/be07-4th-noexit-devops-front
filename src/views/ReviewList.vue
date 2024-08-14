<template>
    <ReviewListComponent />
</template>

<script>
import ReviewListComponent from "@/components/ReviewListComponent.vue";
import axios from "axios";
export default {
    props: ["isAdmin", "pageTitle", "currentUserNickname"],
    components: {
        ReviewListComponent,
    },
    data() {
        return {
            searchType: "optional",
            searchOptions: [
                { text: "선택", value: "optional" },
                { text: "작성자 닉네임", value: "nickname" },
                { text: "내용", value: "content" },
            ],
            searchValue: "",
            reviewList: [],
            pageSize: 10,
            currentPage: 0,
            isLastPage: false,
            isLoading: false,
        };
    },
    created() {
        this.loadReviews();
        window.addEventListener("scroll", this.scrollPagination);
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.scrollPagination);
    },
    methods: {
        async loadReviews() {
            try {
                if (this.isLoading || this.isLastPage) return;

                this.isLoading = true;
                let params = { size: this.pageSize, page: this.currentPage };

                if (this.searchType === "nickname") {
                    params.nickname = this.searchValue;
                } else if (this.searchType === "content") {
                    params.content = this.searchValue;
                }

                const response = await axios.get(
                    `${process.env.VUE_APP_API_BASIC_URL}/review/all`,
                    { params }
                );
                const additionalData = response.data.result.content;

                if (additionalData.length === 0) {
                    this.isLastPage = true;
                    return;
                }

                this.reviewList = [...this.reviewList, ...additionalData];
                this.isLastPage = response.data.result.last;
                this.currentPage++;
                this.isLoading = false;
            } catch (e) {
                console.log(e);
            }
        },
        searchReviews() {
            this.reviewList = [];
            this.currentPage = 0;
            this.isLastPage = false;
            this.isLoading = false;
            this.loadReviews();
        },
        scrollPagination() {
            const isBottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200;
            if (isBottom && !this.isLastPage && !this.isLoading) {
                this.loadReviews();
            }
        },
        async deleteReview(reviewId) {
            try {
                await axios.put(
                    `${process.env.VUE_APP_API_BASIC_URL}/review/delete/${reviewId}`
                );
                this.reviewList = this.reviewList.filter((r) => r.id !== reviewId);
                alert("리뷰가 삭제되었습니다.");
            } catch (e) {
                console.log(e);
                alert("리뷰 삭제에 실패하였습니다.");
            }
        },
    },
};
</script>

<style scoped>
.v-list-item-subtitle {
    margin-top: 8px;
    font-size: 14px;
}

.rejected-reservation {
    opacity: 0.5;
}
</style>
