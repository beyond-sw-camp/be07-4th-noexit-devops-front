<template>
    <v-container>
            <ChatCreate />
    </v-container>
</template>
  
<script>
  import ChatCreate from '@/components/ChatCreate.vue';
  
  export default {

    components: {
        ChatCreate
    },
    data() {
        return {

        }
    },
  };
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    margin-top: 60px;
  }
</style>
  