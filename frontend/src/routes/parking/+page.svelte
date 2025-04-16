<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { isInitialized } from '$lib/store';
    import ParkingMapView from '$lib/components/ParkingMapView.svelte';

    let loading = false;
    let error = '';
    let success = '';

    let unsubscribe;
    onMount(() => {
        unsubscribe = isInitialized.subscribe(value => {
            if (value === false) {
                goto('/login');
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    });
</script>

<div class="parking-content">
    {#if loading}
        <div class="loading">Betöltés...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else if success}
        <div class="success">{success}</div>
    {:else}
        <ParkingMapView />
    {/if}
</div>

<style>
    .parking-content {
        height: calc(100vh - 60px);
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-size: 1.2rem;
        color: #666;
    }

    .error {
        background-color: #fee2e2;
        border: 1px solid #ef4444;
        color: #b91c1c;
        padding: 0.5rem;
        border-radius: 0.25rem;
        margin: 0.5rem;
        text-align: center;
    }

    .success {
        background-color: #dcfce7;
        border: 1px solid #22c55e;
        color: #15803d;
        padding: 0.5rem;
        border-radius: 0.25rem;
        margin: 0.5rem;
        text-align: center;
    }
</style>