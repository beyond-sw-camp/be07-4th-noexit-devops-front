<template>
  <v-app class="common-margin" style="background-color:#1b1b1b;">
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

.v-app {
  background-color: #1b1b1b;

}

html {
  background-color: #1b1b1b;
}
</style>
