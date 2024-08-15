<template>
  <v-container style="color:#ffffff">
    <v-row>
      <v-col>
        <div style="margin-top: 100px; font-size: 24px">{{ board.title }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <hr class="divider" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <div class="d-flex flex-column" style="text-align: left">
          <div>번호 {{ board.id }}</div>
          <div>작성자 {{ board.writer }}</div>
          <div>작성일 {{ board.createdDate }}</div>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="d-flex flex-column" style="text-align: right">
          <div>조회수 {{ board.boardHits }}</div>
          <div>추천수 {{ board.likes }}</div>
          <div v-if="board.comments">댓글수 {{ board.comments.length }}</div>
          <div v-else>0</div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <hr class="divider" />
      </v-col>
    </v-row>
    <v-row class="mt- d-flex justify-center align-center">
      <v-col>
  <div style="font-size: 24px">{{ board.contents }}</div>
  <div v-if="board.images && board.images.length">
    <div v-for="i in board.images" :key="i.id">
      <v-img
        :src="i.imageUrl"
        style="width: 500px;"
      ></v-img>
    </div>
  </div>
  <div v-else>
  </div>
</v-col>
    </v-row>
    <v-row style="margin-top: 150px" class="d-flex justify-center align-center">
      <v-col class="d-flex justify-center" cols="auto">
        <v-btn color="pink" @click="likeBoard">좋아요 {{ board.likes }}</v-btn>
      </v-col>
      <v-col class="d-flex justify-center" cols="auto">
        <v-btn color="black" @click="dislikeBoard">싫어요 {{ board.dislikes }}</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <hr class="divider" />
      </v-col>
    </v-row>
    <v-row>
      <v-table>
        <tbody>
          <tr v-for="c in board.comments" :key="c.id">
            <td style="width: 200px">{{ c.writer }}</td>
            <td style="width: 1000px">{{ c.content }}</td>
            <td style="width: 100px">{{ c.createdTime }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-row>
    <v-row style="margin-bottom: 100px">
      <v-col>
        <v-form @submit.prevent="createComment">
          <v-row>
            <v-col>
              <v-text-field v-model="commentContent"> </v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn color="pink" type="submit">댓글 등록</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  props: ["id"],
  data() {
    return {
      board: {},
      comment: {},
      commentContent: "",
      isLastPage: false,
      isLoading: false,
      selected: {},
    };
  },
  async created() {
    console.log("Component created");
    this.loadBoard();
  },
  methods: {
    async loadBoard() {
      try {
        if (this.isLoading || this.isLastPage) return;
        this.isLoading = true;
        try {
          // API 요청을 통해 데이터 로딩
          const response = await axios.get(
            `${process.env.VUE_APP_API_BASIC_URL}/board/detail/${this.id}`
          );
          this.board = response.data.result; // 데이터 할당
        } catch (error) {
          console.error("Failed to load board details:", error); // 오류 처리
        }
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    async createComment() {
      const newComment = {
        boardId: this.board.id,
        content: this.commentContent
      };
      try {
        await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/comment/create`, newComment);
        alert("댓글이 성공적으로 작성되었습니다.")
        window.location.reload()
      } catch (e) {
        console.log(e);
        alert("댓글이 작성되지 않았습니다.")
      }
    },
    async likeBoard() {
      try {
        await axios.patch(`${process.env.VUE_APP_API_BASIC_URL}/board/like/${this.board.id}`);
        alert("게시글을 좋아합니다.")
        window.location.reload()
      } catch (e) {
        console.log(e);
        alert("좋아요 실패했습니다.")
      }
    },
    async dislikeBoard() {
      try {
        await axios.patch(`${process.env.VUE_APP_API_BASIC_URL}/board/dislike/${this.board.id}`);
        alert("게시글을 싫어합니다.")
        window.location.reload()
      } catch (e) {
        console.log(e);
        alert("싫어요 실패했습니다.")
      }
    }
  },
}
</script>