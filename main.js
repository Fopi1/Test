const apiUrl = "https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=7";

let allPosts = [];

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Ошибка при загрузке данных");
    }
    return response.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

function changeTheme(event) {
  const parentDiv = event.target.closest("div");
  parentDiv.classList.toggle("post-dark");
  parentDiv.querySelector(".post-title").classList.toggle("post-title-dark");
  parentDiv
    .querySelector(".post-description")
    .classList.toggle("post-description-dark");
}

function createPostElement(post) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("post");

  const title = document.createElement("h1");
  title.classList.add("post-title");
  title.innerHTML = post.title;

  const description = document.createElement("p");
  description.classList.add("post-description");
  description.innerHTML = post.body;

  const checkbox = document.createElement("input");
  checkbox.classList.add("post-checkbox");
  checkbox.type = "checkbox";
  checkbox.id = post.id;
  checkbox.addEventListener("click", changeTheme);

  postDiv.append(title, description, checkbox);
  return postDiv;
}

function filterPosts(posts, filterText) {
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(filterText.toLowerCase())
  );
  return filteredPosts;
}

function renderPosts(posts) {
  const postContainer = document.getElementById("posts-container");
  postContainer.innerHTML = "";

  posts.forEach((post) => {
    postContainer.appendChild(createPostElement(post));
  });
}

function handleSearch() {
  const searchInput = document.getElementById("titleFilter");
  const filterText = searchInput.value.trim();

  blockForm(true);

  const params = new URLSearchParams(window.location.search);
  if (filterText) {
    params.set("title", filterText);
  } else {
    params.delete("title");
  }
  history.replaceState(null, "", `?${params.toString()}`);

  const filteredPosts = filterPosts(allPosts, filterText);
  renderPosts(filteredPosts);

  blockForm(false);
}

function blockForm(isBlocked) {
  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("titleFilter");

  searchButton.disabled = isBlocked;
  searchInput.disabled = isBlocked;
}

async function initializeSearchFromURL() {
  const params = new URLSearchParams(window.location.search);
  const filterTitle = params.get("title");
  const searchInput = document.getElementById("titleFilter");

  allPosts = await fetchData();

  if (filterTitle) {
    searchInput.value = filterTitle;
    const filteredPosts = filterPosts(allPosts, filterTitle);
    renderPosts(filteredPosts);
  } else {
    renderPosts(allPosts);
  }
}

window.addEventListener("load", initializeSearchFromURL);

document.getElementById("searchButton").addEventListener("click", handleSearch);
