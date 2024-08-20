<template>
  <v-container>
    <v-row class="d-flex justify-content-between mt-5" style="color: white">
      <v-col>
        <v-form>
          <v-row>
            <v-col>
              <v-select
                v-model="category"
                :items="categoryOptions"
                item-title="text"
                item-value="value"
                style="width: 150px;"
              >
              </v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="titleValue"
                required
                label="제목을 입력해주세요."
                style="width: 850px"
              >
              </v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn color="pink" @click="createBoard">등록하기</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-file-input
          label="첨부 이미지"
          :style="{ backgroundColor: '#f8d7da' }"
          accept="image/*"
          multiple
          @change="fileUpdate"
        >
        </v-file-input>

        <v-text-field
          v-model="contentValue"
          required
          label="내용을 입력해주세요."
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
  data() {
    return {
      titleValue: "",
      contentValue: "",
      boardType: "",
      category: "카테고리",
      categoryOptions: [
        { text: "FREE", value: "FREE" },
        { text: "STRATEGY", value: "STRATEGY" },
      ],

      files: [],
    };
  },
  methods: {
    async createBoard() {
      try {
        if (this.category == "FREE") {
          this.boardType = "FREE";
        } else if (this.category == "STRATEGY") {
          this.boardType = "STRATEGY";
        }

        let newBoard = new FormData();
        const data = {
          title: this.titleValue,
          contents: this.contentValue,
          boardType: this.boardType,
        };

        newBoard.append(
          "data",
          new Blob([JSON.stringify(data)], { type: "application/json" })
        );

        this.files.forEach((file) => {
          newBoard.append("file", file, file.name);
        });

        await axios.post(
          `${process.env.VUE_APP_API_BASIC_URL}/board/create`,
          newBoard,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("게시글이 성공적으로 작성되었습니다.");
        // this.$router.push("/board/list");
        window.location.href = "/board/list";
      } catch (e) {
        console.log(e);
        alert("게시글이 작성되지 않았습니다.");
      }
    },
    fileUpdate(event) {
      this.files = Array.from(event.target.files);
    },
  },
};
</script>
