<script>
    import { onMount } from "svelte";
    import { user, isAuthenticated } from "$lib/store";
    import { goto } from "$app/navigation";
    import { deleteCar } from "$lib/api";

    let cars = [];
    let loading = true;
    let error = "";
    let success = "";

    onMount(async () => {
        if (!$isAuthenticated || !$user || !$user.isAdmin) {
            console.log('User not authenticated or not admin, redirecting to home');
            goto("/");
            return;
        }
        await loadAllCars();
    });

    async function loadAllCars() {
        loading = true;
        error = "";

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cars/all`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            cars = result;
            // console.log("Loaded all cars:", cars);
        } catch (error) {
            console.error("Error loading cars:", error);
            error = "Hiba történt az autók betöltése során";
        } finally {
            loading = false;
        }
    }

    async function handleDeleteCar(carId) {
        if (confirm('Biztosan törölni szeretnéd ezt az autót?')) {
            try {
                const result = await deleteCar(carId);
                if (result.success) {
                    await loadAllCars();
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
</script>

<div class="container">
    <h1>Összes autó</h1>

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
        <div class="cars-grid">
            {#each cars as car}
                <div class="car-card">
                    <div class="car-header">
                        <h3>{car.brand} {car.model}</h3>
                        <button class="delete-button" on:click={() => handleDeleteCar(car.id)}>
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="car-details">
                        <p><strong>Rendszám:</strong> {car.licensePlate}</p>
                        <p><strong>Évjárat:</strong> {car.year}</p>
                        <p><strong>Tulajdonos:</strong> {car.userName}</p>
                        <p><strong>Email:</strong> {car.userEmail}</p>
                        <p><strong>Parkoló állapot:</strong> {car.isParked ? 'Parkolóban' : 'Nincs parkolóban'}</p>
                    </div>
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

    .cars-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .car-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .car-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .car-header h3 {
        margin: 0;
        color: #2c3e50;
    }

    .delete-button {
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

    .car-details {
        color: #6c757d;
    }

    .car-details p {
        margin: 0.5rem 0;
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
</style> 