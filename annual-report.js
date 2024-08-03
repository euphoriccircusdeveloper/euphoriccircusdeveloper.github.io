var url = 'https://l-holmes.github.io/CLICK-HERE/reports/annual-report.pdf';

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


//////////////////////
var loadingTask = pdfjsLib.getDocument(url);

function renderPDFOld(){
	loadingTask.promise.then(function(pdf) {
		pdf.getPage(1).then(function(page) {
			console.log("rendering first page...............")
			var scale = 0.9;
			var viewport = page.getViewport({ scale: scale });

			// Prepare canvas using PDF page dimensions
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			canvas.height = viewport.height;
			canvas.width = viewport.width;

			const pdfContainer = document.getElementById('pdf-container');
			pdfContainer.innerHTML = ''; // Clear any previous content
			pdfContainer.appendChild(canvas);

			// Render PDF page into canvas context
			var renderContext = {
				canvasContext: context,
				viewport: viewport
			};
			page.render(renderContext).promise.then(() => {
				centerPDF();
			});
		});
	}).catch(function(reason) {
		console.error(reason);
	});
}

function renderPDF() {
    loadingTask.promise.then(function(pdf) {
		console.log("aahhhhhhhhhhhhhhhhhhh")
        const pdfContainer = document.getElementById('pdf-container');
        pdfContainer.innerHTML = ''; // Clear any previous content

        function renderPage(pageNum) {
			console.log("ahhhhhhh2")
            pdf.getPage(pageNum).then(function(page) {
                var scale = 0.9;
                var viewport = page.getViewport({ scale: scale });
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                pdfContainer.appendChild(canvas);

                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                page.render(renderContext).promise.then(() => {
					console.log("rendering with page num: ", pageNum)
                    if (pageNum < pdf.numPages) {
                        // If there are more pages, render the next one
                        renderPage(pageNum + 1);
                    } else {
                        // All pages rendered, now center the PDF
                        centerPDF();
                    }
                });
            });
        }

        // Start rendering from the first page
        renderPage(1);
    }).catch(function(reason) {
        console.error(reason);
    });
}

function centerPDF() {
	const pdfContainer = document.getElementById('john');
	const canvas = pdfContainer.querySelector('canvas');
	console.log("centering the pdf")
	if (canvas) {
		console.log("found the canvas")
		const containerWidth = pdfContainer.clientWidth;
		const contentWidth = canvas.width;

		// Calculate the amount to scroll to center the content
		const scrollAmount = (contentWidth - containerWidth) / 2;
		console.log("got the scroll amount: ", scrollAmount)

		// Set the scroll position
		pdfContainer.scrollLeft = scrollAmount;
	}
}

// Debounce function to limit the rate of calling a function
function debounce(func, wait) {
	let timeout;
	return function() {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, arguments), wait);
	};
}

// Add resize event listener with debounce
window.addEventListener('resize', debounce(() => {
	renderPDF();
}, 200));

renderPDF();


document.addEventListener('DOMContentLoaded', function() {
	const pd2 = document.getElementById('john');

	pd2.addEventListener('scroll', function() {
		// Log the horizontal scroll amount
		console.log('222 Horizontal scroll amount:', pd2.scrollLeft);
	});

})
