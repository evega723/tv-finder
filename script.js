const showSelect = document.getElementById("show-select");



//async/await function to get API
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