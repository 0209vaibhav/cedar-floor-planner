async function loadLayout() {
    const response = await fetch("../exports/layout.json");
    const data = await response.json();

    renderLayout(data);
    renderMetrics(data.metrics);
}

function renderLayout(data) {
    const svg = document.getElementById("floorplan");

    // Clear previous render (important if reloading)
    svg.innerHTML = "";

    const boundaryWidth = data.boundary.width;
    const boundaryHeight = data.boundary.height;

    const scale = 20; // Scale factor for visualization

    svg.setAttribute("width", boundaryWidth * scale);
    svg.setAttribute("height", boundaryHeight * scale);

    // --- Draw Boundary ---
    const boundaryRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    boundaryRect.setAttribute("x", 0);
    boundaryRect.setAttribute("y", 0);
    boundaryRect.setAttribute("width", boundaryWidth * scale);
    boundaryRect.setAttribute("height", boundaryHeight * scale);
    boundaryRect.setAttribute("fill", "none");
    boundaryRect.setAttribute("stroke", "black");
    boundaryRect.setAttribute("stroke-width", 2);

    svg.appendChild(boundaryRect);

    // --- Draw Rooms ---
    data.rooms.forEach(room => {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    
        rect.setAttribute("x", room.geometry.origin.x * scale);
        rect.setAttribute("y", room.geometry.origin.y * scale);
        rect.setAttribute("width", room.geometry.width * scale);
        rect.setAttribute("height", room.geometry.height * scale);
    
        rect.classList.add("room");
        rect.classList.add(room.category);
    
        // Hover interaction
        rect.addEventListener("mouseover", () => {
            rect.style.strokeWidth = 4;
        });
        
        rect.addEventListener("mouseout", () => {
            rect.style.strokeWidth = 1;
        });
    
        svg.appendChild(rect);

        // --- Add Room Label ---
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");

        label.setAttribute("x",room.geometry.origin.x * scale + (room.geometry.width * scale) / 2);
        label.setAttribute("y",room.geometry.origin.y * scale + (room.geometry.height * scale) / 2);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "middle");
        label.setAttribute("font-size", "11");
        label.setAttribute("pointer-events", "none");

        label.textContent = room.name;

        svg.appendChild(label);
    });
}

function renderMetrics(metrics) {
    const container = document.getElementById("metrics");

    container.innerHTML = `
        <p><strong>Gross Floor Area:</strong> ${metrics.gross_floor_area}</p>
        <p><strong>Net Floor Area:</strong> ${metrics.net_floor_area}</p>
        <p><strong>Private Area:</strong> ${metrics.private_area}</p>
        <p><strong>Common Area:</strong> ${metrics.common_area}</p>
        <p><strong>Packing Efficiency:</strong> ${(metrics.packing_efficiency * 100).toFixed(2)}%</p>
        <p><strong>Private Ratio:</strong> ${(metrics.private_ratio * 100).toFixed(2)}%</p>
        <p><strong>Common Ratio:</strong> ${(metrics.common_ratio * 100).toFixed(2)}%</p>
    `;
}

loadLayout();