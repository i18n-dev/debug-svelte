<svelte:options customElement={{ tag: "i-test", shadow: "none" }} />

<script>
  import { onMount } from "svelte";
  onMount(() => {
    console.log(456);
  });
</script>

<p>123</p>

<style>
  p {
    font-size: 20px;
  }
</style>
