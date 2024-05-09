

// Function to set the left position based on the container's width
function updateSideHiderPosition(width) {
  const sideHiderRight = document.querySelector('.pdf-side-hider-right');
  if (sideHiderRight) {
    sideHiderRight.style.left = `${width}px`;
  }
}

// Create a new ResizeObserver instance
const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    // Assuming there's only one element being observed: .pdf-container
    const containerWidth = entry.contentRect.width;
    updateSideHiderPosition(containerWidth);
  }
});

// Start observing the .pdf-container element
/*
setTimeout(function() {
	const pdfContainer = document.querySelector('.pdf-container');
	if (pdfContainer) {
	  resizeObserver.observe(pdfContainer);
	}
}, 1000);
*/
