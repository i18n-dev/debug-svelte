<script lang="coffee">
> svelte > onMount

onMount =>
  console.log 123
  return
</script>

<template lang="pug">
main 456
</template>

<style lang="stylus">
main
  user-select none
  width 350px
  display flex
  flex-direction column
  align-items center
</style>
