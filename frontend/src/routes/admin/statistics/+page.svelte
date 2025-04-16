<script>
    import { onMount } from 'svelte';
    import { getMonthlyRevenue } from '$lib/api';
    import { API_URL } from '$lib/apiClient';

    let monthlyRevenue = [];
    let selectedYear = new Date().getFullYear();
    let selectedMonth = new Date().getMonth() + 1;
    let years = [];
    let loading = false;
    let error = null;
    let isMonthlyDataExpanded = false;
    let isParkingStatusExpanded = false;
    let isDetailedRevenueExpanded = false;
    let parkingStatus = null;
    let parkingStatusLoading = false;
    let parkingStatusError = null;
    let detailedRevenue = null;
    let detailedRevenueLoading = false;
    let detailedRevenueError = null;
    let monthlyRevenueYear = null;
    const months = [
        { value: 1, name: 'Január' },
        { value: 2, name: 'Február' },
        { value: 3, name: 'Március' },
        { value: 4, name: 'Április' },
        { value: 5, name: 'Május' },
        { value: 6, name: 'Június' },
        { value: 7, name: 'Július' },
        { value: 8, name: 'Augusztus' },
        { value: 9, name: 'Szeptember' },
        { value: 10, name: 'Október' },
        { value: 11, name: 'November' },
        { value: 12, name: 'December' }
    ];

    // Generate years from current year to 5 years back
    $: {
        const currentYear = new Date().getFullYear();
        years = Array.from({ length: 6 }, (_, i) => currentYear - i);
    }

    async function loadMonthlyRevenue() {
        loading = true;
        error = null;
        try {
            const result = await getMonthlyRevenue(selectedYear);
            if (result.success) {
                monthlyRevenue = result.data.monthlyRevenue;
                monthlyRevenueYear = result.data.year;
                // console.log('MONTHLY REVENUE', monthlyRevenue);
            } else {
                error = result.error;
            }
        } catch (err) {
            console.error('Error loading monthly revenue:', err);
            error = 'Hiba történt az adatok betöltése során.';
        } finally {
            loading = false;
        }
    }

    async function loadParkingStatus() {
        parkingStatusLoading = true;
        parkingStatusError = null;
        try {
            const response = await fetch(`${API_URL}/api/admin/statistics/occupancy`, {
                credentials: 'include'
            });
            if (response.ok) {
                parkingStatus = await response.json();
            } else {
                parkingStatusError = 'Hiba történt az adatok betöltése során.';
                console.error('Error loading parking status');
            }
        } catch (err) {
            console.error('Error:', err);
            parkingStatusError = 'Hiba történt az adatok betöltése során.';
        } finally {
            parkingStatusLoading = false;
        }
    }

    async function loadDetailedRevenue() {
        detailedRevenueLoading = true;
        detailedRevenueError = null;
        try {
            const response = await fetch(`${API_URL}/api/admin/statistics/revenue?year=${selectedYear}&month=${selectedMonth}`, {
                credentials: 'include'
            });
            if (response.ok) {
                detailedRevenue = await response.json();
            } else {
                detailedRevenueError = 'Hiba történt az adatok betöltése során.';
                console.error('Error loading detailed revenue');
            }
        } catch (err) {
            console.error('Error:', err);
            detailedRevenueError = 'Hiba történt az adatok betöltése során.';
        } finally {
            detailedRevenueLoading = false;
        }
    }

    async function toggleMonthlyData() {
        isMonthlyDataExpanded = !isMonthlyDataExpanded;
        if (isMonthlyDataExpanded) {
            await loadMonthlyRevenue();
        }
    }

    async function toggleParkingStatus() {
        isParkingStatusExpanded = !isParkingStatusExpanded;
        if (isParkingStatusExpanded) {
            await loadParkingStatus();
        }
    }

    async function toggleDetailedRevenue() {
        isDetailedRevenueExpanded = !isDetailedRevenueExpanded;
        if (isDetailedRevenueExpanded) {
            await loadDetailedRevenue();
        }
    }

    async function handleYearSelection() {
        await loadMonthlyRevenue();
    }

    async function handleDetailedRevenueSelection() {
        await loadDetailedRevenue();
    }

    onMount(() => {
        // No longer load data on mount
    });
</script>

