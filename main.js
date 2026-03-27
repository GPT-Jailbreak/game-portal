let games = [];

const container = document.getElementById('container');
const searchBar = document.getElementById('searchBar');
const gameFrame = document.getElementById('gameFrame');

// Load games.json
async function loadGames() {
  try {
    const response = await fetch('games.json?t=' + Date.now());
    games = await response.json();
    displayGames(games);

    // Support ?id=123
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      const game = games.find(g => String(g.id) === String(id));
      if (game) openGame(game);
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = "Failed to load games.json";
  }
}

// Display list
function displayGames(list) {
  container.innerHTML = "";

  list.forEach(game => {
    const item = document.createElement('div');
    item.className = "game-item";
    item.textContent = game.name;
    item.onclick = () => openGame(game);
    container.appendChild(item);
  });
}

// Search
function filterGames() {
  const q = searchBar.value.toLowerCase();
  const filtered = games.filter(g => g.name.toLowerCase().includes(q));
  displayGames(filtered);
}

// Open game in iframe
function openGame(game) {
  gameFrame.src = game.url;

  // Update URL
  try {
    const url = new URL(window.location);
    url.searchParams.set('id', game.id);
    history.pushState(null, "", url.toString());
  } catch (e) {}
}

loadGames();
