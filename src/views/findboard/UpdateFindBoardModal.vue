<template>
    <v-dialog v-model="localIsOpen" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">게시글 수정하기</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="updateForm" @submit.prevent="updateFindBoard">
            <v-text-field
              v-model="updateTitle"
              :rules="[(v) => !!v || '제목을 입력하세요.']"
              hide-details="auto"
              label="제목"
              outlined
              class="mb-4"
              required
            ></v-text-field>
            <v-textarea
              v-model="updateContents"
              :rules="[(v) => !!v || '내용을 입력하세요.']"
              label="내용"
              outlined
              rows="4"
              class="mb-4"
              required
            ></v-textarea>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="updateDate"
                  label="날짜 선택"
                  type="date"
                  outlined
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="updateTime"
                  label="마감 시한"
                  type="time"
                  outlined
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-select
              v-model="updateTotalCapacity"
              :rules="[(v) => !!v || '희망 인원을 선택하세요.']"
              :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              label="희망 인원"
              outlined
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="closeModal">취소</v-btn>
          <v-btn color="pink" @click="updateFindBoard">수정하기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      isOpen: {
        type: Boolean,
        required: true,
      },
      findBoard: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        localIsOpen: this.isOpen,
        updateTitle: "",
        updateContents: "",
        updateDate: "",
        updateTime: "",
        updateTotalCapacity: "",
      };
    },
    watch: {
      isOpen(newVal) {
        this.localIsOpen = newVal;
        if (newVal) {
          this.populateFields();
        }
      },
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      populateFields() {
        if (this.findBoard) {
          this.updateTitle = this.findBoard.title;
          this.updateContents = this.findBoard.contents;
          this.updateDate = this.findBoard.createdTime.substr(0, 10);
          this.updateTime = this.findBoard.createdTime.substr(11, 5);
          this.updateTotalCapacity = this.findBoard.totalCapacity;
        }
      },
      async updateFindBoard() {
        try {
          const updateExpirationDateTime = new Date(
            `${this.updateDate}T${this.updateTime}:00`
          );
  
          const requestData = {
            title: this.updateTitle,
            contents: this.updateContents,
            expirationDate: updateExpirationDateTime.toISOString(), // 변수명 expirationDate다. Time 아니다 주의.
            totalCapacity: this.updateTotalCapacity,
          };
  
          const response = await axios.put(
            `http://localhost:8080/findboard/update/${this.findBoard.id}`,
            requestData
          );
          console.log("업데이트 완료:", response.data);
          alert("업데이트 완료");
          this.closeModal();
          this.$emit('updated');
  
          // 페이지 전환 후, 데이터를 다시 로드하여 권한 상태를 반영
          window.location.reload();
          
        } catch (error) {
          console.error("업데이트 실패:", error);
          alert("업데이트 실패");
        }
      },
    },
  };
  </script>
  