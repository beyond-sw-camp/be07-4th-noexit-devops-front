<template>
    <v-dialog v-model="localIsOpen" max-width="1100px">
      <v-card class="black white--text" style="border: 2px solid white; font-family: 'GmarketSansMedium', sans-serif;">
        <v-toolbar color="pink" dark flat>
          <v-btn icon @click="closeModal">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-card-title class="text-h6 font-weight-regular">
            작성하기
          </v-card-title>
          <v-spacer></v-spacer>
        </v-toolbar>
  
        <v-card-text>
          <v-form ref="createForm" @submit.prevent="registerFindBoard">
            <v-text-field
              v-model="title"
              :rules="[(v) => !!v || '제목을 입력하세요.']"
              hide-details="auto"
              label="제목"
              outlined
              class="mb-4"
              required
            ></v-text-field>
            <v-textarea
              v-model="contents"
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
                  v-model="date"
                  label="날짜 선택"
                  type="date"
                  outlined
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="time"
                  label="마감 시한"
                  type="time"
                  outlined
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-select
              v-model="totalCapacity"
              :rules="[(v) => !!v || '희망 인원을 선택하세요.']"
              :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              label="희망 인원"
              outlined
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn 
          color="pink" @click="registerFindBoard"
          :disabled="!title || !contents || !totalCapacity || !time || !date"
          >작성하기
        </v-btn>
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
    },
    data() {
      return {
        localIsOpen: this.isOpen,
        title: "",
        contents: "",
        date: "",
        time: "",
        totalCapacity: "",
      };
    },
    watch: {
      isOpen(newVal) {
        this.localIsOpen = newVal;
      }
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      async registerFindBoard() {
        if (this.$refs.createForm.validate()) {
          try {
            let expirationDateTime = new Date(`${this.date}T${this.time}`);
            expirationDateTime.setHours(expirationDateTime.getHours() + 9);
            expirationDateTime = expirationDateTime.toISOString();
            const requestData = {
              title: this.title,
              contents: this.contents,
              expirationTime: expirationDateTime,
              totalCapacity: this.totalCapacity,
            };
  
            await axios.post(`http://localhost:8080/findboard/create`, requestData);
  
            alert("작성 완료");
            this.closeModal();
            window.location.reload();
          } catch (error) {
            console.error("Error submitting form:", error);
            alert("작성 실패");
          }
        } else {
          alert("모든 필드를 올바르게 작성해 주세요.");
        }
      },
    },
    mounted() {
      const now = new Date();
      this.date = now.toLocaleDateString("en-CA");
      this.time = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    },
  };
  </script>
  
  <style scoped>
  @import url("https://webfontworld.github.io/gmarket/GmarketSans.css");
  
  .v-card {
    font-family: 'GmarketSansMedium', sans-serif;
    font-weight: 1000;
  }
  </style>
  