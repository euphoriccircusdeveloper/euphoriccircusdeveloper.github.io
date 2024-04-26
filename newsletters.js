


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

///////////////////////
// SPECIAL FUNCTIONS 
//////////////////////

/**
 * This is basically returning alpine.js code
 * When placed inside of an alpine.js x-data, this function:
 * 	--> allows for the variables defined in this function to be accessible to the alpine-js functions.
 * 	--> allows for the function init(), defined in this function, to be accessible to the alpine-js functions.
**/
function fetchVariablesAndFetchInitFunction() {
	return {
		loading: true, // Initially set to true
		lines: [],

		async init() {
			try {
				const filePath = 'text.txt'; // Adjust the file path
				const fileContents = await loadFileContents(filePath);
				this.lines = splitIntoLines(fileContents);
				this.loading = false; // Set loading to false once data is loaded
			} catch (error) {
				console.error('Error loading file:', error);
				// Handle any errors
			}
		},
	};
}
