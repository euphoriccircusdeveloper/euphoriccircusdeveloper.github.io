document.addEventListener("DOMContentLoaded", setDynamicElementsContent);


async function setDynamicElementsContent(){
	var prefix = "D-"
	var corrContentFuncNameStart = "contentGetter_"

	console.log("Loading the dynamic elements...")

	//get all elements that have an id that starts with the prefix that identifies that element as an element with dymaic content
	const dynamicElements = document.querySelectorAll('[id^="' + prefix + '"]');

	for (let i = 0; i < dynamicElements.length; i++) {
		//--GET THE ELEMENT--
		var element = dynamicElements[i];

		//--GET ITS ID--
		const id = element.id;

		console.log("Setting the inner html to loading...")
		//--SET THAT ELEMENT AS LOADING--
		element.innerHTML = "Loading...";

		//--LOAD EXPECTED FUNCTION NAME--

		//the end of the corresponding content function name 
		const corrContentFuncNameEnd = id.replace(new RegExp('^' + prefix), '').replace(/-/g, '_'); // Remove the prefix from the start and replace dashes with underscores
		//corresponding content function name
		const corrContentFuncName = corrContentFuncNameStart + corrContentFuncNameEnd

		//--ENSURE FUNCTION EXISTS--


		if (!window[corrContentFuncName] || typeof window[corrContentFuncName] !== 'function') {
			//get the list of functions 
			console.error(`There is no function with the name ${corrContentFuncName}. It was expected that this function exists, since you have an element with the id: ${id}, which is seen to be representing a dynamic element due to starting with the prefix ${prefix}. `);
			element.innerHTML = "No content available";
			continue;
		}

		//--GET THE NEW HTML CONTENT USING THAT FUNCTION--
		var elementContent = "No content available."
		try{
			elementContent = await window[corrContentFuncName]();
		} catch (error) {
			console.error(`There was an error when attempting to fetch the content of element with the id: ${id}, using its corresponding function: ${corrContentFuncName}. The error is as follows: ${error}`);
			element.innerHTML = "No content available";
			continue;
		}

		if (elementContent instanceof Promise || String(elementContent) === '[object Promise]') {
			console.error(`There was an error  when attempting to fetch the content of element with the id: ${id}, using its corresponding function: ${corrContentFuncName}. (Received a Promise, not content) `);
			// Output 'error' or handle the error in another way if needed
			element.innerHTML = "No content available";
			continue;
		}
		console.log(`Got the new html content by calling the function name: ${corrContentFuncName}, before receiving the response: ${elementContent}`)

		//--SET THE ELEMENTS NEW CONTENT--
		element.innerHTML = elementContent;
	}
}


//--content getters--

//tier 1
async function contentGetter_gallery_images() {
	console.log("! getting the gallery images !"
	var gallery_images_dir="global/assets/images/page-images/gallery-images/"
	var gallery_images_list=get_gallery_images(gallery_images_dir)
	console.log("	! got the images list: !")
	console.log(gallery_images_list)
	var constructed_html = get_images_string(gallery_files_list)
	console.log("	! got the constructed html: !")
	console.log(constructed_html)
	return constructed_html
}

//tier 2

async function get_gallery_images(directory) {
    try {
        const response = await fetch(directory);
        if (!response.ok) {
            throw new Error('Failed to fetch images: ' + response.statusText);
        }
        const text = await response.text();
        // Split the response text by newline character to get filenames
        const files = text.split('\n');
        return files;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function get_images_string(gallery_files_list){
	// Assuming gallery_files_list is an array containing the filenames
	// Construct the base URL for the images
	var baseUrl = "global/assets/images/page-images/gallery-images/";

	// Initialize the constructedHtml variable
	var constructedHtml = "";

	// Loop through the gallery files list
	for (var i = 0; i < gallery_files_list.length; i += 2) {
		// Determine if there are 1 or 2 images on this row
		var numImages = 1;
		if (i + 1 < gallery_files_list.length) {
			numImages = 2;
		}

		// Get the filenames
		var filename1 = gallery_files_list[i];
		var filename2 = (numImages === 2) ? gallery_files_list[i + 1] : "";

		// Construct HTML markup for the images
		var baseString = `
		<div class="grid-container">
			<img class="${numImages === 1 ? 'full-width-img' : 'half-width-img'}" src="${baseUrl}${filename1}" alt="">
	`;

		// If there are 2 images, add the second image
		if (numImages === 2) {
			baseString += `
			<img class="half-width-img" src="${baseUrl}${filename2}" alt="">
		`;
		}

		// Close the grid container
		baseString += `
		</div>
	`;

		// Append the baseString to constructedHtml
		constructedHtml += baseString;
	}

	// Return the constructed HTML
	return constructedHtml;
}

/////////////////////////////////////


/*
async function contentGetter_gallery_images() {
	var filename_placeholder="[[filename]]";
	var gallery_images_dir="global/assets/images/page-images/gallery-images/"

	//get the list of filenames (e.g. img1.jpeg)
	var gallery_files_list = get_gallery_images()

	//--construct the images html--
	constructedHtml=""
	for(int i = 0; i < len(gallery_files_list); i+=2){
		//determine if there are 1 or 2 images on this row 
		var numImages = 1
		if filename2index < len(gallery_files_list){
			numImages = 2
		}

		//get the first image
		var filename1 = gallery_files_list[i]

		if(numImages==1){
			var base_string = `
			<div class="grid-container">
				<img class="full-width-img" src="global/assets/images/page-images/gallery-images/${filename1}" alt="">
			  </template>
			</div>
			`
		}
		else{
			//2 images

			var filename2 = gallery_files_list[i+1]

			var base_string = `
			<div class="grid-container">
				<img class="half-width-img" src="global/assets/images/page-images/gallery-images/${filename1}" alt="">
				<img class="half-width-img" src="global/assets/images/page-images/gallery-images/${filename2}" alt="">
			  </template>
			</div>
			`

		}

	return constructedString;
}
*/



/**
 * Load the contents of a text file asynchronously.
 * @param {string} filePath - The path to the text file.
 * @returns {Promise<string>} - A promise that resolves with the file contents.
 */
async function loadFileContents(filePath) {
	try {
		const response = await fetch(filePath);
		if (!response.ok) {
			throw new Error(`Error fetching file: ${response.status} ${response.statusText}`);
			return null
		}
		const fileContents = await response.text();
		return fileContents;
	} catch (error) {
		console.error('Error loading file:', error);
		throw error;
	}
}

/**
 * Split the file contents into separate lines.
 * @param {string} fileContents - The contents of the text file.
 * @returns {string[]} - An array of individual lines.
 */
function splitIntoLines(fileContents) {
	return fileContents.split('\n');
}
