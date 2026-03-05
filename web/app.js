async function loadLayout() {

    let data;

    try {

        const response = await fetch("../exports/layout.json");

        if (!response.ok) {
            throw new Error("Live layout not available");
        }

        data = await response.json();

    } catch (error) {

        console.log("Loading demo layout...");

        const response = await fetch("demo_layout.json");
        data = await response.json();

    }

    renderLayout(data);
    renderMetrics(data);

}

function renderLayout(data) {

    const svg = document.getElementById("floorplan");

    // Clear previous render
    svg.innerHTML = "";

    const boundaryWidth = data.boundary.width;
    const boundaryHeight = data.boundary.height;

    const container = document.querySelector(".canvas-panel");

    const svgWidth = container.clientWidth - 40;
    const svgHeight = container.clientHeight - 40;

    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);

    // Auto-fit scale
    const scale = 50;   // try 40–80 depending on zoom

    // Center layout
    const offsetX = (svgWidth - boundaryWidth * scale) / 2;
    const offsetY = (svgHeight - boundaryHeight * scale) / 2;

    // Draw boundary
    const boundaryRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    boundaryRect.setAttribute("x", offsetX);
    boundaryRect.setAttribute("y", offsetY);
    boundaryRect.setAttribute("width", boundaryWidth * scale);
    boundaryRect.setAttribute("height", boundaryHeight * scale);

    boundaryRect.setAttribute("fill", "none");
    boundaryRect.setAttribute("stroke", "black");
    boundaryRect.setAttribute("stroke-width", 2);

    svg.appendChild(boundaryRect);

    // Draw rooms
    data.rooms.forEach(room => {

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        rect.setAttribute("x", offsetX + room.geometry.origin.x * scale);
        rect.setAttribute("y", offsetY + room.geometry.origin.y * scale);

        rect.setAttribute("width", room.geometry.width * scale);
        rect.setAttribute("height", room.geometry.height * scale);

        rect.classList.add("room");
        rect.classList.add(room.category);

        const tooltip = document.getElementById("tooltip");

        rect.addEventListener("mouseover", (event) => {
        
            rect.style.strokeWidth = 4;
        
            tooltip.style.opacity = 1;
        
            tooltip.innerHTML = `
                <strong>${room.name}</strong>
                <hr>
                Area: ${room.computed_area} m²<br>
                Target: ${room.target_area} m²<br>
                Minimum: ${room.minimum_area} m²
            `;
        
        });
        
        rect.addEventListener("mousemove", (event) => {
        
            tooltip.style.left = event.pageX + 12 + "px";
            tooltip.style.top = event.pageY + 12 + "px";
        
        });
        
        rect.addEventListener("mouseout", () => {
        
            rect.style.strokeWidth = 1;
        
            tooltip.style.opacity = 0;
        
        });

        svg.appendChild(rect);

        // Room label
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");

        label.setAttribute(
            "x",
            offsetX + room.geometry.origin.x * scale + (room.geometry.width * scale) / 2
        );

        label.setAttribute(
            "y",
            offsetY + room.geometry.origin.y * scale + (room.geometry.height * scale) / 2
        );

        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "middle");
        label.setAttribute("font-size", "11");
        label.setAttribute("font-weight", "500");
        label.setAttribute("fill", "#222");

        label.setAttribute("pointer-events", "none");

        label.textContent = room.name;

        svg.appendChild(label);

    });

}


function renderMetrics(data) {

    const metrics = data.metrics;
    const solver = data.solver;
    const boundary = data.boundary;

    const container = document.getElementById("metrics");

    container.innerHTML = `
        <h3>Boundary</h3>
        <hr>
        <p class="metric-label"><strong>Boundary Dimensions:</strong> ${boundary.width.toFixed(2)} m x ${boundary.height.toFixed(2)} m</p>
        <p><strong>Gross Floor Area:</strong> ${metrics.gross_floor_area.toFixed(2)} m²</p>
<br>
<br>
        <h3>Metrics</h3>
        <hr>
        <p><strong>Net Floor Area:</strong> ${metrics.net_floor_area.toFixed(2)} m²</p>
        <p><strong>Private Area:</strong> ${metrics.private_area.toFixed(2)} m²</p>
        <p><strong>Common Area:</strong> ${metrics.common_area.toFixed(2)} m²</p>
<br>
        <p><strong>Packing Efficiency:</strong> ${(metrics.packing_efficiency * 100).toFixed(2)}%</p>
<br>
        <p><strong>Private Ratio:</strong> ${(metrics.private_ratio * 100).toFixed(2)}%</p>
        <p><strong>Common Ratio:</strong> ${(metrics.common_ratio * 100).toFixed(2)}%</p>
<br>
<br>


        <h3>Solver Decision</h3>
        <hr>
        <p><strong>Program Profile:</strong> ${solver.selected_profile}</p>
        <p><strong>Rotation Allowed:</strong> ${solver.rotation}</p>
        <p><strong>Sort Strategy:</strong> ${solver.sort_strategy}</p>
        <p><strong>Variants Evaluated:</strong> ${solver.variants_tested}</p>

    `;

}


loadLayout();