<div class="statistics-container">
    <div class="content-wrapper bg-white shadow-lg rounded-lg p-8 mx-4 my-6">
        <!-- <h1 class="text-3xl font-bold mb-8 px-4">Statisztikák</h1> -->

        <div class="px-4">
            <div class="mt-8">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">Aktuális parkolóhely statisztika</h2>
                <div class="border-t border-gray-200 pt-4">
                    <div class="flex justify-between items-center cursor-pointer mb-4 py-2" on:click={toggleParkingStatus}>
                        <span class="text-sm text-gray-500">Kattintson az aktuális adatok {isParkingStatusExpanded ? 'elrejtéséhez' : 'megjelenítéséhez'}</span>
                        <i class="bi {isParkingStatusExpanded ? 'bi-chevron-down' : 'bi-chevron-right'} text-gray-500 text-xl"></i>
                    </div>

                    {#if isParkingStatusExpanded}
                        {#if parkingStatusLoading}
                            <div class="d-flex justify-content-center align-items-center py-5">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Betöltés...</span>
                                </div>
                            </div>
                        {:else if parkingStatusError}
                            <div class="alert alert-danger mt-4" role="alert">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                {parkingStatusError}
                            </div>
                        {:else if parkingStatus}
                            <div class="row g-4 mt-2">
                                <div class="col-md-3">
                                    <div class="card border-0 bg-primary bg-opacity-10">
                                        <div class="card-body text-center">
                                            <i class="bi bi-p-circle-fill text-primary fs-1 mb-2"></i>
                                            <h5 class="card-title">Összes férőhely</h5>
                                            <p class="card-text fs-2">{parkingStatus.totalSpots}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card border-0 bg-danger bg-opacity-10">
                                        <div class="card-body text-center">
                                            <i class="bi bi-car-front-fill text-danger fs-1 mb-2"></i>
                                            <h5 class="card-title">Foglalt helyek</h5>
                                            <p class="card-text fs-2">{parkingStatus.occupiedSpots}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card border-0 bg-success bg-opacity-10">
                                        <div class="card-body text-center">
                                            <i class="bi bi-check-circle-fill text-success fs-1 mb-2"></i>
                                            <h5 class="card-title">Szabad helyek</h5>
                                            <p class="card-text fs-2">{parkingStatus.availableSpots}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card border-0 bg-info bg-opacity-10">
                                        <div class="card-body text-center">
                                            <i class="bi bi-percent text-info fs-1 mb-2"></i>
                                            <h5 class="card-title">Kihasználtság</h5>
                                            <p class="card-text fs-2">{parkingStatus.occupancyPercentage}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    {/if}
                </div>
            </div>

            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">Havi bontás megtekintése</h2>

                <div class="mb-6">
                    <label for="year-select" class="block text-sm font-medium text-gray-700 mb-2">Válasszon évet:</label>
                    <div class="d-flex align-items-center gap-3">
                        <select
                            id="year-select"
                            bind:value={selectedYear}
                            class="form-select"
                            style="width: auto;"
                        >
                            {#each years as year}
                                <option value={year}>{year}</option>
                            {/each}
                        </select>
                        <button
                            on:click={handleYearSelection}
                            class="btn btn-primary"
                        >
                            Kiválasztás
                        </button>
                    </div>
                </div>

                <div class="border-t border-gray-200 pt-4">
                    <div class="flex justify-between items-center cursor-pointer mb-4 py-2" on:click={toggleMonthlyData}>
                        <span class="text-sm text-gray-500">Kattintson a havi adatok {isMonthlyDataExpanded ? 'elrejtéséhez' : 'megjelenítéséhez'}</span>
                        <i class="bi {isMonthlyDataExpanded ? 'bi-chevron-down' : 'bi-chevron-right'} text-gray-500 text-xl"></i>
                    </div>
                    
                    {#if isMonthlyDataExpanded}
                        {#if loading}
                            <div class="d-flex justify-content-center align-items-center py-5">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Betöltés...</span>
                                </div>
                            </div>
                        {:else if error}
                            <div class="alert alert-danger mt-4" role="alert">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                {error}
                            </div>
                        {:else if monthlyRevenue && monthlyRevenue.length > 0}
                            <div class="mt-4 px-2">
                                <h3 class="card-title text-primary mb-4">{monthlyRevenueYear}</h3>

                                {#each monthlyRevenue as revenue}
                                    <div class="card mb-3 border-0 bg-light">
                                        <div class="card-body p-4">
                                            <div class="row align-items-center">
                                                <div class="col-md-4">
                                                    <h5 class="mb-0 text-primary ps-3">{revenue.monthName}</h5>
                                                </div>
                                                <div class="col-md-4 text-center">
                                                    <div class="d-flex align-items-center justify-content-center">
                                                        <i class="bi bi-p-circle-fill text-primary me-2"></i>
                                                        <span class="fs-5">{revenue.totalParkings} parkolás</span>
                                                    </div>
                                                </div>
                                                <div class="col-md-4 text-center">
                                                    <div class="d-flex align-items-center justify-content-center">
                                                        <i class="bi bi-currency-dollar text-success me-2"></i>
                                                        <span class="fs-5">{revenue.totalRevenue} Ft</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div class="alert alert-info mt-4" role="alert">
                                <i class="bi bi-info-circle-fill me-2"></i>
                                Nincs megjeleníthető adat a kiválasztott időszakra.
                            </div>
                        {/if}
                    {/if}
                </div>
            </div>

            <!-- Detailed Monthly Revenue Section -->
            <div class="mt-8">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">Részletes havi bevétel</h2>
                <div class="mb-6">
                    <div class="d-flex align-items-end gap-3">
                        <div class="form-group">
                            <label for="year-select-detailed" class="form-label">Év:</label>
                            <select
                                id="year-select-detailed"
                                bind:value={selectedYear}
                                class="form-select"
                                style="width: auto;"
                            >
                                {#each years as year}
                                    <option value={year}>{year}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="month-select" class="form-label">Hónap:</label>
                            <select
                                id="month-select"
                                bind:value={selectedMonth}
                                class="form-select"
                                style="width: auto;"
                            >
                                {#each months as month}
                                    <option value={month.value}>{month.name}</option>
                                {/each}
                            </select>
                        </div>
                        <button
                            on:click={handleDetailedRevenueSelection}
                            class="btn btn-primary"
                        >
                            Kiválasztás
                        </button>
                    </div>
                </div>

                <div class="border-t border-gray-200 pt-4">
                    <div class="flex justify-between items-center cursor-pointer mb-4 py-2" on:click={toggleDetailedRevenue}>
                        <span class="text-sm text-gray-500">Kattintson a részletes adatok {isDetailedRevenueExpanded ? 'elrejtéséhez' : 'megjelenítéséhez'}</span>
                        <i class="bi {isDetailedRevenueExpanded ? 'bi-chevron-down' : 'bi-chevron-right'} text-gray-500 text-xl"></i>
                    </div>

                    {#if isDetailedRevenueExpanded}
                        {#if detailedRevenueLoading}
                            <div class="d-flex justify-content-center align-items-center py-5">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Betöltés...</span>
                                </div>
                            </div>
                        {:else if detailedRevenueError}
                            <div class="alert alert-danger mt-4" role="alert">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                {detailedRevenueError}
                            </div>
                        {:else if detailedRevenue}
                            <div class="row g-4 mt-2">
                                <div class="col-12">
                                    <div class="card border-0 bg-light">
                                        <div class="card-body">
                                            <h3 class="card-title text-primary mb-4">{detailedRevenue.period}</h3>
                                            <div class="row g-4">
                                                <div class="col-md-6 col-lg-3">
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi bi-car-front-fill text-primary fs-2 me-3"></i>
                                                        <div>
                                                            <div class="text-muted small">Parkolások száma</div>
                                                            <div class="fs-4">{detailedRevenue.totalParkings} db</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 col-lg-3">
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi bi-currency-dollar text-success fs-2 me-3"></i>
                                                        <div>
                                                            <div class="text-muted small">Összes bevétel</div>
                                                            <div class="fs-4">{detailedRevenue.totalRevenue}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 col-lg-3">
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi bi-clock-fill text-warning fs-2 me-3"></i>
                                                        <div>
                                                            <div class="text-muted small">Összes parkolási idő</div>
                                                            <div class="fs-4">{detailedRevenue.totalParkingDuration}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 col-lg-3">
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi bi-cash-stack text-info fs-2 me-3"></i>
                                                        <div>
                                                            <div class="text-muted small">Átlagos parkolási díj</div>
                                                            <div class="fs-4">{detailedRevenue.averageParkingFee}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .statistics-container {
        min-height: calc(100vh - 2rem);
        background-color: #f8f9fa;
        padding: 1rem;
    }

    .content-wrapper {
        min-height: calc(100vh - 4rem);
    }

    :global(.card) {
        transition: all 0.3s ease;
        border-radius: 10px;
    }

    :global(.card:hover) {
        transform: translateX(5px);
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }

    :global(.form-select) {
        min-width: 120px;
        max-width: 200px;
    }

    :global(.form-group) {
        margin-bottom: 0;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    :global(.fs-1) {
        font-size: 2.5rem !important;
    }

    :global(.fs-2) {
        font-size: 2rem !important;
    }
</style> 