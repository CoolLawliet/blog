<template>
  <div class="alert" role="alert" :class="'alert-' + variant">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'Alert',  //this is the name of the component
  props: ['variant', 'message']
}
</script>
