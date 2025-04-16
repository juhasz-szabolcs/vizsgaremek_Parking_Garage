<script>
    import { onMount } from "svelte";
    import { user, isAuthenticated } from "$lib/store";
    import { goto } from "$app/navigation";
    import { deleteCar } from "$lib/api";

    let users = [];
    let loading = true;
    let error = "";
    let success = "";
    let expandedUsers = new Set();
    let searchTerm = "";

    // Computed property for filtered users
    $: filteredUsers = users.filter(user => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(searchLower);
    });

    onMount(async () => {
        if (!$isAuthenticated || !$user || !$user.isAdmin) {
            console.log('User not authenticated or not admin, redirecting to home');
            goto("/");
            return;
        }
        await loadUsers();
    });

    async function loadUsers() {
        loading = true;
        error = "";

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            users = result;
            // console.log("Loaded users:", users);
        } catch (error) {
            console.error("Error loading users:", error);
            error = "Hiba történt a felhasználók betöltése során";
        } finally {
            loading = false;
        }
    }

    async function handleDeleteUser(userId) {
        if (confirm('Biztosan törölni szeretnéd ezt a felhasználót?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                if (response.status === 200) {
                    await loadUsers();
                    success = "Felhasználó sikeresen törölve!";
                    setTimeout(() => {
                        success = "";
                    }, 1500);
                } else {
                    error = 'Hiba történt a felhasználó törlése során.';
                }
            } catch (err) {
                console.error('Error deleting user:', err);
                error = 'Hiba történt a felhasználó törlése során.';
            }
        }
    }

    async function handleDeleteCar(carId) {
        if (confirm('Biztosan törölni szeretnéd ezt az autót?')) {
            try {
                const result = await deleteCar(carId);
                if (result.success) {
                    await loadUsers();
                    success = "Autó sikeresen törölve!";
                    setTimeout(() => {
                        success = "";
                    }, 1500);
                } else {
                    error = result.error || 'Hiba történt az autó törlése során.';
                }
            } catch (err) {
                console.error('Error deleting car:', err);
                error = 'Hiba történt az autó törlése során.';
            }
        }
    }

    //User cars toggle
    function toggleUserCars(userId) {
        if (expandedUsers.has(userId)) {
            expandedUsers.delete(userId);
        } else {
            expandedUsers.add(userId);
        }
        expandedUsers = expandedUsers; // Trigger reactivity
    }
</script>

<div class="container">
    <h1>Felhasználók</h1>

    <div class="search-container">
        <input
            type="text"
            bind:value={searchTerm}
            placeholder="Keresés név alapján..."
            class="search-input"
        />
    </div>

    {#if error}
        <div class="alert alert-danger" role="alert">
            {error}
        </div>
    {/if}

    {#if success}
        <div class="alert alert-success" role="alert">
            {success}
        </div>
    {/if}

    {#if loading}
        <div class="loading">
            <i class="bi bi-arrow-repeat"></i>
            <p>Betöltés...</p>
        </div>
    {:else}
        <div class="users-grid">
            {#each filteredUsers as user}
                <div class="user-card">
                    <div class="user-header">
                        <h3>{user.firstName} {user.lastName}</h3>
                        <div class="header-actions">
                            {#if user.isAdmin}
                                <span class="admin-badge">Admin</span>
                            {/if}

                            <button class="delete-button svelte-1rr27ky" on:click={() => handleDeleteUser(user.id)}>
                                <i class="bi bi-trash"></i>
                                <span>Törlés</span>
                            </button>
                        </div>
                    </div>
                    <div class="user-details">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Telefonszám:</strong> {user.phoneNumber}</p>
                        <p><strong>Autók száma:</strong> {user.cars?.length || 0}</p>
                        <!-- <p><strong>Regisztráció dátuma:</strong> {new Date(user.createdAt).toLocaleDateString('hu-HU')}</p> -->
                    </div>
                    {#if user.cars && user.cars.length > 0}
                        <div class="cars-toggle" on:click={() => toggleUserCars(user.id)}>
                            <span>Autók megtekintése</span>
                            <i class="bi {expandedUsers.has(user.id) ? 'bi-chevron-down' : 'bi-chevron-right'}"></i>
                        </div>
                        {#if expandedUsers.has(user.id)}
                            <div class="cars-section">
                                {#each user.cars as car}
                                    <div class="car-item">
                                        <div class="car-info">
                                            <span class="car-name">{car.brand} {car.model}</span>
                                            <span class="car-year">{car.year}</span>
                                        </div>
                                        <div class="car-details">
                                            <span class="license-plate">{car.licensePlate}</span>
                                            <div class="car-actions">
                                                <span class="parking-status {car.isParked ? 'parked' : 'not-parked'}">
                                                    {car.isParked ? 'Parkolóban' : 'Nincs parkolóban'}
                                                </span>
                                                <button class="delete-button" on:click={() => handleDeleteCar(car.id)}>
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        margin-bottom: 2rem;
        color: #2c3e50;
    }

    .users-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .user-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .user-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .user-header h3 {
        margin: 0;
        color: #2c3e50;
    }

    .admin-badge {
        background-color: #dc3545;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
    }

    .user-details {
        color: #6c757d;
        margin-bottom: 1rem;
    }

    .user-details p {
        margin: 0.5rem 0;
    }

    .cars-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem;
        background-color: #f8f9fa;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 1rem;
        transition: background-color 0.3s;
    }

    .cars-toggle:hover {
        background-color: #e9ecef;
    }

    .cars-section {
        margin-top: 1rem;
        border-top: 1px solid #e9ecef;
        padding-top: 1rem;
    }

    .car-item {
        background-color: #f8f9fa;
        border-radius: 4px;
        padding: 0.75rem;
        margin-bottom: 0.5rem;
    }

    .car-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .car-name {
        font-weight: 500;
        color: #2c3e50;
    }

    .car-year {
        color: #6c757d;
        font-size: 0.9rem;
    }

    .car-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .car-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .car-actions .delete-button {
        padding: 0.25rem;
    }

    .car-actions .delete-button i {
        font-size: 0.9rem;
    }

    .license-plate {
        font-family: monospace;
        font-weight: 500;
        color: #2c3e50;
    }

    .parking-status {
        font-size: 0.9rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }

    .parking-status.parked {
        background-color: #d4edda;
        color: #155724;
    }

    .parking-status.not-parked {
        background-color: #f8d7da;
        color: #721c24;
    }

    .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .loading i {
        font-size: 2rem;
        color: #3498db;
        margin-bottom: 1rem;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        100% {
            transform: rotate(360deg);
        }
    }

    .alert {
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .alert-danger {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }

    .alert-success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .delete-button {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        background: none;
        border: none;
        color: #dc3545;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background-color 0.3s;
    }

    .delete-button:hover {
        background-color: #f8f9fa;
    }

    .delete-button i {
        font-size: 1rem;
    }

    .delete-button span {
        font-size: 0.9rem;
    }

    .search-container {
        margin-bottom: 2rem;
    }

    .search-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.3s;
    }

    .search-input:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    }
</style> 