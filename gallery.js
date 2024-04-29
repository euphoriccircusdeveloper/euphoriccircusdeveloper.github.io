window.onload = function() {
    // Fetch images from /static/images/gallery directory
    fetch('/static/images/gallery')
      .then(response => response.json())
      .then(data => {
        // Assuming the response is an array of image URLs
        if (Array.isArray(data)) {
          // Assign images to the Alpine.js data property
          Alpine.store('images', data);
        }
      });
  }
