

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

//////////////////////

var url = 'https://l-holmes.github.io/shared/images/reports/report.pdf';

// Load PDF
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
// Fetch the first page
pdf.getPage(1).then(function(page) {
  var scale = 1.5;
  var viewport = page.getViewport({ scale: scale });

  // Prepare canvas using PDF page dimensions
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  document.getElementById('pdf-container').appendChild(canvas);

  // Render PDF page into canvas context
  var renderContext = {
	canvasContext: context,
	viewport: viewport
  };
  page.render(renderContext);
});
}, function (reason) {
console.error(reason);
});
