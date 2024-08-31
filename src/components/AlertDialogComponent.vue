<template>
    <v-dialog v-model="isVisible" max-width="400">
      <v-card elevation="16" class="rounded-lg">
        <template v-slot:append>
          <v-btn icon="$close" variant="text" @click="closeDialog"></v-btn>
        </template>
  
        <v-divider></v-divider>
  
        <div class="py-6 text-center">
          <v-icon
            class="mb-4"
            color=#FF0066
            icon="mdi-check-circle-outline"
            size="48"
          ></v-icon>
  
          <div class="text-h5 font-weight-bold">{{ title }}</div>
          <div class="mt-3">{{ message }}</div>
        </div>
  
        <v-divider></v-divider>
  
        <div class="pa-4 text-end">
          <v-btn
            class="text-none"
            color="grey"
            min-width="92"
            variant="outlined"
            rounded
            @click="closeDialog"
          >
            OK
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Notification',
      },
      message: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        isVisible: false,
      };
    },
    methods: {
      openDialog() {
        this.isVisible = true;
      },
      closeDialog() {
        this.isVisible = false;
        this.$emit('close');
        window.location.reload(); // Dialog를 닫을 때 페이지를 새로 고침
      },
    },
  };
  </script>
  
  
  <style scoped>
  .v-card {
    background-color: #1b1b1b;
    color: #fcfcfc;
  }
  
  .v-icon {
    color: #FF0066;
  }
  
  .v-btn {
    font-weight: bold;
  }
  </style>
  