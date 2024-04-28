document.addEventListener("DOMContentLoaded", setDynamicElementsContent);

//--content getters--

async function contentGetter_text_lines() {
	return "<h1> This surrrreeellllyyyy is the dynamic content </h1>"
}


async function contentGetter_loaded_txt() {
	return "loaded text yaaa"
	/*j
	try{
		fileContents = loadFileContents()
	} catch (error) {
		throw error;
	}
	return `${fileContents}`
	*/
}


//////////////////////////
//GROTE FUNCTIONS
//////////////////////////

//start of -----------------------------------------------------
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

//end of -----------------------------------------------------


//////////////////////////
//KLEINE FUNCTIONS
//////////////////////////

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
