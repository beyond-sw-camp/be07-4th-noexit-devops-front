<template>
  <v-container>
    <v-row class="d-flex justify-content-between mt-5">
      <v-col>
        <v-form>
          <v-row>
            <v-col>
              <v-select
                style="width: 100px"
                v-model="editedBoardType"
                :items="categoryOptions"
                item-title="text"
                item-value="value"
                :style="{ backgroundColor: '#f8d7da' }"
              >
              </v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="editedTitle" required
                style="width: 700px"
                :style="{ backgroundColor: '#f8d7da' }"
              >
              </v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn color="pink" @click="saveEditing"
                >수정하기</v-btn
              >
              <v-btn color="grey" @click="cancelEditing"
                >취소하기</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-file-input 
        :style="{ backgroundColor: '#f8d7da' }"
    label="첨부 이미지" 
    accept="image/*" 
    multiple 
    @change="fileUpdate">
        </v-file-input>
        <v-text-field
          v-model="editedContents"
          style="width: 1200px; height: 700px"
          :style="{ backgroundColor: '#f8d7da' }"
        >
        </v-text-field>
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
      editedTitle: "",
      editedContents: "",
      editedBoardType: "",
      category: "카테고리",
      categoryOptions: [
        { text: "FREE", value: "FREE" },
        { text: "STRATEGY", value: "STRATEGY" },
      ],
      editedFiles: [], 
    };
  },
  async created() {
    this.fetchBoardInfo();
  },
  methods: {
    async fetchBoardInfo() {
      const boardInfo = await axios.get(
          `${process.env.VUE_APP_API_BASIC_URL}/board/detail/${this.id}`
        );
      this.board = boardInfo.data.result;
      console.log(this.board);
      this.editedTitle = this.board.title
      this.editedContents = this.board.contents;
      this.editedBoardType = this.board.boardType;
      this.editedFiles = this.board.images;
    },

    async saveEditing() {
      try {
        let editedBoard = new FormData();
          const data = {
            title: this.editedTitle,
            contents: this.editedContents,
            boardType: this.editedBoardType
          };

          const jsonBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
          editedBoard.append("data", jsonBlob);


        this.editedFiles.forEach((file) => {
          editedBoard.append("file", file, file.name);
        });


        await axios.patch(
          `${process.env.VUE_APP_API_BASIC_URL}/board/update/${this.board.id}`, editedBoard, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
          
        );

        alert("게시글이 수정되었습니다.");
        this.$router.push(`/board/detail/${this.board.id}`);
      } catch (e) {
        console.error("게시글 수정 실패", e);
        alert("게시글 수정에 실패했습니다.");
      }
    },
    cancelEditing() {
      this.$router.push(`/board/detail/${this.board.id}`);
    },
    fileUpdate(event) {
        this.files = Array.from(event.target.files);

    },

  },
};
</script>
