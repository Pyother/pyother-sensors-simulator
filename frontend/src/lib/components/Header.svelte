<script>
    import logo from '$lib/assets/logo_sensors.webp';
    import { goto } from '$app/navigation';
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-3 px-lg-4 py-lg-3">
    <div class="container-fluid p-0">
        <div class="d-flex align-items-center">
            <a href="https://about.pyother.pl">
                <img src={logo} alt="Logo" style="width: 48px; height: 48px;" />
            </a>
            <span class="navbar-brand mb-0 ms-3 fs-5 h1 d-none d-lg-inline">pyother-sensors-simulator</span>
        </div>
        <div class="ms-auto d-flex gap-3">
            <button 
                class="btn btn-outline-secondary"
                on:click={() => goto('/')}
            >
                Home
            </button>
            <button 
                class="btn btn-outline-secondary"
                on:click={() => goto('/stats')}
            >
                Stats
            </button>
        </div>
    </div>
</nav>