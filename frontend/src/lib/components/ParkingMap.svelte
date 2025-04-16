<script>
    import { onMount } from 'svelte';
    import apiClient from '$lib/apiClient';
    
    export let onSpotSelect;
    export let selectedCarId;
    
    let parkingSpots = [];
    let loading = true;
    let error = '';
    let activeFloor = '1';
    let selectedSpot = null;
    
    onMount(async () => {
        await loadParkingSpots();
    });
    
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
        if (selectedSpot && spot.id === selectedSpot.id) {
            return 'selected';
        }
        if (spot.isOccupied) {
            return 'occupied';
        }
        if (spot.carId) {
            return 'reserved';
        }
        return 'available';
    }

    function handleSpotClick(spot) {
        if (spot && !spot.isOccupied && !spot.carId) {
            selectedSpot = spot;
        }
    }

    function handleConfirmSelection() {
        if (!selectedCarId || !selectedSpot || !onSpotSelect) return;
        
        const spotToSend = {
            id: parseInt(selectedSpot.id),
            spotNumber: selectedSpot.spotNumber,
            floorNumber: selectedSpot.floorNumber,
            isOccupied: selectedSpot.isOccupied,
            carId: selectedCarId
        };
        onSpotSelect(spotToSend);
    }
</script>

<div class="parking-container">
    <div class="parking-map-container">
        <div class="parking-header">
            <h3>Válassz parkolóhelyet</h3>
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
                        <div class="legend-box selected"></div>
                        <span>Kiválasztva</span>
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
                                <div 
                                    class="spot {getSpotStatus(spot)} {!spot.isOccupied && !spot.carId ? 'selectable' : ''}"
                                    id="spot-{spot.id}"
                                    on:click={() => handleSpotClick(spot)}>
                                    <div class="spot-label">{spotNumber}</div>
                                    <div class="spot-status">
                                        {#if selectedSpot && spot.id === selectedSpot.id}
                                            Kiválasztva
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

                {#if selectedSpot}
                    <div class="selection-panel">
                        <p>Kiválasztott parkolóhely: {selectedSpot.spotNumber}</p>
                        <button class="confirm-button" id="confirm-button" on:click={handleConfirmSelection}>
                            Parkolás indítása
                        </button>
                    </div>
                {/if}
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
        padding: 0.25rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        max-width: 700px;
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
        font-size: 1rem;
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
        font-size: 0.8rem;
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
        font-size: 0.7rem;
        color: #666;
        white-space: nowrap;
    }

    .stat-value {
        font-size: 0.9rem;
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
        gap: 0.3rem;
    }

    .legend-item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
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

    .legend-box.selected {
        background-color: #f39c12;
        border: 2px dashed #e67e22;
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
        padding: 0.25rem;
        text-align: center;
        font-size: 0.7rem;
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
        cursor: not-allowed;
    }

    .spot.reserved {
        background-color: #f39c12;
        color: white;
        border: none;
        cursor: not-allowed;
    }

    .spot.selected {
        background-color: #f39c12;;
        color: white;
        border: 2px dashed rgb(240, 28, 28);

        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .spot.selectable {
        cursor: pointer;
        transition: all 0.2s;
    }

    .spot.selectable:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .spot-label {
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 0.125rem;
    }

    .spot-status {
        font-size: 0.6rem;
        opacity: 0.9;
    }

    .selection-panel {
        background: #f8f9fa;
        padding: 0.75rem;
        border-radius: 4px;
        margin-top: 0.75rem;
        text-align: center;
    }

    .selection-panel p {
        margin: 0 0 0.5rem 0;
        font-weight: 500;
        font-size: 0.9rem;
    }

    .confirm-button {
        background: #2ecc71;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 500;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .confirm-button:hover {
        background: #27ae60;
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        .parking-container {
            height: calc(100vh - 100px);
            padding: 0.125rem;
        }

        .parking-map-container {
            padding: 0.125rem;
        }

        .parking-header h3 {
            font-size: 0.9rem;
        }

        .floor-button {
            padding: 0.125rem 0.25rem;
            font-size: 0.7rem;
        }

        .stat-label {
            font-size: 0.65rem;
        }

        .stat-value {
            font-size: 0.8rem;
        }

        .legend-item {
            font-size: 0.65rem;
        }

        .spot-label {
            font-size: 0.7rem;
        }

        .spot-status {
            font-size: 0.55rem;
        }

        .selection-panel {
            padding: 0.5rem;
        }

        .selection-panel p {
            font-size: 0.8rem;
        }

        .confirm-button {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
        }
    }

    @media (max-width: 480px) {
        .parking-container {
            height: calc(100vh - 80px);
        }

        .spot-label {
            font-size: 0.65rem;
        }

        .spot-status {
            font-size: 0.5rem;
        }

        .selection-panel p {
            font-size: 0.75rem;
        }

        .confirm-button {
            font-size: 0.75rem;
            padding: 0.3rem 0.6rem;
        }
    }
</style> 