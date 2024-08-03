document.addEventListener("DOMContentLoaded", setDynamicElementsContent);

// TODO: 
// get a list of the files in the 'x' directory 
// each of the files are <name-surname>--<their-role>.png
// generate html for:
//	image -> name -> role 

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
async function contentGetter_team_members() {
	var gallery_images_dir_from_root="CLICK-HERE/team-members/"
	var gallery_images_list=await get_gallery_images(gallery_images_dir_from_root)

	console.log("	! got the images list: !")
	console.log(gallery_images_list)

	var constructed_html = await get_images_string(gallery_images_list)
	console.log("	! got the constructed html: !")
	console.log(constructed_html)

	return constructed_html
}

//tier 2


/**
 * GETS A LIST OF FILENAMES
 * @return: essentially; {{filname:'name', filepath:'path'},{...},{...},..., {...}}
**/
async function get_gallery_images(directory) {
	github_images_repo=`https://api.github.com/repos/L-Holmes/L-Holmes.github.io/contents/${directory}`
    try {

		const response = await fetch(github_images_repo);
        if (!response.ok) {
            throw new Error('Failed to fetch images: ' + response.statusText + ' :o (does the image folder that you are looking for exist on github?) ' + response);
        }
		//can use file.path to get the path and file.name to get the name
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * GENERATES A HTML STRING FROM THE PASSED FILESNAMES
**/
async function get_images_string(gallery_files_list){
	// Assuming gallery_files_list is an array containing the filenames
	// Construct the base URL for the images
	console.log("got the team members files list:")
	console.log(gallery_files_list)

	// Initialize the constructedHtml variable
	var constructedHtml = "";

	// Loop through the gallery files list
	for (var i = 0; i < gallery_files_list.length; i += 1) {

		// Get the filenames
		var file1 = gallery_files_list[i];

				
		// Get the name
		const NAME_ROLE_SEPARATOR = "--";
		const namesSplit = file1.name.split(NAME_ROLE_SEPARATOR);
		if (namesSplit.length !== 2) {
			console.log(`Your file name: ${file1.name} is not in the correct format. It must be '<name>${NAME_ROLE_SEPARATOR}<role>.png' where <name> represents the name of the person, with the forename and the surname separate by '_' e.g. John_Doe, and the role must also be separated by '_' e.g. Tech_Advisor. Putting that together you would have John_Doe--Tech_Advisor.png`);
		}
		const nameWithUnderscores = namesSplit[0];
		const roleWithUnderscores = namesSplit[1];
		const name = nameWithUnderscores.split("_").join(" ");
		const roleWithFileExtension = roleWithUnderscores.split("_").join(" ");
		const lastDotIndex = roleWithFileExtension.lastIndexOf(".");
		const role = roleWithFileExtension.substring(0, lastDotIndex);

		// Construct HTML markup for the images
		var baseString = `
		<div class="team-member-wrapper">
			<img class="team-member-img" src="${file1.path}" alt="">
			<h2>${name} </h2>
			<div>${role} </div>
		</div>
		`;

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
/////////////////////////////////////
/////////////////////////////////////

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
