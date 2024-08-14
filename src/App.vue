<template>
  <v-app class="common-margin">
    <!-- <HeaderComponent /> -->
    <NewHeaderComponent />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
// import HeaderComponent from './components/common/HeaderComponent.vue'
import NewHeaderComponent from './components/common/NewHeaderComponent.vue';
export default {
  name: "App",
  components: {
    // HeaderComponent,
    NewHeaderComponent
  }
};
</script>

<style>
.common-margin {
  margin: 100px 200px;
}
</style>
