<script>
    import { onMount } from 'svelte';
    import { user, isAuthenticated } from '$lib/store';
    import { getUserData } from '$lib/api';
    import { goto } from '$app/navigation';

    let userData = null;
    let loading = true;
    let error = null;

    onMount(async () => {
        // Ellenőrizzük a bejelentkezési állapotot
        if (!$isAuthenticated) {
            console.log('User not authenticated, redirecting to login');
            goto('/login');
            return;
        }

        // Ellenőrizzük, hogy van-e user ID
        if (!$user?.id) {
            console.error('No user ID found in store:', $user);
            // Próbáljuk meg újratölteni a felhasználó adatait
            try {
                const result = await getUserData($user.email);
                if (result.success) {
                    $user = {
                        ...$user,
                        ...result.data
                    };
                    console.log('User data reloaded:', $user);
                } else {
                    console.error('Failed to reload user data:', result.error);
                    goto('/login');
                    return;
                }
            } catch (err) {
                console.error('Error reloading user data:', err);
                goto('/login');
                return;
            }
        }

        try {
            // console.log('Fetching user data for ID:', $user.id);
            const result = await getUserData($user.id);
            // console.log('User data result:', result);
            
            if (result.success) {
                userData = result.data;
            } else {
                error = 'Nem sikerült betölteni a felhasználó adatait.';
            }
        } catch (err) {
            console.error('Error loading profile:', err);
            error = 'Hiba történt a profil betöltése során.';
        } finally {
            loading = false;
        }
    });
</script>

<div class="profile-container">
    {#if loading}
        <div class="loading">Betöltés...</div>
    {:else if error}
        <div class="error-message">{error}</div>
    {:else if userData}
        <div class="profile-card">
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="profile-info">
                    <h1>{userData.firstName} {userData.lastName}</h1>
                    <p class="email">{userData.email}</p>
                </div>
            </div>

            <div class="profile-content">
                <div class="info-section">
                    <h2>Profil adatok</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Vezetéknév</label>
                            <span>{userData.lastName}</span>
                        </div>
                        <div class="info-item">
                            <label>Keresztnév</label>
                            <span>{userData.firstName}</span>
                        </div>
                        <div class="info-item">
                            <label>E-mail cím</label>
                            <span>{userData.email}</span>
                        </div>
                        <!-- <div class="info-item">
                            <label>Regisztráció dátuma</label>
                            <span>{new Date(userData.registrationDate).toLocaleDateString('hu-HU')}</span>
                        </div> -->
                    </div>
                </div>

                <div class="info-section">
                    <h2>Autók</h2>
                    <div class="cars-grid">
                        {#each userData.cars || [] as car}
                            <div class="car-card">
                                <img src={car.logo} alt={car.brand} class="car-logo" />
                                <div class="car-info">
                                    <h3>{car.brand} {car.model}</h3>
                                    <p>Rendszám: {car.licensePlate}</p>
                                    <p>Évjárat: {car.year}</p>
                                    <p class="status {car.isParking ? 'parking' : 'not-parking'}">
                                        {car.isParking ? 'Parkolás alatt' : 'Nincs parkolás alatt'}
                                    </p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .profile-container {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    .loading {
        text-align: center;
        font-size: 1.2rem;
        color: #666;
        padding: 2rem;
    }

    .error-message {
        background-color: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 4px;
        margin: 1rem 0;
    }

    .profile-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .profile-header {
        background: linear-gradient(135deg, #3498db, #2980b9);
        padding: 2rem;
        color: white;
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .profile-avatar {
        font-size: 5rem;
        color: rgba(255, 255, 255, 0.9);
    }

    .profile-info h1 {
        margin: 0;
        font-size: 2rem;
    }

    .profile-info .email {
        margin: 0.5rem 0 0;
        opacity: 0.9;
    }

    .profile-content {
        padding: 2rem;
    }

    .info-section {
        margin-bottom: 2rem;
    }

    .info-section h2 {
        color: #2c3e50;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .info-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .info-item label {
        color: #666;
        font-size: 0.9rem;
    }

    .info-item span {
        color: #2c3e50;
        font-size: 1.1rem;
        font-weight: 500;
    }

    .cars-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .car-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1.5rem;
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .car-logo {
        width: 60px;
        height: 60px;
        object-fit: contain;
    }

    .car-info {
        flex: 1;
    }

    .car-info h3 {
        margin: 0 0 0.5rem;
        color: #2c3e50;
    }

    .car-info p {
        margin: 0.25rem 0;
        color: #666;
    }

    .status {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }

    .status.parking {
        background-color: #d4edda;
        color: #155724;
    }

    .status.not-parking {
        background-color: #f8f9fa;
        color: #6c757d;
    }

    @media (max-width: 768px) {
        .profile-header {
            flex-direction: column;
            text-align: center;
            padding: 1.5rem;
        }

        .profile-avatar {
            font-size: 4rem;
        }

        .profile-content {
            padding: 1rem;
        }

        .info-grid, .cars-grid {
            grid-template-columns: 1fr;
        }
    }
</style> 