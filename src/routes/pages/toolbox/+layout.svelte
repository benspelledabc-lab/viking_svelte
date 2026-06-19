<script lang="ts">
  import { authStore } from "$lib/stores/auth";
  import { goto } from "$app/navigation";

  let { children } = $props();

  // Redirect to login if not authenticated
  $effect(() => {
    if (!$authStore.loading && !$authStore.isLoggedIn) {
      goto("/login");
    }
  });
</script>

{#if !$authStore.loading}
  {#if $authStore.isLoggedIn}
    {@render children()}
  {/if}
{/if}
