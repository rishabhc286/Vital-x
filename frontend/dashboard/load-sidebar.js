// Sidebar HTML template embedded to avoid CORS issues with file:// protocol
const sidebarHTML = `
<div class="sidebar">
    <!-- Logo Section -->
    <div class="sidebar-header">
        <div class="logo">
            <span class="logo-icon">⚡</span>
            <span class="logo-text">Vital-X</span>
        </div>
        <div class="logo-subtitle">Health Intelligence</div>
    </div>

    <!-- Navigation -->
    <nav class="nav">
        <!-- Main Section -->
        <div class="nav-section">
            <div class="nav-label">Main</div>
            <a href="dashboard.html" class="nav-item">
                <span class="nav-icon">📊</span>
                <span class="nav-text">Dashboard</span>
            </a>
        </div>

        <!-- Health Section -->
        <div class="nav-section">
            <div class="nav-label">Health</div>
            <a data-page="profile" href="pages/profile/profile.html" class="nav-item">
                <span class="nav-icon">👤</span>
                <span class="nav-text">Profile</span>
            </a>
            <a data-page="health-timeline" href="pages/body-health/body-health.html" class="nav-item">
                <span class="nav-icon">📈</span>
                <span class="nav-text">Health Timeline</span>
            </a>
            <a data-page="health-roadmap" href="pages/health-roadmap/health-roadmap.html" class="nav-item">
                <span class="nav-icon">🗺️</span>
                <span class="nav-text">Health Roadmap</span>
            </a>
            <a data-page="mental-health" href="pages/mental-health/mental-health.html" class="nav-item">
                <span class="nav-icon">🧠</span>
                <span class="nav-text">Mental Health</span>
                <span class="nav-badge">⭐</span>
            </a>
            <a data-page="womens-health" href="pages/womens-health/menstruation.html" class="nav-item">
                <span class="nav-icon">🌸</span>
                <span class="nav-text">Menstruation</span>
            </a>
        </div>

        <!-- Lifestyle Section -->
        <div class="nav-section">
            <div class="nav-label">Lifestyle</div>
            <a data-page="diet" href="pages/diet-nutrition/diet.html" class="nav-item">
                <span class="nav-icon">🥗</span>
                <span class="nav-text">Diet & Nutrition</span>
            </a>
            <a data-page="meal-analyzer" href="pages/meal-analyzer/meal-analyzer.html" class="nav-item">
                <span class="nav-icon">📸</span>
                <span class="nav-text">Meal Analyzer</span>
                <span class="nav-badge">⭐</span>
            </a>
            <a data-page="calories" href="pages/calorie-calculator/calorie-calculator.html" class="nav-item">
                <span class="nav-icon">🔥</span>
                <span class="nav-text">Calorie Calculator</span>
            </a>
        </div>

        <!-- AI & Tools Section -->
        <div class="nav-section">
            <div class="nav-label">AI & Tools</div>
            <a data-page="ai-chat" href="pages/ai-chat/ai-chat.html" class="nav-item">
                <span class="nav-icon">🤖</span>
                <span class="nav-text">AI Chat</span>
            </a>
            <a data-page="ai-diagnosis" href="pages/ai-diagnosis/ai-diagnosis.html" class="nav-item">
                <span class="nav-icon">🧠</span>
                <span class="nav-text">AI-Diagnosis</span>
            </a>
            <a data-page="healthcare-finder" href="pages/healthcare-finder/healthcare-finder.html" class="nav-item">
                <span class="nav-icon">🏥</span>
                <span class="nav-text">Healthcare Finder</span>
            </a>
            <a data-page="environment" href="pages/environment/environment.html" class="nav-item">
                <span class="nav-icon">🌍</span>
                <span class="nav-text">Environment</span>
            </a>
        </div>

        <!-- Emergency Section -->
        <div class="nav-section">
            <a data-page="emergency" href="pages/emergency/emergency.html" class="nav-item emergency-item">
                <span class="nav-icon">🚨</span>
                <span class="nav-text">Emergency</span>
                <span class="nav-badge">!</span>
            </a>
        </div>

        <!-- Settings Section -->
        <div class="nav-section">
            <a data-page="settings" href="pages/settings/settings.html" class="nav-item">
                <span class="nav-icon">⚙️</span>
                <span class="nav-text">Settings</span>
            </a>
        </div>
    </nav>

    <!-- User Section -->
    <div class="sidebar-footer">
        <div class="user-info">
            <div class="user-avatar">R</div>
            <div class="user-details">
                <div class="user-name">Rishabh</div>
                <div class="user-status">Online</div>
            </div>
        </div>
        <a class="logout" href="../auth/login.html">
            <span class="logout-icon">🚪</span>
            <span class="logout-text">Logout</span>
        </a>
    </div>
</div>
`;

// Inject sidebar HTML into the container
document.getElementById("sidebar-container").innerHTML = sidebarHTML;

// Fix all links to be relative to dashboard root
const currentPath = window.location.pathname;
const pathParts = currentPath.split('/').filter(p => p && !p.includes('.html'));
const dashboardIndex = pathParts.indexOf('dashboard');

if (dashboardIndex !== -1) {
    const levelsDeep = pathParts.length - dashboardIndex - 1;

    if (levelsDeep > 0) {
        // We're in a subdirectory, need to add ../ to all links
        const upPath = '../'.repeat(levelsDeep);

        document.querySelectorAll(".nav-item, .logout").forEach(link => {
            const currentHref = link.getAttribute("href");
            if (currentHref && !currentHref.startsWith('http') && !currentHref.startsWith('../') && !currentHref.startsWith('/')) {
                // Only fix relative paths that don't already go up
                link.setAttribute("href", upPath + currentHref);
            }
        });
    }
}

// Set active link based on current page
const page = document.body.getAttribute("data-page");
const currentFile = currentPath.split("/").pop() || "dashboard.html";

document.querySelectorAll(".nav-item").forEach(link => {
    // Check if link matches current page
    const linkPath = link.getAttribute("href");
    const linkFile = linkPath.split("/").pop();

    // Dashboard link special case
    if (linkFile === "dashboard.html" && (currentFile === "dashboard.html" || currentFile === "")) {
        link.classList.add("active");
    }
    // Other pages
    else if (link.dataset.page === page || currentPath.includes(linkPath) || currentFile === linkFile) {
        link.classList.add("active");
    }
});

// Add click handlers for smooth transitions
document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", function (e) {
        // Remove active from all items
        document.querySelectorAll(".nav-item").forEach(link => {
            link.classList.remove("active");
        });
        // Add active to clicked item
        this.classList.add("active");
    });
});

console.log("✅ Sidebar loaded successfully (embedded template)");
