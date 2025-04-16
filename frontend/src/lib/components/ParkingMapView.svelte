<script>
    import { onMount } from 'svelte';
    import apiClient from '$lib/apiClient';
    import { user } from '$lib/store';
    import { getCarLogo } from '$lib/utils/carLogos';
    
    let parkingSpots = [];
    let loading = true;
    let error = '';
    let activeFloor = '1';
    let userCars = [];
    
    onMount(async () => {
        await loadUserCars();
        await loadParkingSpots();
    });
    
    async function loadUserCars() {
        try {
            const response = await apiClient.get('/api/cars');
            userCars = response.data;
        } catch (err) {
            console.error('Error loading user cars:', err);
        }
    }
    
    async function loadParkingSpots() {
        try {
            const response = await apiClient.get('/api/parking/spots');
            parkingSpots = response.data;
            // Inicializáljuk az üres parkolóhelyeket
            if (!parkingSpots || parkingSpots.length === 0) {
                parkingSpots = Array(20).fill(null).map((_, index) => {
                    const row = Math.floor(index / 5);  // 0-3
                    const col = index % 5;              // 0-4
                    const spotNumber = String.fromCharCode(65 + row) + (col + 1).toString().padStart(2, '0');
                    return {
                        id: ((parseInt(activeFloor) - 1) * 20) + (row * 5) + col + 1,
                        spotNumber: spotNumber,
                        floorNumber: activeFloor,
                        isOccupied: false,
                        carId: null
                    };
                });
            }
        } catch (err) {
            console.error('Error loading parking spots:', err);
            error = 'Hiba történt a parkolóhelyek betöltése során.';
        } finally {
            loading = false;
        }
    }
    
    function getSpotStatus(spot) {
        if (!spot) return '';
        if (spot.isOccupied) {
            return 'occupied';
        }
        if (spot.carId) {
            return 'reserved';
        }
        return 'available';
    }

    function isUserCar(spot) {
        if (!spot || !spot.carId) return false;
        return userCars.some(car => car.id === spot.carId && car.isParked);
    }
</script>

