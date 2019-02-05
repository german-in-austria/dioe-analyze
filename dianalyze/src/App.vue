<template>
  <v-app>
    <v-content>
      <img src="./assets/logo.png" />
      <img src="./assets/header.png" />
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
/* @import '../../node_modules/vuetify/dist/vuetify.min.css'; */
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
