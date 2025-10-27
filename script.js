const input = document.getElementById("search");
const results = document.getElementById("results");
const toggleBtn = document.getElementById("toggle-button");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

let mode = "debounce";
let controller;

toggleBtn.addEventListener("click", () => {
  mode = mode === "debounce" ? "throttle" : "debounce";
  toggleBtn.textContent = mode === "debounce" ? "Switch to Throttle" : "Switch to Debounce";
});

async function searchPlayers(query) {
  if (!query) {
    results.innerHTML = "";
    return;
  }

  if (controller) controller.abort();
  controller = new AbortController();

  loading.style.display = "block";
  error.style.display = "none";
  results.innerHTML = "";

  try {
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${query}`, {
      signal: controller.signal,
    });

    if (!res.ok) throw new Error("Network error");
    const data = await res.json();

    loading.style.display = "none";

    if (!data.player) {
      error.style.display = "block";
      error.textContent = "Unfound!";
      return;
    }

    results.innerHTML = data.player
      .map(
        (p) => `
        <div class="player">
          <img src="${p.strThumb || "https://via.placeholder.com/100"}" alt="${p.strPlayer}">
          <div class="info">
            <h3> ${p.strPlayer}</h3><br>
            <p><strong>Team:</strong> ${p.strTeam || "Unknown"}</p>
            <p><strong>Nationality:</strong> ${p.strNationality || "Unknown"}</p>
          </div>
        </div>
      `
      )
      .join("");
  } catch (e) {
    if (e.name !== "AbortError") {
      loading.style.display = "none";
      error.style.display = "block";
      error.textContent = "Error!";
    }
  }
}

// Debounce
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Throttle
function throttle(func, delay) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      func(...args);
      last = now;
    }
  };
}

const debounceSearch = debounce(searchPlayers, 1000);
const throttleSearch = throttle(searchPlayers, 1000);

input.addEventListener("input", (e) => {
  if (mode === "debounce") debounceSearch(e.target.value);
  else throttleSearch(e.target.value);
});