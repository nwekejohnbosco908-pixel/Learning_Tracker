// Array to store learning items
let learningItems = JSON.parse(localStorage.getItem("learningItems")) || [];

// DOM Elements
const learningInput = document.getElementById("learningInput");
const addBtn = document.getElementById("Btn-add");
const learningList = document.getElementById("learningList");
const clearAllBtn = document.getElementById("clearAllBtn");
const confirmationModal = document.getElementById("confirmationModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const progressText = document.getElementById("progressText");
const segmentedProgressBar = document.getElementById("segmentedProgressBar");

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  renderItems();
  updateProgress();
});

// Add item when Add button is clicked
addBtn.addEventListener("click", addItem);

// Add item when Enter key is pressed
learningInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addItem();
  }
});

// Add new learning item
function addItem() {
  const inputValue = learningInput.value.trim();

  if (inputValue === "") {
    alert("Please enter something to learn!");
    return;
  }

  // Create new item object
  const newItem = {
    id: Date.now(), // Unique ID
    text: inputValue,
    completed: false,
  };

  // Add to array and save to localStorage
  learningItems.push(newItem);
  localStorage.setItem("learningItems", JSON.stringify(learningItems));

  // Clear input
  learningInput.value = "";
  learningInput.focus();

  // Re-render and update progress
  renderItems();
  updateProgress();
}

// Render all items
function renderItems() {
  learningList.innerHTML = "";

  if (learningItems.length === 0) {
    learningList.innerHTML =
      '<p class="text-muted text-center">No items yet. Add one to get started!</p>';
    return;
  }

  learningItems.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className =
      "learning-item p-3 mb-2 d-flex align-items-center justify-content-between";
    itemDiv.style.backgroundColor = item.completed ? "#e8f5e9" : "#fff3e0";
    itemDiv.style.borderRadius = "8px";
    itemDiv.style.borderLeft = item.completed
      ? "4px solid #4caf50"
      : "4px solid #9900ffed";

    // Checkbox and text
    const contentDiv = document.createElement("div");
    contentDiv.className = "d-flex align-items-center flex-grow-1";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;
    checkbox.style.marginRight = "12px";
    checkbox.style.width = "18px";
    checkbox.style.height = "18px";
    checkbox.addEventListener("change", function () {
      toggleItem(item.id);
    });

    const text = document.createElement("span");
    text.textContent = item.text;
    text.style.fontSize = "16px";
    text.style.textDecoration = item.completed ? "line-through" : "none";
    text.style.color = item.completed ? "#888" : "#333";

    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(text);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-danger";
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i> Delete';
    deleteBtn.addEventListener("click", function () {
      deleteItem(item.id);
    });

    itemDiv.appendChild(contentDiv);
    itemDiv.appendChild(deleteBtn);
    learningList.appendChild(itemDiv);
  });
}

// Toggle item completion
function toggleItem(id) {
  const item = learningItems.find((i) => i.id === id);
  if (item) {
    item.completed = !item.completed;
    localStorage.setItem("learningItems", JSON.stringify(learningItems));
    renderItems();
    updateProgress();
  }
}

// Delete single item
function deleteItem(id) {
  learningItems = learningItems.filter((i) => i.id !== id);
  localStorage.setItem("learningItems", JSON.stringify(learningItems));
  renderItems();
  updateProgress();
}

// Update progress bar and text
function updateProgress() {
  const total = learningItems.length;
  const completed = learningItems.filter((i) => i.completed).length;

  progressText.textContent = `${completed} of ${total} Completed`;

  // Create segmented progress bar
  segmentedProgressBar.innerHTML = "";

  if (total === 0) {
    segmentedProgressBar.innerHTML =
      '<div class="empty-progress">Start by adding your first learning item!</div>';
    return;
  }

  learningItems.forEach((item) => {
    const segment = document.createElement("div");
    segment.className = "progress-segment";
    segment.style.backgroundColor = item.completed ? "#4caf50" : "#d0d0d0";
    segment.style.flex = "1";
    segment.style.height = "25px";
    segment.style.margin = "0 2px";
    segment.style.borderRadius = "4px";
    segment.style.transition = "all 0.3s ease";
    segment.title = item.text;

    // Add hover effect
    segment.addEventListener("mouseover", function () {
      this.style.transform = "scaleY(1.2)";
      this.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
    });

    segment.addEventListener("mouseout", function () {
      this.style.transform = "scaleY(1)";
      this.style.boxShadow = "none";
    });

    segmentedProgressBar.appendChild(segment);
  });
}

// Clear All button - show confirmation modal
clearAllBtn.addEventListener("click", function () {
  confirmationModal.style.display = "block";
});

// Confirm Yes - clear all items
confirmYes.addEventListener("click", function () {
  learningItems = [];
  localStorage.setItem("learningItems", JSON.stringify(learningItems));
  confirmationModal.style.display = "none";
  renderItems();
  updateProgress();
});

// Confirm No - hide modal
confirmNo.addEventListener("click", function () {
  confirmationModal.style.display = "none";
});
