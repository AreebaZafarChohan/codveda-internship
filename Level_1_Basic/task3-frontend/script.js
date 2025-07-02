document.addEventListener("DOMContentLoaded", () => {
  const fetchBtn = document.getElementById("fetchBtn");
  const userList = document.getElementById("userList");
  const loader = document.getElementById("loader");
  const searchInput = document.getElementById("searchInput");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");
  const themeText = themeToggle.querySelector("span");
  const themeImages = document.querySelectorAll(".theme-image");

  let usersData = [];
  let currentTheme = localStorage.getItem("theme") || "light";

  // Apply saved theme on load
  applyTheme(currentTheme);

  // Theme toggle functionality
  themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(currentTheme);
    localStorage.setItem("theme", currentTheme);
  });

  function applyTheme(theme) {
    // Set data-theme attribute
    document.documentElement.setAttribute("data-theme", theme);

    // Update toggle button
    if (theme === "dark") {
      themeIcon.className = "fas fa-sun";
      themeText.textContent = "Light Mode";
    } else {
      themeIcon.className = "fas fa-moon";
      themeText.textContent = "Dark Mode";
    }

    // Toggle images based on theme
    themeImages.forEach((img) => {
      img.classList.remove("active");
      if (img.getAttribute("data-theme") === theme) {
        img.classList.add("active");
      }
    });
  }

  const fetchUsers = () => {
    userList.innerHTML = "";
    loader.classList.remove("hidden");

    fetch("http://localhost:3000/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        loader.classList.add("hidden");
        usersData = data;
        console.log(usersData)
        displayUsers(data);
      })
      .catch((error) => {
        loader.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Error loading users. Please try again.`;
        console.error("Error:", error);

        const errorCard = document.createElement("div");
        errorCard.className = "error-message";
        errorCard.innerHTML = `
              <i class="fas fa-exclamation-circle"></i>
              <p>Failed to load user data. Please check your connection and try again.</p>
            `;
        userList.appendChild(errorCard);
      });
  };

  const displayUsers = (users) => {
    userList.innerHTML = "";

    if (users.length === 0) {
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.innerHTML = `
            <i class="fas fa-user-slash"></i>
            <p>No users found</p>
          `;
      userList.appendChild(noResults);
      return;
    }

    users.forEach((user) => {
      const card = document.createElement("div");
      card.className = "user-card";
      card.innerHTML = `
            <h3><i class="fas fa-user"></i> ${user.name || "Unknown User"}</h3>
            <p><strong>Email:</strong> ${
              user.email || "example123@gmail.com"
            }</p>
            <p><strong>Role:</strong> ${user.role || "Member"}</p>
            <span class="user-id">ID: ${user.id}</span>
          `;
      userList.appendChild(card);
    });
  };

  const filterUsers = (searchTerm) => {
    const filteredUsers = usersData.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    displayUsers(filteredUsers);
  };

  // Event listeners
  fetchBtn.addEventListener("click", fetchUsers);

  searchInput.addEventListener("input", (e) => {
    if (usersData.length > 0) {
      filterUsers(e.target.value);
    }
  });

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  searchInput.addEventListener(
    "input",
    debounce((e) => {
      if (usersData.length > 0) {
        filterUsers(e.target.value);
      }
    }, 300)
  );
});
