<script lang="ts">
  import { authStore } from "$lib/stores/auth";
  import { goto } from "$app/navigation";

  let username = "";
  let password = "";
  let isLoading = false;

  async function handleLogin() {
    isLoading = true;
    const success = await authStore.login(username, password);
    isLoading = false;

    if (success) {
      // Redirect to home page or toolbox
      goto("/toolbox");
    }
  }

  $: error = $authStore.error;
</script>

<svelte:head>
  <title>Login</title>
  <meta name="description" content="Login to your account" />
</svelte:head>

<selection>
  <h2>Login (uses cookies)</h2>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>

      <form on:submit|preventDefault={handleLogin}>
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            bind:value={username}
            placeholder="Enter your username"
            required
            disabled={isLoading}
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            bind:value={password}
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </div>

        {#if error}
          <div class="error-message">
            {error}
          </div>
        {/if}

        <button type="submit" disabled={isLoading || !username || !password}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  </div>
</selection>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    /* 100 was the copilot value. i moved it higher up. */
    min-height: 20vh;
    padding: 1rem;
  }

  .login-card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 100%;
    max-width: 400px;
  }

  h1 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #333;
  }

  .form-group {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }

  input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: #4caf50;
  }

  input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover:not(:disabled) {
    background-color: #45a049;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .error-message {
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.75rem;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    border: 1px solid #f5c6cb;
  }
</style>
