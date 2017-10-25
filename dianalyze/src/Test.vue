<template>
  <div id="test">
    <img src="./assets/vader.jpg">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'test'
}
</script>

<style>
#test {
  font-family: 'Comfortaa', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
