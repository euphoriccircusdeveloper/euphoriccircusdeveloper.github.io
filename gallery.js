document.addEventListener('alpine:init', () => {
    Alpine.data('gallery', () => ({
      images: [],

      init() {
        // Fetch images from /static/images/gallery directory
        fetch('global/assets/images/page-images/gallery-images')
          .then(response => response.json())
          .then(data => {
            // Assuming the response is an array of image URLs
            if (Array.isArray(data)) {
              // Assign images to the Alpine.js data property
              this.images = data;
            }
          });
      }
    }));
  });
