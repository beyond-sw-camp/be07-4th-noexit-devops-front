<template>
  <v-container>
    <div>
    <v-row class="d-flex justify-content-between mt-5">
      <v-col>
        <v-form>
          <v-row align="center" class="mb-4">
            <v-col cols="auto">
              <v-select
                v-model="category"
                :items="categoryOptions"
                item-title="text"
                item-value="value"
                class="custom-select"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="titleValue"
                label="제목을 입력해주세요."
                class="custom-text-field"
              ></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn height="60" color="pink" @click="createBoard">등록하기</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    </div>



    <div>
      <v-row>
        <v-col>
            <input ref="fileInput" type="file" accept="image/*" multiple style="display: none" @change="fileUpdate"/>    
            <v-row>
                <v-col v-for="imageSrc in imageSrcArr" :key="imageSrc" cols="auto" style="margin-right: 10px">
                  <!-- 사진 누르면 삭제하기 추가해야됨 -->
                  <img :src="imageSrc" alt="Selected Image" style=" width: 100px; height: 100px; object-fit: cover; display: block;"/>
                </v-col>
                <template v-if="files.length < 5">
                  <v-icon @click="triggerFileInput" color="white" size="150" style="cursor: pointer; margin-right: 10px;">mdi-image-outline</v-icon>
                </template>
            </v-row>

          </v-col>
      </v-row>
    </div>




<div>
 <v-row>
      <v-col>
        <v-textarea
          v-model="contentValue"
          placeholder="내용을 입력해주세요."
          class="custom-textarea"
        ></v-textarea>
      </v-col>
    </v-row>
</div>
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
      files: [], // 파일 배열
      imageSrc: null, // 파일명
      imageSrcArr: [], // 파일이름 배열
    };
  },
  computed: {},
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
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
        window.location.href = "/board/list";
      } catch (e) {
        console.log(e);
        alert("게시글이 작성되지 않았습니다.");
      }
    },
    // fileUpdate(event) {
    //   this.files = Array.from(event.target.files);
    // },
    fileUpdate() {
      const file = event.target.files[0]; // Get the first selected file
      this.files.push(file);
      if (file) {
        // Generate a URL for the selected image
        // this.imageSrc = URL.createObjectURL(file);
        this.imageSrcArr.push(URL.createObjectURL(file));
      } else {
        this.imageSrc = null;
      }
    },
  },
};
</script>

<style scoped>
/* Custom Select Style */
.custom-select {
  background-color: #565656;
  color: #ffffff;
  border-radius: 5px;
  height: 70px;
}

/* Custom Text Field Style */
.custom-text-field {
  background-color: #565656;
  color: #fff;
  border-radius: 5px;
  height: 70px; /* Adjust the height as needed */
}

/* Custom File Input Style */
.custom-file-input {
  background-color: #787878;
  color: #fff;
  border-radius: 5px;
  margin-bottom: 20px; /* Adjust margin as needed */
}

/* Custom Textarea Style */
.custom-textarea {
  background-color: #787878;
  color: #fff;
  border-radius: 5px;
  height: 700px; /* Adjust height as needed */
  width: 100%;
}
</style>
