const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");


//1st API request
async function loadShows() {

  const url = "https://api.tvmaze.com/shows?page=0";

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`

      );
    }

    const shows = await res.json();
    const topShows = [...shows]
      .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
      .slice(0, 25);
    fillDropdown(topShows);
  } 
  
  catch (error) {
    console.error(error);
  }
}




//2nd API request
async function loadShowDetails(id) {
  const url = `https://api.tvmaze.com/shows/${id}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const show = await res.json();
    console.log(show);
  } catch (error) {
    console.error(error);
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

loadShows();