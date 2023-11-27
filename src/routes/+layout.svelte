<script>
    import { onMount } from 'svelte';

    let user = '';
    onMount(() => {
        user = sessionStorage.getItem('username');
    });
    const logout = (()=> {
        sessionStorage.clear();
        location.reload();
    });
</script>

<nav>
    <a href="/">Home</a>
    {#if user}
        <button  on:click={logout}>Logout</button>
    {:else}
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    {/if}
    {user?'Active user: ' + user:'Not logged in'}
</nav>

<slot></slot>
