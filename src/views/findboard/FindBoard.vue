<template>
  <v-container>
    <!-- Post Creation Form -->
    <v-card class="mb-4" variant="tonal">
      <v-card-title>글 작성 란</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="newPost.title"
            label="가게 이름"
            required
          ></v-text-field>
          <v-text-field
            v-model="newPost.subtitle"
            label="마감 시각"
            required
          ></v-text-field>
          <v-textarea
            v-model="newPost.content"
            label="Contents"
            required
          ></v-textarea>
          <v-card-actions>
            <v-btn type="submit" color="primary">글 작성 버튼</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- List of Posts -->
    <v-row>
      <v-col
        v-for="(post, index) in paginatedPosts"
        :key="index"
        cols="12"
      >
        <v-card variant="tonal">
          <v-card-title>
            {{ post.title }}
          </v-card-title>
          <v-card-subtitle>
            {{ post.subtitle }}
          </v-card-subtitle>
          <v-card-text>
            {{ post.content }}
          </v-card-text>
          <v-card-actions>
            <v-btn @click="applyToPost(post)">
              참가 신청 버튼
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pagination -->
    <v-pagination
      v-model="page"
      :length="pageCount"
      @input="changePage"
    ></v-pagination>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      posts: [
        // Sample data
        {
          title: "가게 이름 : 신대방삼거리역 민성이스케이프점",
          subtitle: "마감 시각: xxxx",
          content: "Contents : 오늘 4시에 NoExit 1호점에서 공포 테마로 같이 방탈출 하실 3분 구합니다!!!"
        },
        // More sample data here...
      ],
      newPost: {
        title: "",
        subtitle: "",
        content: ""
      },
      page: 1,
      perPage: 4
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.posts.length / this.perPage);
    },
    paginatedPosts() {
      const start = (this.page - 1) * this.perPage;
      return this.posts.slice(start, start + this.perPage);
    }
  },
  methods: {
    changePage(newPage) {
      this.page = newPage;
    },
    applyToPost(post) {
      // Handle the application logic here
      alert(`Applying to ${post.title}`);
    },
    submitForm() {
      // Add the new post to the posts array
      this.posts.unshift({ ...this.newPost });

      // Reset the form
      this.newPost.title = "";
      this.newPost.subtitle = "";
      this.newPost.content = "";

      // Go back to the first page to see the new post
      this.page = 1;
    }
  }
};
</script>

<style scoped>
/* Add your custom styles here */
.mb-4 {
  margin-bottom: 16px;
}
</style>
