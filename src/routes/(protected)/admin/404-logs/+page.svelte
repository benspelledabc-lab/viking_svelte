<script>
    import { onMount } from 'svelte';
    import { apiRequest, apiUrl } from '$lib/api';

    let logs = [];
    let history = [];
    let loading = true;
    let error = '';
    let testResult = '';

    async function fetchLogs() {
        try {
            logs = await apiRequest('/not_found_logs');
            history = await apiRequest('/not_found_logs/history');
            loading = false;
        } catch (err) {
            error = err.message;
            loading = false;
        }
    }

    async function testLog() {
        testResult = 'Testing...';
        try {
            const resp = await fetch(apiUrl('/not_found_logs'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    path: '/test-404-' + Date.now(),
                    user_agent: navigator.userAgent,
                    referer: 'test',
                    ip_address: null
                })
            });
            
            if (resp.ok) {
                const result = await resp.json();
                testResult = 'Success! Logged: ' + JSON.stringify(result);
                fetchLogs(); // Refresh the list
            } else {
                const errorText = await resp.text();
                testResult = `Error: ${resp.status} ${errorText}`;
            }
        } catch (err) {
            testResult = 'Error: ' + err.message;
        }
    }

    onMount(fetchLogs);
</script>

<svelte:head>
    <title>404 Logs Admin</title>
</svelte:head>

<h1>404 Not Found Logs</h1>

<div class="admin-section">
    <button on:click={testLog} class="test-btn">Test 404 Logging</button>
    {#if testResult}
        <div class="test-result">{testResult}</div>
    {/if}
</div>

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p class="error">Error: {error}</p>
{:else}
    <div class="section">
        <h2>Aggregated History ({history.length})</h2>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Path</th>
                        <th>Total Hits</th>
                        <th>Last IP</th>
                        <th>Last Seen</th>
                    </tr>
                </thead>
                <tbody>
                    {#each history as item}
                        <tr>
                            <td>{item.requested_url}</td>
                            <td>{item.total_hit_count}</td>
                            <td>{item.last_ip || 'N/A'}</td>
                            <td>{item.last_seen ? new Date(item.last_seen).toLocaleString() : 'N/A'}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <div class="section">
        <h2>All Logs ({logs.length})</h2>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Path</th>
                        <th>IP Address</th>
                        <th>Attempted At</th>
                        <th>Referer</th>
                    </tr>
                </thead>
                <tbody>
                    {#each logs.slice(0, 50) as log}
                        <tr>
                            <td>{log.id}</td>
                            <td>{log.path}</td>
                            <td>{log.ip_address || 'N/A'}</td>
                            <td>{log.attempted_at ? new Date(log.attempted_at).toLocaleString() : 'N/A'}</td>
                            <td class="referer">{log.referer || 'N/A'}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        {#if logs.length > 50}
            <p class="note">Showing first 50 of {logs.length} logs</p>
        {/if}
    </div>
{/if}

<style>
    h1 {
        margin-bottom: 1em;
    }

    .admin-section {
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
    }

    .test-btn {
        padding: 0.8em 1.5em;
        background: #4a90e2;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;
    }

    .test-btn:hover {
        background: #357abd;
    }

    .test-result {
        margin-top: 1em;
        padding: 1em;
        background: #e8f5e9;
        border-left: 4px solid #4caf50;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.9em;
    }

    .section {
        margin: 2rem 0;
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 1.5rem;
    }

    .section h2 {
        margin-top: 0;
        margin-bottom: 1rem;
    }

    .table-wrapper {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9em;
    }

    th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background: rgba(74, 144, 226, 0.1);
        font-weight: 600;
        position: sticky;
        top: 0;
    }

    tbody tr:hover {
        background: rgba(74, 144, 226, 0.05);
    }

    .referer {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .error {
        color: #d32f2f;
        padding: 1em;
        background: #ffebee;
        border-radius: 4px;
        border-left: 4px solid #d32f2f;
    }

    .note {
        margin-top: 1em;
        font-style: italic;
        color: #666;
    }

    @media (max-width: 768px) {
        table {
            font-size: 0.8em;
        }

        th, td {
            padding: 0.5rem;
        }
    }
</style>
