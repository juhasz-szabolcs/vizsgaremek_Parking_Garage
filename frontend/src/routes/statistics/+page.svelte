<script>
    import { onMount } from 'svelte';
    import { getCarLogo } from '$lib/utils/carLogos';
    import { getStatistics, getMonthlyStatistics } from '$lib/api';

    let parkingHistory = [];
    let summaryData = null;
    let carStats = [];
    let monthlyStats = null;
    let loading = false;
    let monthlyLoading = false;
    let error = null;
    let isHistoryExpanded = true;
    let selectedYear = new Date().getFullYear();
    let selectedMonth = new Date().getMonth() + 1;
    let years = [];
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

    // Helper function to format numbers with thousand separator
    function formatNumber(num) {
        if (num === null || num === undefined) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    async function loadParkingHistory() {
        loading = true;
        error = null;
        try {
            const result = await getStatistics();
            if (result.success) {
                parkingHistory = result.data.history;
                summaryData = result.data.summary;
                carStats = result.data.carStats;
                await loadMonthlyStats();
            } else {
                error = result.error;
                console.error('Error loading statistics data');
            }
        } catch (err) {
            console.error('Error:', err);
            error = 'Hiba történt az adatok betöltése során.';
        } finally {
            loading = false;
        }
    }

    async function loadMonthlyStats() {
        monthlyLoading = true;
        try {
            const result = await getMonthlyStatistics(selectedYear, selectedMonth);
            if (result.success) {
                monthlyStats = result.data;
            } else {
                monthlyStats = null;
                console.error('Error loading monthly stats:', result.error);
            }
        } catch (err) {
            console.error('Error loading monthly stats:', err);
            monthlyStats = null;
        } finally {
            monthlyLoading = false;
        }
    }

    async function handleMonthSelection() {
        monthlyStats = null;
        await loadMonthlyStats();
    }

    onMount(() => {
        loadParkingHistory();
    });
</script>

<div class="statistics-container">
    <div class="content-wrapper bg-white shadow-lg rounded-lg p-8 mx-4 my-6">
        <h1 class="text-3xl font-bold mb-8 px-4">Parkolás összesítő</h1>

        <div class="px-4">
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
            {:else}
                <div class="statistics-section">
                    <div class="section-card">
                        <div class="section-header">
                            <i class="bi bi-graph-up text-primary me-2"></i>
                            <h2 class="text-2xl font-bold">Összesített statisztika</h2>
                        </div>
                        {#if summaryData}
                            <div class="summary-cards">
                                <div class="card border-0 bg-primary bg-opacity-10">
                                    <div class="card-body text-center">
                                        <i class="bi bi-car-front-fill text-primary fs-1 mb-2"></i>
                                        <h5 class="card-title">Összes parkolás</h5>
                                        <p class="card-text fs-2">{formatNumber(summaryData.totalParkings)} db</p>
                                    </div>
                                </div>
                                <div class="card border-0 bg-success bg-opacity-10">
                                    <div class="card-body text-center">
                                        <i class="bi bi-currency-dollar text-success fs-1 mb-2"></i>
                                        <h5 class="card-title">Összes díj</h5>
                                        <p class="card-text fs-2">{formatNumber(summaryData.totalFee)} Ft</p>
                                    </div>
                                </div>
                                <div class="card border-0 bg-info bg-opacity-10">
                                    <div class="card-body text-center">
                                        <i class="bi bi-clock-fill text-info fs-1 mb-2"></i>
                                        <h5 class="card-title">Átlagos időtartam</h5>
                                        <p class="card-text fs-2">{summaryData.averageDuration}</p>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="statistics-section">
                    <div class="section-card">
                        <div class="section-header">
                            <i class="bi bi-calendar-event text-primary me-2"></i>
                            <h2 class="text-2xl font-bold">Havi bontás</h2>
                        </div>
                        <div class="monthly-stats">
                            <div class="month-selector mb-4">
                                <div class="d-flex align-items-end">
                                    <div class="form-group">
                                        <label for="year-select" class="form-label">Év:</label>
                                        <select
                                            id="year-select"
                                            bind:value={selectedYear}
                                            class="form-select"
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
                                        >
                                            {#each months as month}
                                                <option value={month.value}>{month.name}</option>
                                            {/each}
                                        </select>
                                    </div>
                                    <button
                                        on:click={handleMonthSelection}
                                        class="btn btn-primary"
                                    >
                                        Kiválasztás
                                    </button>
                                </div>
                            </div>

                            {#if monthlyLoading}
                                <div class="d-flex justify-content-center align-items-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Betöltés...</span>
                                    </div>
                                </div>
                            {:else if monthlyStats}
                                <div class="monthly-details">
                                    <h3 class="text-xl font-semibold mb-4">{monthlyStats.monthName} {monthlyStats.year}</h3>
                                    <div class="details-grid">
                                        <div class="detail-item">
                                            <i class="bi bi-car-front-fill text-primary me-2"></i>
                                            <span>Parkolások száma: {formatNumber(monthlyStats.totalParkings)} db</span>
                                        </div>
                                        <div class="detail-item">
                                            <i class="bi bi-currency-dollar text-success me-2"></i>
                                            <span>Összes díj: {formatNumber(monthlyStats.totalFee)} Ft</span>
                                        </div>
                                        <div class="detail-item">
                                            <i class="bi bi-clock-fill text-info me-2"></i>
                                            <span>Összes időtartam: {monthlyStats.totalDuration}</span>
                                        </div>
                                    </div>
                                </div>
                            {:else}
                                <div class="alert alert-info mt-4" role="alert">
                                    <i class="bi bi-info-circle-fill me-2"></i>
                                    Nincs adat a kiválasztott időszakra.
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>

                {#if carStats && carStats.length > 0}
                    <div class="statistics-section">
                        <div class="section-card">
                            <div class="section-header">
                                <i class="bi bi-car-front text-primary me-2"></i>
                                <h2 class="text-2xl font-bold">Autónkénti statisztika</h2>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th style="width: 25%">Autó</th>
                                            <th style="width: 15%">Rendszám</th>
                                            <th style="width: 20%" class="text-center">Parkolások száma</th>
                                            <th style="width: 20%" class="text-center">Összes díj</th>
                                            <th style="width: 20%" class="text-center">Összes időtartam</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each carStats as car}
                                            <tr>
                                                <td data-label="Autó">
                                                    <div class="d-flex align-items-center gap-2">
                                                        <img src={getCarLogo(car.brand)} alt={car.brand} class="car-logo" />
                                                        <span class="font-semibold">{car.brand} {car.model}</span>
                                                    </div>
                                                </td>
                                                <td data-label="Rendszám"><span class="badge bg-primary">{car.licensePlate}</span></td>
                                                <td data-label="Parkolások száma" class="text-center">
                                                    <div class="stat-cell">
                                                        <i class="bi bi-car-front-fill text-primary stat-icon"></i>
                                                        <span>{formatNumber(car.totalParkings)} db</span>
                                                    </div>
                                                </td>
                                                <td data-label="Összes díj" class="text-center">
                                                    <div class="stat-cell">
                                                        <i class="bi bi-currency-dollar text-success stat-icon"></i>
                                                        <span>{formatNumber(car.totalFee)} Ft</span>
                                                    </div>
                                                </td>
                                                <td data-label="Összes időtartam" class="text-center">
                                                    <div class="stat-cell">
                                                        <i class="bi bi-clock-fill text-info stat-icon"></i>
                                                        <span>{car.totalDuration}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                {/if}

                <div class="statistics-section">
                    <div class="section-card">
                        <div class="section-header">
                            <i class="bi bi-clock-history text-primary me-2"></i>
                            <h2 class="text-2xl font-bold">Parkolási előzmények</h2>
                        </div>
                        <div class="mt-4">
                            {#if parkingHistory.length === 0}
                                <div class="alert alert-info mt-4" role="alert">
                                    <i class="bi bi-info-circle-fill me-2"></i>
                                    Még nincs parkolási előzmény.
                                </div>
                            {:else}
                                <div class="overflow-x-auto">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Dátum</th>
                                                <th>Autó</th>
                                                <th style="width: 100px">Rendszám</th>
                                                <th>Hely</th>
                                                <th>Időtartam</th>
                                                <th>Díj</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {#each parkingHistory as history}
                                                <tr>
                                                    <td data-label="Dátum">{new Date(history.startTime).toLocaleDateString('hu-HU')}</td>
                                                    <td data-label="Autó">
                                                        <div class="d-flex align-items-center gap-2">
                                                            <img src={getCarLogo(history.carBrand)} alt={history.carBrand} class="car-logo" />
                                                            <span>{history.carBrand} {history.carModel}</span>
                                                        </div>
                                                    </td>
                                                    <td data-label="Rendszám">
                                                        <span class="badge bg-secondary">{history.licensePlate}</span>
                                                    </td>
                                                    <td data-label="Hely">{history.floorNumber}. emelet - {history.spotNumber}</td>
                                                    <td data-label="Időtartam">
                                                        <div class="stat-cell">
                                                            <i class="bi bi-clock-fill text-info stat-icon"></i>
                                                            <span>{history.durationFormatted}</span>
                                                        </div>
                                                    </td>
                                                    <td data-label="Díj">
                                                        <div class="stat-cell">
                                                            <i class="bi bi-currency-dollar text-success stat-icon"></i>
                                                            <span>{formatNumber(history.fee)} Ft</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .statistics-container {
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
    }

    .content-wrapper {
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 2rem;
        border-radius: 0;
        box-shadow: none;
        overflow-x: hidden;
    }

    .statistics-section {
        margin-bottom: 1.5rem;
        padding: 0;
        width: 100%;
        overflow: hidden;
    }

    .section-card {
        background: white;
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 100%;
        overflow: hidden;
    }

    .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;
        gap: 1rem;
    }

    .section-header i {
        font-size: 1.5rem;
    }

    .section-header h2 {
        margin: 0;
    }

    .summary-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }

    .card {
        padding: 2rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
        height: 100%;
        background: linear-gradient(to bottom right, rgba(13, 110, 253, 0.2), rgba(13, 110, 253, 0.08));
        border: 1px solid rgba(13, 110, 253, 0.3);
        box-shadow: 0 8px 16px rgba(13, 110, 253, 0.12);
    }

    .card.bg-success {
        background: linear-gradient(to bottom right, rgba(25, 135, 84, 0.2), rgba(25, 135, 84, 0.08));
        border: 1px solid rgba(25, 135, 84, 0.3);
        box-shadow: 0 8px 16px rgba(25, 135, 84, 0.12);
    }

    .card.bg-info {
        background: linear-gradient(to bottom right, rgba(13, 202, 240, 0.2), rgba(13, 202, 240, 0.08));
        border: 1px solid rgba(13, 202, 240, 0.3);
        box-shadow: 0 8px 16px rgba(13, 202, 240, 0.12);
    }

    .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .card-title {
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
        color: #495057;
    }

    .card-text {
        font-weight: 600;
        margin: 0;
        color: #212529;
    }

    .card .fs-1 {
        margin-bottom: 1rem;
    }

    .card.bg-primary .fs-1,
    .card.bg-primary .card-text {
        color: #0d6efd;
    }

    .card.bg-success .fs-1,
    .card.bg-success .card-text {
        color: #198754;
    }

    .card.bg-info .fs-1,
    .card.bg-info .card-text {
        color: #0dcaf0;
    }

    .monthly-stats {
        margin-top: 1.5rem;
    }

    .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .car-stats .card {
        background: white !important;
        margin-bottom: 1rem;
    }

    .car-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .car-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .detail-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        background: linear-gradient(to bottom right, rgba(13, 110, 253, 0.2), rgba(13, 110, 253, 0.08));
        border: 1px solid rgba(13, 110, 253, 0.3);
        border-radius: 8px;
        min-height: 60px;
        box-shadow: 0 4px 8px rgba(13, 110, 253, 0.12);
    }

    .statistics-container .table {
        width: 100%;
        margin: 0;
        border-spacing: 0;
    }

    .statistics-container .table th {
        background-color: rgba(13, 110, 253, 0.1);
        font-weight: 600;
        padding: 1rem 0.75rem;
        border-bottom: none;
        white-space: nowrap;
        text-align: left;
    }

    .statistics-container .table tbody tr {
        transition: all 0.3s ease;
        background: white;
        border: 1px solid rgba(13, 110, 253, 0.25);
        box-shadow: 0 4px 8px rgba(13, 110, 253, 0.12);
        margin-bottom: 0.75rem;
        border-radius: 8px;
    }

    .statistics-container .table tbody tr:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(13, 110, 253, 0.16);
        border-color: rgba(13, 110, 253, 0.35);
    }

    .statistics-container .table td {
        padding: 1rem 0.75rem;
        vertical-align: middle;
        border-bottom: 1px solid rgba(13, 110, 253, 0.15);
    }

    .car-logo {
        width: 20px;
        height: 20px;
        object-fit: contain;
        margin-right: 0.5rem;
    }

    .badge {
        font-size: 0.8rem;
        padding: 0.35em 0.65em;
        white-space: nowrap;
    }

    .stat-cell {
        position: relative;
        padding-left: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .stat-icon {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }

    .month-selector {
        margin-bottom: 2rem;
    }

    .month-selector .d-flex {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: flex-end;
    }

    .month-selector .form-group {
        flex: 1;
        min-width: 140px;
        max-width: 200px;
        margin: 0;
    }

    .month-selector .form-label {
        margin-bottom: 0.5rem;
        font-weight: 500;
    }

    .month-selector .form-select {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.375rem;
        border: 1px solid rgba(13, 110, 253, 0.3);
        background-color: white;
        font-size: 0.95rem;
        height: 38px;
        line-height: 1.5;
    }

    .month-selector .btn-primary {
        min-width: 120px;
        height: 38px;
        align-self: flex-end;
        margin-left: 0.5rem;
        padding: 0 1.5rem;
        font-size: 0.95rem;
        border-radius: 0.375rem;
        background: linear-gradient(to bottom right, #0d6efd, #0b5ed7);
        border: none;
        box-shadow: 0 2px 4px rgba(13, 110, 253, 0.2);
        transition: all 0.2s ease;
    }

    .month-selector .btn-primary:hover {
        background: linear-gradient(to bottom right, #0b5ed7, #0a58ca);
        box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
        transform: translateY(-1px);
    }

    .table {
        width: 100%;
        margin: 0;
    }

    .table th {
        background-color: rgba(13, 110, 253, 0.1);
        padding: 1rem;
        font-weight: 600;
    }

    .table td {
        padding: 1rem;
        vertical-align: middle;
    }

    .overflow-x-auto {
        overflow-x: visible;
        width: 100%;
    }

    .monthly-details {
        width: 100%;
    }

    .monthly-details .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        width: 100%;
    }

    .monthly-details .detail-item {
        display: flex;
        align-items: center;
        padding: 1rem 1.5rem;
        background: linear-gradient(to bottom right, rgba(13, 110, 253, 0.2), rgba(13, 110, 253, 0.08));
        border: 1px solid rgba(13, 110, 253, 0.3);
        border-radius: 8px;
        min-height: 60px;
        box-shadow: 0 4px 8px rgba(13, 110, 253, 0.12);
        width: 100%;
    }

    .monthly-details .detail-item i {
        margin-right: 1rem;
        font-size: 1.2rem;
    }

    .monthly-details .detail-item span {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
        .statistics-container {
            width: 100vw;
            max-width: 100vw;
        }

        .content-wrapper {
            padding: 0.75rem;
        }

        .overflow-x-auto {
            overflow-x: auto;
        }

        .section-card {
            padding: 1rem;
            margin: 0;
        }

        .table {
            display: block;
            width: 100%;
            margin: 0;
        }

        .table thead {
            display: none;
        }

        .table tbody {
            display: block;
            width: 100%;
        }

        .table tr {
            display: block;
            margin-bottom: 1rem;
            background: white;
            border: 1px solid rgba(13, 110, 253, 0.25);
            border-radius: 8px;
            padding: 0.75rem;
            box-shadow: 0 4px 8px rgba(13, 110, 253, 0.12);
        }

        .table td {
            display: flex;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(13, 110, 253, 0.15);
            font-size: 0.9rem;
            align-items: center;
        }

        .table td:last-child {
            border-bottom: none;
        }

        .table td[data-label]::before {
            content: attr(data-label);
            font-weight: 600;
            min-width: 120px;
            margin-right: 1rem;
        }

        .stat-cell {
            flex: 1;
            justify-content: flex-start;
            padding-left: 0;
        }

        .stat-icon {
            position: static;
            transform: none;
            margin-right: 0.5rem;
        }

        .badge {
            margin-left: auto;
        }

        .monthly-details .details-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
        }

        .monthly-details .detail-item {
            padding: 0.75rem 1rem;
            min-height: 50px;
        }

        .monthly-details .detail-item i {
            font-size: 1rem;
        }

        .monthly-details .detail-item span {
            font-size: 0.9rem;
        }

        .month-selector .d-flex {
            flex-direction: column;
            gap: 1rem;
            width: 100%;
        }

        .month-selector .form-group {
            width: 100%;
            max-width: none;
        }

        .month-selector .btn-primary {
            width: 100%;
            margin-left: 0;
            margin-top: 0.5rem;
        }

        .month-selector .form-select {
            font-size: 0.9rem;
        }
    }

    @media (max-width: 480px) {
        .content-wrapper {
            padding: 0.5rem;
        }

        .section-card {
            padding: 0.75rem;
            border-radius: 0.375rem;
        }

        .table td {
            padding: 0.5rem 0;
            font-size: 0.85rem;
        }

        .table td[data-label]::before {
            min-width: 100px;
            font-size: 0.85rem;
        }

        .car-logo {
            width: 16px;
            height: 16px;
        }

        .badge {
            font-size: 0.75rem;
            padding: 0.25em 0.5em;
        }

        .monthly-details .detail-item {
            padding: 0.5rem 0.75rem;
        }

        .monthly-details .detail-item span {
            font-size: 0.85rem;
        }

        .month-selector .form-select,
        .month-selector .btn-primary {
            font-size: 0.85rem;
            height: 36px;
        }
    }
</style> 