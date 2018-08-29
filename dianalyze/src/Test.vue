<template>
  <v-app id="test">
    <!-- <img src="./assets/vader.jpg"> -->
    <router-view/>
  </v-app>
</template>

<script>
export default {
  name: 'test'
}
</script>

<style>
#test {
  font-family: 'Lato', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  margin-top: 60px;
}
</style>
