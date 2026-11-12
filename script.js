const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");
const message = document.getElementById("message");

function setMessage(text) {
  message.textContent = text;
}

//1st API request
async function loadShows() {

  const url = "https://api.tvmaze.com/shows?page=0";
  setMessage("Loading shows...");

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const shows = await res.json();
    const topShows = [...shows]
      .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
      .slice(0, 25);
    fillDropdown(topShows);
    setMessage("");
  } 
  
  catch (error) {
    console.error(error);
    setMessage(error instanceof Error ? error.message : "Unable to load shows.");
  }
}




//2nd API request
async function loadShowDetails(id) {
  const url = `https://api.tvmaze.com/showz/${id}`;

  setMessage("Loading show details...");

  try {
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("The show could not be found.");
      }


      throw new Error(`Request failed with status ${res.status}`);
    }

    const show = await res.json();
    displayDetails(show);
    setMessage("");
  } 
  
  catch (error) {
    console.error(error);
    setMessage(error instanceof Error ? error.message : "Unable to load show details.");
  }
}

showSelect.addEventListener("change", function () {
  const id = showSelect.value;

  if (id === "") {
    return;
  }

  loadShowDetails(id);
});


//fill in dropdown menus
function fillDropdown(shows) {
  showSelect.replaceChildren();

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a show";
  showSelect.appendChild(placeholder);

  for (const show of shows) {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  }
}



//Display the show images and descriptions

function displayDetails(show) {
  showDetails.replaceChildren();

  const heading = document.createElement("h2");
  heading.textContent = show.name;
  showDetails.appendChild(heading);

  if (show.image) {
    const poster = document.createElement("img");
    poster.src = show.image.medium;
    poster.alt = `Poster for ${show.name}`;
    showDetails.appendChild(poster);

  } 
  
  else {
    const noPoster = document.createElement("p");

    noPoster.textContent = "No poster available";
    showDetails.appendChild(noPoster);
  }

  const summary = document.createElement("div");

  summary.innerHTML = show.summary || "No summary available";
  showDetails.appendChild(summary);

  const genres = show.genres.join(", ") || "Not listed";
  const premiered = show.premiered || "Unknown";
  const status = show.status || "Unknown";
  const rating = show.rating?.average ?? "Not rated";
  const information = document.createElement("p");

  information.textContent = `Genres: ${genres} | Premiered: ${premiered} | Status: ${status} | Rating: ${rating}`;
  showDetails.appendChild(information);
}

loadShows();