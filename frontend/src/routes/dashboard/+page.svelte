<script>
    import { onMount } from "svelte";
    import { getUserData } from "$lib/api";
    import { user, isAuthenticated } from "$lib/store";
    import { goto } from "$app/navigation";

    //  /////////////
    // Hardcoded dashboard data
    const hardcodedDashboardData = {
        user: {
            id: 1,
            name: "Juhász Szabolcs",
            email: "teszt@example.com",
            balance: 15000,
            memberSince: "2023-05-15"
        },
        car: {
            id: 1,
            name: "Toyota Corolla"
        },
        parkingSpots: {
            total: 120,
            available: 43,
            reserved: 77,
            yourReserved: 1
        },
        activeReservations: [
            {
                id: 1,
                spotId: "A-23",
                startTime: "2025-03-19T18:30:00",
                endTime: "2025-03-20T08:30:00",
                vehicle: "Toyota Corolla (ABC-123)",
                cost: 2500
            }
        ],
        recentActivity: [
            {
                id: 1,
                type: "reservation",
                spotId: "A-23",
                vehicle: "Toyota Corolla (ABC-123)",
                timestamp: "2025-03-19T18:30:00",
                amount: -2500,
                description: "Parkolóhely foglalás"
            },
            {
                id: 2,
                type: "topup",
                timestamp: "2025-03-17T14:22:33",
                amount: 10000,
                description: "Egyenlegfeltöltés"
            },
            {
                id: 3,
                type: "reservation",
                spotId: "B-12",
                vehicle: "Audi A4 (SU0-71J)",
                timestamp: "2025-03-15T09:15:00",
                amount: -3000,
                description: "Parkolóhely foglalás"
            },
            {
                id: 4,
                type: "cancellation",
                spotId: "C-07",
                vehicle: "Toyota Corolla (ABC-123)",
                timestamp: "2025-03-10T16:45:00",
                amount: 1200,
                description: "Foglalás lemondása (részleges visszatérítés)"
            }
        ],
        statistics: {
            monthlySpending: 7500,
            totalReservations: 12,
            favoriteSpot: "A-23",
            averageStay: "14 óra"
        }
    };

    let dashboardData = null;
    /// //////////////
    
    let userData = null;
    let loading = true;
    let error = "";

    onMount(async () => {
        if ($isAuthenticated && $user?.id) {
            const result = await getUserData($user.id);
            if (result.success) {
                $user = {
                    ...$user,
                    ...result.data
                };
                console.log('User data loaded:', $user);
            }
        }
    });

    onMount(() => {
        loadDashboard();
    });

    async function loadDashboard() {
        loading = true;
        error = "";

        try {
            // Comment out API call
            // const result = await getUserData();
            // 
            // if (result.success) {
            //     dashboardData = result.data;
            // } else {
            //     error = typeof result.error === "string" 
            //         ? result.error 
            //         : "Nem sikerült betölteni a dashboard adatokat.";
            // }
            
            // Use hardcoded data instead
            dashboardData = hardcodedDashboardData;
        } catch (e) {
            console.error("Error loading dashboard:", e);
            error = "Hiba történt az adatok betöltése közben.";
        } finally {
            loading = false;
        }
    }
</script>

<div class="dashboard-container">
    <h1>Parkolás kezelése</h1>

    {#if loading}
        <div class="loading">Adatok betöltése...</div>
    {:else if error}
        <div class="error-message">{error}</div>
    <!-- {:else if userData} -->
    {:else if dashboardData}
        <div class="dashboard-card">
            <!-- <h2>Üdvözöljük, {$user?.name || "Felhasználó"}!</h2> -->
            <h2>Üdvözöljük, {$user?.lastName}!</h2>
            <p>
                Az alábbiakban megtekintheti és kezelheti parkolóházi
                adatait.
            </p>

            <!-- További irányítópult tartalom -->
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Parkoló autó</h3>
                    <p class="stat-number">{dashboardData.car.name}</p>
                    <p class="loading2">SU-071JZ</p>


                    <!-- <p class="stat-number">{userData.cars?.length || 0}</p> -->
                    <!-- <p class="stat-number">{userData.car?.name || ""}</p> -->
                </div>

                <div class="stat-card">
                    <h3>Parkolási idő</h3>
                    <p class="stat-number">1 óra</p>
                </div>

                <div class="stat-card">
                    <h3>Egyenleg</h3>
                    <p class="stat-number">400 Ft</p>
                </div>
            </div>

            <div class="dashboard-actions">
                <a href="/cars" class="button primary">Autóim kezelése</a>
                <a href="/payment" class="button secondary">Parkolás befejezése</a
                >
            </div>
        </div>
    {:else}
        <div class="no-data">Nincs elérhető felhasználói adat. <br>
            Jelenleg nincs aktív parkolás.
        </div>
    {/if}
</div>

<style>
    .dashboard-container {
        max-width: 1000px;
        margin: 0 auto;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 2rem;
        color: #2c3e50;
        text-align: center;
    }

    .dashboard-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }

    h2 {
        color: #2c3e50;
        margin-bottom: 1rem;
    }

    .loading {
        text-align: center;
        font-size: 1.2rem;
        color: #7f8c8d;
        padding: 2rem;
    }

    .loading2 {
        text-align: center;
        font-size: 1.2rem;
        color: #7f8c8d;
    }



    .error-message {
        background-color: #f8d7da;
        color: #721c24;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1.5rem;
    }

    .no-data {
        text-align: center;
        font-size: 1.2rem;
        color: #7f8c8d;
        padding: 2rem;
    }

    .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
    }

    .stat-card {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .stat-card h3 {
        margin-bottom: 0.5rem;
        color: #34495e;
    }

    .stat-number {
        font-size: 2rem;
        font-weight: bold;
        color: #3498db;
    }

    .dashboard-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
    }

    .button {
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.3s;
    }

    .primary {
        background-color: #3498db;
        color: white;
    }

    .primary:hover {
        background-color: #2980b9;
    }

    .secondary {
        background-color: #2c3e50;
        color: white;
    }

    .secondary:hover {
        background-color: #1a252f;
    }
</style>
