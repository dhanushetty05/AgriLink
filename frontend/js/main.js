// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "login.html";
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}

// ------------------ DASHBOARD FUNCTIONS ------------------ //
const farmerName = document.getElementById("farmerName");
if (farmerName) farmerName.innerText = user.name;

const toggleAddCrop = document.getElementById("toggleAddCrop");
const addCropSection = document.getElementById("addCropSection");
if (toggleAddCrop) {
  toggleAddCrop.addEventListener("click", () => {
    addCropSection.style.display = addCropSection.style.display === "none" ? "block" : "none";
  });
}

// Load Crops
const cropTable = document.getElementById("cropTable");
async function loadCrops() {
  if (!cropTable) return;
  const res = await fetch(`http://localhost:5000/api/products/farmer/${user._id}`);
  const crops = await res.json();
  cropTable.innerHTML = "";
  crops.forEach((c) => {
    cropTable.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.quantity}</td>
        <td>${c.price}</td>
        <td>${c.location}</td>
        <td class="actions">
          <button onclick="deleteCrop('${c._id}')">🗑️ Delete</button>
        </td>
      </tr>`;
  });
}
loadCrops();

// Add Crop
const cropForm = document.getElementById("cropForm");
if (cropForm) {
  cropForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("cropName").value,
      quantity: document.getElementById("quantity").value,
      price: document.getElementById("price").value,
      location: document.getElementById("location").value,
      farmerId: user._id,
    };
    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      alert("Crop added successfully!");
      cropForm.reset();
      loadCrops();
    } else {
      alert("Error adding crop.");
    }
  });
}

// Delete Crop
async function deleteCrop(id) {
  const confirmDel = confirm("Delete this crop?");
  if (!confirmDel) return;
  const res = await fetch(`http://localhost:5000/api/products/${id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    alert("Deleted successfully!");
    loadCrops();
  } else {
    alert("Error deleting crop.");
  }
}

// ------------------ ORDERS PAGE ------------------ //
const ordersTable = document.getElementById("ordersTable");
if (ordersTable) {
  loadOrders();
  const backBtn = document.getElementById("backBtn");
  if (backBtn) backBtn.addEventListener("click", () => (window.location.href = "dashboard.html"));
}

async function loadOrders() {
  if (!ordersTable) return;
  const res = await fetch(`http://localhost:5000/api/orders/farmer/${user._id}`);
  const orders = await res.json();
  ordersTable.innerHTML = "";
  orders.forEach((o) => {
    ordersTable.innerHTML += `
      <tr>
        <td>${o.cropName}</td>
        <td>${o.buyerName}</td>
        <td>${o.quantity}</td>
        <td>₹${o.total}</td>
        <td>${o.status}</td>
      </tr>`;
  });
}

// ------------------ MARKETPLACE PAGE ------------------ //
const marketContainer = document.getElementById("marketContainer");

// Load all crops to show in marketplace
async function loadMarketplace() {
  if (!marketContainer) return;
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const products = await res.json();

    marketContainer.innerHTML = "";
    products.forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("product-card");
      div.innerHTML = `
        <h3>${p.name}</h3>
        <p>Quantity: ${p.quantity} kg</p>
        <p>Price: ₹${p.price}/kg</p>
        <p>Location: ${p.location}</p>
        <button onclick="orderNow('${p._id}', '${p.name}', ${p.price})">Order Now</button>
      `;
      marketContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading marketplace:", err);
  }
}

// Called when "Order Now" clicked
async function orderNow(id, name, price) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return (window.location.href = "login.html");

  const quantity = prompt(`Enter quantity (kg) for ${name}:`);
  if (!quantity || quantity <= 0) return alert("Invalid quantity");

  const total = quantity * price;

  try {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cropId: id,
        cropName: name,
        quantity,
        total,
        buyerId: user._id,
        buyerName: user.name,
      }),
    });

    if (res.ok) alert("Order placed successfully!");
    else alert("Failed to place order");
  } catch (err) {
    console.error("Order error:", err);
    alert("Something went wrong while placing the order");
  }
}

// Run marketplace only on marketplace.html
loadMarketplace();

