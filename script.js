// Application state
let selectedUnit = "unit1";
let isSearching = false;

// DOM elements
const unitSelectionPage = document.getElementById("unitSelectionPage");
const searchPage = document.getElementById("searchPage");
const appHeader = document.querySelector(".app-header");
const mainContainer = document.querySelector(".main-container");
const unit1Btn = document.getElementById("unit1Btn");
const unit2Btn = document.getElementById("unit2Btn");
const fgdBtn = document.getElementById("fgdBtn");
const backBtn = document.getElementById("backBtn");
const selectedUnitTitle = document.getElementById("selectedUnitTitle");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchIcon = document.getElementById("searchIcon");
const loadingIcon = document.getElementById("loadingIcon");
const searchStatus = document.getElementById("searchStatus");
const searchResults = document.getElementById("searchResults");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  showUnitSelectionPage();
});

function setupEventListeners() {
  // Unit selection - navigate to search page
  unit1Btn.addEventListener("click", () => selectUnitAndNavigate("unit1"));
  unit2Btn.addEventListener("click", () => selectUnitAndNavigate("unit2"));
  fgdBtn.addEventListener("click", () => selectUnitAndNavigate("fgd"));

  // Back button
  backBtn.addEventListener("click", showUnitSelectionPage);

  // Search form
  searchForm.addEventListener("submit", handleSearch);

  // Input change
  searchInput.addEventListener("input", function () {
    if (!this.value.trim()) {
      clearResults();
    }
  });
}

function selectUnitAndNavigate(unit) {
  selectedUnit = unit;
  let unitName;
  if (unit === "unit1") {
    unitName = "Unit 1 and Offsite";
  } else if (unit === "unit2") {
    unitName = "Unit 2";
  } else if (unit === "fgd") {
    unitName = "FGD";
  }
  selectedUnitTitle.textContent = unitName;
  showSearchPage();
}

function showUnitSelectionPage() {
  unitSelectionPage.classList.remove("hidden");
  searchPage.classList.add("hidden");
  appHeader.classList.remove("hidden");
  mainContainer.classList.remove("no-header");
  clearResults();
}

function showSearchPage() {
  unitSelectionPage.classList.add("hidden");
  searchPage.classList.remove("hidden");
  appHeader.classList.add("hidden");
  mainContainer.classList.add("no-header");
  searchInput.focus();
}

function handleSearch(e) {
  e.preventDefault();

  const query = searchInput.value.trim();
  if (!query) {
    clearResults();
    return;
  }

  // Start search
  setSearchState("pending", query);

  // Simulate network delay for better UX
  setTimeout(() => {
    performSearch(query);
  }, 300);
}

function setSearchState(state, query = "") {
  isSearching = state === "pending";

  // Update search button
  searchBtn.disabled = isSearching || !searchInput.value.trim();
  searchIcon.classList.toggle("hidden", isSearching);
  loadingIcon.classList.toggle("hidden", !isSearching);

  // Update status
  let selectedUnitName;
  if (selectedUnit === "unit1") {
    selectedUnitName = "Unit 1 and Offsite";
  } else if (selectedUnit === "unit2") {
    selectedUnitName = "Unit 2";
  } else if (selectedUnit === "fgd") {
    selectedUnitName = "FGD";
  }

  switch (state) {
    case "pending":
      searchStatus.textContent = `Searching in ${selectedUnitName}...`;
      searchStatus.className = "search-status pending";
      searchResults.classList.add("hidden");
      break;
    case "success":
      searchStatus.className = "search-status";
      break;
    case "error":
      searchStatus.textContent = `No result found for "${query}" in ${selectedUnitName}.`;
      searchStatus.className = "search-status error";
      searchResults.classList.add("hidden");
      break;
    case "idle":
    default:
      searchStatus.classList.add("hidden");
      searchResults.classList.add("hidden");
      break;
  }
}

function performSearch(query) {
  let dataToSearch;
  if (selectedUnit === "unit1") {
    dataToSearch = unit1Data;
  } else if (selectedUnit === "unit2") {
    dataToSearch = unit2Data;
  } else if (selectedUnit === "fgd") {
    dataToSearch = fgdData;
  }
  const searchWords = query.toLowerCase().split(/\s+/).filter(Boolean);

  const foundRows = dataToSearch.filter((row) => {
    // Combine the first two columns for searching
    const contentToSearch = row.slice(0, 2).join(" ").toLowerCase();
    // Check if all search words are included in the content
    return searchWords.every((word) => contentToSearch.includes(word));
  });

  if (foundRows.length > 0) {
    displayResults(foundRows, query);
    setSearchState("success");
  } else {
    setSearchState("error", query);
  }
}

function displayResults(results, query) {
  let selectedUnitName;
  if (selectedUnit === "unit1") {
    selectedUnitName = "Unit 1 and Offsite";
  } else if (selectedUnit === "unit2") {
    selectedUnitName = "Unit 2";
  } else if (selectedUnit === "fgd") {
    selectedUnitName = "FGD";
  }

  // Update status
  searchStatus.textContent = `Found ${results.length} result(s) for "${query}" in ${selectedUnitName}`;
  searchStatus.classList.remove("hidden");

  // Create results HTML
  const resultsHTML = `
        <div class="results-container">
            ${results
              .map(
                (row, index) => `
                <div class="result-item">
                    <div class="result-field">
                        <span class="result-label">KKS:</span> ${row[0] || "N/A"}
                    </div>
                    <div class="result-field">
                        <span class="result-label">Equipment:</span> ${row[1]}
                    </div>
                    <div class="result-field">
                        <span class="result-label">Switchgear:</span> ${row[2]}
                    </div>
                    <div class="result-field">
                        <span class="result-label">Module:</span> ${row[3]}
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
    `;

  searchResults.innerHTML = resultsHTML;
  searchResults.classList.remove("hidden");
}

function clearResults() {
  setSearchState("idle");
}

// Update search button state on input
searchInput.addEventListener("input", function () {
  searchBtn.disabled = isSearching || !this.value.trim();
});
