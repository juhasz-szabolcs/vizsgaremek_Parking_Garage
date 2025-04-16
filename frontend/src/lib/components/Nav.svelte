<script>
    import { isAuthenticated, user } from "$lib/store";
    import { logout } from "$lib/api";
    import { goto } from "$app/navigation";

    async function handleLogout() {
        try {
            const result = await logout();
            if (result.success) {
                // Clear user data from store
                $user = null;
                $isAuthenticated = false;
                // Clear localStorage
                localStorage.removeItem('user');
                // Redirect to home page
                goto("/");
            } else {
                console.error("Logout failed:", result.error);
            }
        } catch (error) {
            console.error("Error during logout:", error);
            // Even if the API call fails, we should still log out locally
            $user = null;
            $isAuthenticated = false;
            localStorage.removeItem('user');
            goto("/");
        }
    }
</script>

<nav>
    <div class="logo">Parkolóház</div>
    <div class="links">
        <a href="/">Főoldal</a>
        {#if $isAuthenticated}
            <a href="/dashboard">Parkolás kezelése</a>
            <a href="/cars">Autóim</a>
            {#if $user?.isAdmin}
                <div class="relative group">
                    <button class="flex items-center space-x-2 text-white hover:text-indigo-300">
                        <span>Admin</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                        <a href="/admin/profiles" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Felhasználók</a>
                        <a href="/admin/cars" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Össz autó</a>
                        <a href="/admin/statistics" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Statisztikák</a>
                    </div>
                </div>
            {/if}
            <button on:click={handleLogout}>Kijelentkezés</button>
        {:else}
            <a href="/login">Bejelentkezés</a>
            <a href="/register">Regisztráció</a>
        {/if}
    </div>
</nav>

<style>
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: #2c3e50;
        color: white;
    }

    .logo {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .links {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    a,
    button {
        color: white;
        text-decoration: none;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background-color 0.3s;
    }

    a:hover,
    button:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .group {
        position: relative;
    }

    .group:hover .hidden {
        display: block;
    }

    .hidden {
        display: none;
    }
</style>