<div class="parking-container">
    <div class="parking-map-container">
        <div class="parking-header">
            <h3>Parkolóhelyek térképe</h3>
            <div class="floor-selector">
                <button 
                    class="floor-button {activeFloor === '1' ? 'active' : ''}"
                    on:click={() => activeFloor = '1'}>
                    P1
                </button>
                <button 
                    class="floor-button {activeFloor === '2' ? 'active' : ''}"
                    on:click={() => activeFloor = '2'}>
                    P2
                </button>
                <button 
                    class="floor-button {activeFloor === '3' ? 'active' : ''}"
                    on:click={() => activeFloor = '3'}>
                    P3
                </button>
            </div>
        </div>
        
        <div class="parking-content">
            {#if loading}
                <div class="loading">Parkolóhelyek betöltése...</div>
            {:else if error}
                <div class="error">{error}</div>
            {:else}
                <div class="parking-stats">
                    <div class="stat-item">
                        <span class="stat-label">Szabad helyek:</span>
                        <span class="stat-value available">{parkingSpots.filter(spot => !spot.isOccupied && !spot.carId).length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Foglalt helyek:</span>
                        <span class="stat-value occupied">{parkingSpots.filter(spot => spot.isOccupied).length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Foglalva:</span>
                        <span class="stat-value reserved">{parkingSpots.filter(spot => spot.carId && !spot.isOccupied).length}</span>
                    </div>
                </div>

                <div class="legend">
                    <div class="legend-item">
                        <div class="legend-box available"></div>
                        <span>Szabad</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-box occupied"></div>
                        <span>Foglalt</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-box reserved"></div>
                        <span>Foglalva</span>
                    </div>
                </div>
                
                <div class="parking-grid">
                    {#each Array(4) as _, row}
                        <div class="parking-row">
                            {#each Array(5) as _, col}
                                {@const spotNumber = String.fromCharCode(65 + row) + (col + 1).toString().padStart(2, '0')}
                                {@const spot = parkingSpots.find(s => 
                                    s.floorNumber === activeFloor && 
                                    s.spotNumber === spotNumber
                                ) || {
                                    id: ((parseInt(activeFloor) - 1) * 20) + (row * 5) + col + 1,
                                    spotNumber: spotNumber,
                                    floorNumber: activeFloor,
                                    isOccupied: false,
                                    carId: null
                                }}
                                {@const isUserCarSpot = isUserCar(spot)}
                                {@const userCar = isUserCarSpot ? userCars.find(car => car.id === spot.carId) : null}
                                <div class="spot {getSpotStatus(spot)} {isUserCarSpot ? 'user-car' : ''}">
                                    <div class="spot-label">{spotNumber}</div>
                                    <div class="spot-status">
                                        {#if isUserCarSpot}
                                            <div class="user-car-info">
                                                <div class="license-plate">{userCar.licensePlate}</div>
                                                <img src={getCarLogo(userCar.brand)} alt={userCar.brand} class="car-logo" />
                                            </div>
                                        {:else if spot.isOccupied}
                                            Foglalt
                                        {:else if spot.carId}
                                            Foglalva
                                        {:else}
                                            Szabad
                                        {/if}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .parking-container {
        width: 100%;
        height: calc(100vh - 100px);
        background-color: #f8f9fa;
        padding: 0.25rem;
        display: flex;
        flex-direction: column;
    }

    .parking-map-container {
        background: white;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        max-width: 900px;
        margin: 0 auto;
        width: 100%;
    }

    .parking-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;
        flex-wrap: wrap;
        gap: 0.25rem;
    }

    .parking-header h3 {
        margin: 0;
        font-size: 2rem;
        color: #2c3e50;
    }

    .floor-selector {
        display: flex;
        gap: 0.25rem;
    }

    .floor-button {
        padding: 0.25rem 0.5rem;
        border: none;
        border-radius: 3px;
        background: #f0f0f0;
        cursor: pointer;
        transition: all 0.3s;
        min-width: 40px;
        font-weight: 500;
        font-size:1rem;
    }

    .floor-button.active {
        background: #e74c3c;
        color: white;
    }

    .parking-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        margin-bottom: 0.25rem;
        padding: 0.25rem;
        background: #f8f9fa;
        border-radius: 3px;
        gap: 0.25rem;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .stat-label {
        font-size: 1rem;
        color: #666;
        white-space: nowrap;
    }

    .stat-value {
        font-size: 1.2rem;
        font-weight: bold;
    }

    .stat-value.available {
        color: #2ecc71;
    }

    .stat-value.occupied {
        color: #e74c3c;
    }

    .stat-value.reserved {
        color: #f39c12;
    }

    .legend {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        margin-bottom: 0.25rem;
        padding: 0.25rem;
        background: #f8f9fa;
        border-radius: 3px;
        gap: 0.25rem;
    }

    .legend-item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        font-size: 0.7rem;
    }

    .legend-box {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        flex-shrink: 0;
    }

    .legend-box.available {
        background-color: #2ecc71;
    }

    .legend-box.occupied {
        background-color: #e74c3c;
    }

    .legend-box.reserved {
        background-color: #f39c12;
    }

    .parking-grid {
        display: grid;
        gap: 0.25rem;
        margin-bottom: 0.25rem;
        flex: 1;
        min-height: 0;
        aspect-ratio: 1.25;
        max-height: calc(100vh - 250px);
    }

    .parking-row {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 0.25rem;
    }

    .spot {
        aspect-ratio: 1;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        text-align: center;
        font-size: 0.9rem;
        min-height: 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;
    }

    .spot.available {
        background-color: #2ecc71;
        color: white;
        border: none;
    }

    .spot.occupied {
        background-color: #e74c3c;
        color: white;
        border: none;
    }

    .spot.reserved {
        background-color: #f39c12;
        color: white;
        border: none;
    }

    .spot.user-car {
        background-color: #3498db;
        color: white;
        border: none;
    }

    .spot-label {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 0.25rem;
    }

    .spot-status {
        font-size: 0.9rem;
        opacity: 0.9;
    }

    .user-car-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .license-plate {
        font-weight: bold;
        font-size: 1rem;
    }

    .car-logo {
        width: 32px;
        height: 32px;
        object-fit: contain;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        padding: 4px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 1024px) {
        .parking-map-container {
            max-width: 800px;
            padding: 0.75rem;
        }

        .spot {
            padding: 0.4rem;
            font-size: 0.8rem;
        }

        .spot-label {
            font-size: 1rem;
        }

        .spot-status {
            font-size: 0.8rem;
        }

        .license-plate {
            font-size: 0.9rem;
        }

        .car-logo {
            width: 28px;
            height: 28px;
            padding: 3px;
        }

        .stat-label {
            font-size: 0.9rem;
        }

        .stat-value {
            font-size: 1.1rem;
        }
    }

    @media (max-width: 768px) {
        .parking-container {
            height: calc(100vh - 100px);
            padding: 0.125rem;
        }

        .parking-map-container {
            max-width: 600px;
            padding: 0.5rem;
        }

        .parking-header h3 {
            font-size: 1.2rem;
        }

        .floor-button {
            padding: 0.25rem 0.5rem;
            font-size: 0.8rem;
        }

        .spot {
            padding: 0.3rem;
            font-size: 0.7rem;
        }

        .spot-label {
            font-size: 0.85rem;
            margin-bottom: 0.125rem;
        }

        .spot-status {
            font-size: 0.7rem;
        }

        .license-plate {
            font-size: 0.8rem;
        }

        .car-logo {
            width: 24px;
            height: 24px;
            padding: 2px;
        }

        .stat-label {
            font-size: 0.85rem;
        }

        .stat-value {
            font-size: 1rem;
        }
    }

    @media (max-width: 480px) {
        .parking-container {
            height: calc(100vh - 80px);
        }

        .parking-map-container {
            padding: 0.25rem;
        }

        .spot {
            padding: 0.25rem;
            font-size: 0.6rem;
            border-radius: 8px;
        }

        .spot-label {
            font-size: 0.7rem;
            margin-bottom: 0.1rem;
        }

        .spot-status {
            font-size: 0.6rem;
        }

        .license-plate {
            font-size: 0.65rem;
        }

        .car-logo {
            width: 20px;
            height: 20px;
            padding: 2px;
        }

        .stat-label {
            font-size: 0.8rem;
        }

        .stat-value {
            font-size: 0.9rem;
        }
    }
</style> 