// Data for movies
const movies = [
  {
    id: 1,
    title: "Inception",
    image: "https://via.placeholder.com/200x250",
    description: "A mind-bending thriller about dream manipulation.",
  },
  {
    id: 2,
    title: "The Matrix",
    image: "https://via.placeholder.com/200x250",
    description: "A sci-fi classic about virtual reality and human existence.",
  },
  {
    id: 3,
    title: "Interstellar",
    image: "https://via.placeholder.com/200x250",
    description: "A space epic exploring love, time, and the survival of humanity.",
  },
];

let nextId = 4;

const movieContainer = document.getElementById("movie-container");
const addMovieButton = document.getElementById("add-movie");

function renderMovies() {
  movieContainer.innerHTML = "";
  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    // Assign viewTransitionName
    if (movie.isNew) {
      card.style.viewTransitionName = "movie-card";
    } else {
      card.style.viewTransitionName = `movie-card-${movie.id}`;
    }
    card.setAttribute("data-view-transition-name", `movie-card-${movie.id}`);

    card.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}" class="movie-img" />
      <h3 class="movie-title">${movie.title}</h3>
      <p class="movie-description">${movie.description}</p>
      <button class="delete-button" data-id="${movie.id}">Delete</button>
    `;
    card.querySelector(".delete-button").addEventListener("click", () => deleteMovie(movie.id));
    movieContainer.appendChild(card);

    delete movie.isNew;
  });
}

// Delete Movie with View Transition
function deleteMovie(id) {
  const index = movies.findIndex((movie) => movie.id === id);
  if (index > -1) {
    const targetCard = document.querySelector(`[data-view-transition-name="movie-card-${id}"]`);
    targetCard.style.viewTransitionName = "movie-card";

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        movies.splice(index, 1);
        renderMovies();
      });
    } else {
      // No animation fallback: remove immediately
      movies.splice(index, 1);
      renderMovies();
    }
  }
}

// Add New Movie with View Transition
addMovieButton.addEventListener("click", () => {
  const newMovie = {
    id: nextId++,
    title: `Movie ${nextId}`,
    image: "https://via.placeholder.com/200x250",
    description: "Description for the new movie.",
    isNew: true,
  };

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      movies.push(newMovie);
      renderMovies();
    });
  } else {
    // No animation fallback: add immediately
    movies.push(newMovie);
    renderMovies();
  }
});

// Initial Render
renderMovies();
