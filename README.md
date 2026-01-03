# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.



## Nginx Proxy Manager  
Custom error pages are nice for when the container dies.  

proxy_intercept_errors on;

error_page 502 503 504 = @backend_down;

location @backend_down {  
    internal;  
    default_type text/html; 
    return 200 '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Service Offline</title><style>:root{--bg:#313942;--ghost:#528cce;--heading:#e7ebf2}*{box-sizing:border-box}body{margin:0;background:var(--bg);font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif}main{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center}h1{color:var(--heading);font-size:12.5rem;letter-spacing:.1em;margin:.025em 0;white-space:nowrap;text-shadow:.05em .05em 0 rgba(0,0,0,.25)}@media(max-width:30rem){h1{font-size:8.5rem}}h1 span{display:inline-block;color:var(--ghost);animation:spooky 2s alternate infinite linear}h2{color:var(--heading);margin-bottom:.4em}p{color:#ccc;margin-top:0}@keyframes spooky{from{transform:translateY(.15em) scaleY(.95)}to{transform:translateY(-.15em)}}</style></head><body><main><h1>4<span>👻</span>4</h1><h2>Service Temporarily Unavailable</h2><p>The backend container for this route is currently offline.</p></main></body></html>';  
}  
