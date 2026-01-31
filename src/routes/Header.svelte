<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { authStore } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import logo from "$lib/images/svelte-logo.svg";
  import github from "$lib/images/github.svg";

  async function handleLogout() {
    await authStore.logout();
    goto("/login");
  }
</script>

<header>
  <!-- todo: update this image -->
  <div class="corner">
    <!-- THIS IS BLANK -->
  </div>
  <!-- <div class="corner">
		<a href="https://svelte.dev/docs/kit">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div> -->

  <nav>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg>
    <ul>
      <li aria-current={page.url.pathname === "/" ? "page" : undefined}>
        <a href={resolve("/")}>Home</a>
      </li>
      <li
        aria-current={page.url.pathname.startsWith("/handloads")
          ? "page"
          : undefined}
      >
        <a href={resolve("/handloads")}>Handloads</a>
      </li>
      <li aria-current={page.url.pathname.startsWith("/pages")? "page": undefined}>
        <a href={resolve("/pages")}>Pages</a>
      </li>
      <!-- <li aria-current={page.url.pathname === "/toolkit" ? "page" : undefined}>
        <a href={resolve("/toolkit")}>Toolkit</a>
      </li> -->
      <!-- <li aria-current={page.url.pathname === "/about" ? "page" : undefined}>
        <a href={resolve("/about")}>About</a>
      </li> -->

      <li aria-current={page.url.pathname.startsWith("/misc") ? "page" : undefined}>
        <a href={resolve("/misc")}>MISC</a>
      </li>

      {#if $authStore.isLoggedIn}
        <li class="auth-action" aria-current={page.url.pathname.startsWith("/toolbox") ? "page" : undefined}>
          <a href={resolve("/toolbox")}>Toolbox</a>
        </li>
      {/if}

      {#if !$authStore.isLoggedIn}
        <li aria-current={page.url.pathname === "/login" ? "page" : undefined}>
          <a href={resolve("/login")}>Login</a>
        </li>
      {:else}
        <li class="auth-action">
          <a href="#" on:click|preventDefault={handleLogout}>
            Logout: {$authStore.user?.username}
          </a>
        </li>
      {/if}

      <!-- <li aria-current={page.url.pathname.startsWith('/sverdle') ? 'page' : undefined}>
				<a href={resolve('/sverdle')}>Sverdle</a>
			</li> -->
    </ul>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
    </svg>
  </nav>

  <!-- User section -->
  <!-- <div class="corner user-section">
    {#if $authStore.isLoggedIn && $authStore.user}
      <div class="user-info">
        <span class="username">{$authStore.user.username}</span>
        <button class="logout-btn" on:click={handleLogout} title="Logout">
          Logout
        </button>
      </div>
    {/if}
  </div> -->
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
  }

  .corner {
    width: 3em;
    height: 3em;
  }

  .corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  .user-section {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    width: auto;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .username {
    font-weight: 600;
    color: var(--color-text);
  }

  .logout-btn {
    padding: 0.25rem 0.75rem;
    background-color: var(--color-theme-1);
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .logout-btn:hover {
    opacity: 0.8;
  }

  nav {
    display: flex;
    justify-content: center;
    --background: rgba(255, 255, 255, 0.7);
  }

  svg {
    width: 2em;
    height: 3em;
    display: block;
  }

  path {
    fill: var(--background);
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
  }

  li[aria-current="page"]::before {
    --size: 6px;
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--color-theme-1);
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    color: var(--color-theme-1);
  }

  li.auth-action a {
    color: var(--color-theme-1);
    font-weight: 900;
  }

  li.auth-action a:hover {
    opacity: 0.8;
  }
</style>
