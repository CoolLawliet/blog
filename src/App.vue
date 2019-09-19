<template>
  <div id="app" >
    <Navbar></Navbar>
    <router-view/>
  </div>
</template>

<script>
  import Navbar from './components/Header'

  export default {
    name: 'App',
    components: {
      Navbar
    }
  }
</script>

<style>
</style>
