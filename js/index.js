const accessKey = 'HL1sU76HhNpmyMct_wiaUHjGDnIfAFcGcaDAxJJ_Kys'; // Replace with your actual Unsplash API access key
const searchForm = document.getElementById("search_form"),
  searchBox = document.getElementById("search_box"),
  searchResult = document.getElementById("search_result"),
  showMoreBtn = document.getElementById("show_more_btn"),
  errorMessage = document.getElementById("error_message");

let keyword = '';
let page = 1;

async function searchImg() {
  keyword = searchBox.value;
  if (keyword.trim() === '') return;
  if (!keyword) return; // Check if keyword is not empty
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results.length === 0) {
      errorMessage.style.display = 'block'; // Show error message
      searchResult.innerHTML = ''; // Clear previous results
      showMoreBtn.style.display = 'none'; // Hide show more button
    } else {
      errorMessage.style.display = 'none'; // Hide error message
      displayResults(data.results);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayResults(results) {
  if (page === 1) {
    searchResult.innerHTML = ''; // Clear previous results on new search
  }
  results.forEach(async result => {
    const img = document.createElement('img');
    img.src = result.urls.small;
    img.alt = result.alt_description;

    const link = document.createElement('a');
    link.href = result.urls.full; // Link to the full-size image
    link.target = '_blank'; // Open in a new tab
    link.appendChild(img);

    const downloadLink = document.createElement('a');
    downloadLink.classList.add('download_link');
    downloadLink.href = result.links.download_location; // Use the download location
    downloadLink.innerHTML = '<i class="ri-arrow-down-line" title=Download></i>'; // Add icon and text
    downloadLink.style.display = 'block'; // Display as block to appear below the image
    downloadLink.addEventListener('click', async (e) => {
      e.preventDefault();
      const response = await fetch(result.links.download_location + `?client_id=${accessKey}`);
      const data = await response.json();
      const downloadUrl = data.url;
      const blob = await fetch(downloadUrl).then(r => r.blob());
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = result.alt_description || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });

    const container = document.createElement('div');
    container.classList.add('container');
    container.appendChild(link);
    container.appendChild(downloadLink);

    searchResult.appendChild(container);
  });
  showMoreBtn.style.display = results.length > 0 ? 'block' : 'none'; // Show button only if results are available
}


searchForm.addEventListener('click', (e) => {
  e.preventDefault();
  page = 1;
  searchImg();
});

showMoreBtn.addEventListener('click', () => {
  page++;
  searchImg();
});
searchBox.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    page = 1;
    searchImg();
  }
});