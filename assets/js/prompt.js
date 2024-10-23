
const fileInput = document.getElementById('pdfFile');
const filePreview = document.getElementById('filePreview');
const fileNameElement = document.getElementById('fileName');
const fileIconElement = document.getElementById('fileIcon');
const userInput = document.getElementById('verify');
const submit = document.getElementById('submit');

fileInput.addEventListener('change', function() {
    const selectedFile = fileInput.files[0];
  
    if (selectedFile) {
        const reader = new FileReader();
  
        reader.onload = function(event) {
            const fileData = event.target.result;
  
            // Detect and handle text files
            if (selectedFile.type.startsWith('text/')) {
                const pre = document.createElement('pre');
                pre.textContent = fileData;
                filePreview.innerHTML = ''; // Clear previous content
                filePreview.appendChild(pre);
                fileNameElement.textContent = selectedFile.name;
                fileIconElement.innerHTML = '<i class="bi bi-file-text"></i>';
            } 
            // Detect and handle PDF files
            else if (selectedFile.type === 'application/pdf') {
                fileNameElement.textContent = selectedFile.name;
                fileIconElement.innerHTML = '<i class="bi bi-file-pdf"></i>';
               // filePreview.textContent = 'PDF selected. Preview available using PDF.js';
            } 
            // Detect and handle DOCX files
            else if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || selectedFile.name.endsWith('.docx')) {
                // Notify user that a DOCX file is selected
                fileNameElement.textContent = selectedFile.name;
                fileIconElement.innerHTML = '<i class="bi bi-file-earmark-word"></i>';
               // filePreview.textContent = 'DOCX file selected.';
            } 
            // Handle unsupported file types
            else {
                filePreview.textContent = 'Unsupported file type selected.';
                fileNameElement.textContent = selectedFile.name;
                fileIconElement.innerHTML = '<i class="bi bi-file-earmark"></i>';
            }
        };
  
        // Read the file (no need for array buffer as we're not extracting DOCX content)
        reader.readAsDataURL(selectedFile);
    } else {
        // Clear the preview if no file is selected
        filePreview.textContent = '';
        fileNameElement.textContent = '';
        fileIconElement.innerHTML = '';
    }
  });
  
  

  


  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

 

//   document.getElementById('submit').addEventListener('click', async function (event) {
//     event.preventDefault(); // Prevent form submission
    
//     const fileInput = document.getElementById('pdfFile');
//     const file = fileInput.files[0]; // Get the selected file
//     const userInput = document.getElementById('userInput'); // User input for manual text entry
//     let extractedText = ''; // Initialize for text extraction
//     const preloader = document.getElementById('preloader');
//     const resultDiv = document.getElementById('result');
    
//     if (file) {
//         const fileType = file.type;
//         const fileReader = new FileReader();

//         // Check for PDF file
//         if (fileType === 'application/pdf') {
//             fileReader.onload = async function () {
//                 const typedArray = new Uint8Array(this.result);
//                 const pdf = await pdfjsLib.getDocument(typedArray).promise;

//                 let pagesPromises = [];
//                 for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
//                     pagesPromises.push(pdf.getPage(pageNumber).then(page => {
//                         return page.getTextContent().then(textContent => {
//                             let pageText = textContent.items.map(item => item.str).join(' ');
//                             extractedText += `Page ${pageNumber}:\n${pageText}\n\n`;
//                         });
//                     }));
//                 }

//                 await Promise.all(pagesPromises);
//                 console.log('Text extraction completed (PDF):', extractedText);
//                 await generateResponse(extractedText);
//             };
//             fileReader.readAsArrayBuffer(file);
//         }
//         // Check for DOCX file
//         else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
//             fileReader.onload = async function (event) {
//                 const arrayBuffer = event.target.result;
//                 try {
//                     const result = await mammoth.extractRawText({ arrayBuffer });
//                     extractedText = result.value;
//                     console.log('Text extraction completed (DOCX):', extractedText);
//                     await generateResponse(extractedText);
//                 } catch (error) {
//                     console.error('Error extracting DOCX:', error);
//                 }
//             };
//             fileReader.readAsArrayBuffer(file);
//         }
//         // Invalid file type
//         else {
//             alert('Please select a valid PDF or DOCX file.');
//         }
//     }
//     // If no file but user input is provided
//     else if (userInput.value) {
//         extractedText = userInput.value;
//         console.log('Using user input text:', extractedText);
//         await generateResponse(extractedText);
//     }

//     // Function to load PDF from URL
//     async function extractPDFText(url) {
//         const loadingTask = pdfjsLib.getDocument(url);
//         const pdf = await loadingTask.promise;
//         let fullText = '';

//         for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//             const page = await pdf.getPage(pageNum);
//             const textContent = await page.getTextContent();
//             const textItems = textContent.items.map(item => item.str).join(' ');
//             fullText += `Page ${pageNum}: ${textItems}\n\n`;
//         }

//         return fullText;
//     }

//     // On page load, extract text from a pre-defined PDF (if applicable)
//     window.onload = async function () {
//         const pdfUrl = '../knowledgeBase.pdf'; // Replace with your PDF URL
//         const extractedText2 = await extractPDFText(pdfUrl);
//         console.log('Extracted Text from knowledgeBase:', extractedText2);
//     };

//     // Function to generate response from the language model
//     async function generateResponse(extractedText) {
//         try {
//             preloader.style.display = 'flex'; // Show preloader

//             // Simulate processing delay
//             await new Promise(resolve => setTimeout(resolve, 2000));

//             // Check if language model is available
//             const isAvailable = await ai.languageModel.capabilities();
//             if (isAvailable !== "no") {
//                 const session = await ai.languageModel.create();
//                 const pdfUrl = '../knowledgeBase.pdf'; // URL for knowledge base
//                 const extractedText2 = await extractPDFText(pdfUrl);

//                 const result = await session.prompt(`
//                     Analyze the following text for misinformation: "${extractedText}". 
//                     Use this knowledge base: "${extractedText2}". 
//                     Summarize the findings and rank the misinformation based on severity.
//                 `);

//                 resultDiv.textContent = result; // Display result in the browser
//             } else {
//                 console.log("Language model is not available.");
//             }
//         } catch (error) {
//             console.error("An error occurred:", error);
//         } finally {
//             preloader.style.display = 'none'; // Hide preloader after processing
//         }
//     }
// });

// // PDF.js worker

// document.getElementById('submit').addEventListener('click', async function (event) {
//     event.preventDefault(); // Prevent form submission
    
//     const fileInput = document.getElementById('pdfFile');
//     const file = fileInput.files[0]; // Get the selected file
//     const userInput = document.getElementById('userInput'); // User input for manual text entry
//     let extractedText = ''; // Initialize for text extraction
//     const preloader = document.getElementById('preloader');
//     const resultDiv = document.getElementById('result');
    
//     // Show preloader after the button is clicked
//     preloader.style.display = 'flex'; 

//     if (file) {
//         const fileType = file.type;
//         const fileReader = new FileReader();

//         // Check for PDF file
//         if (fileType === 'application/pdf') {
//             fileReader.onload = async function () {
//                 const typedArray = new Uint8Array(this.result);
//                 const pdf = await pdfjsLib.getDocument(typedArray).promise;

//                 let pagesPromises = [];
//                 for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
//                     pagesPromises.push(pdf.getPage(pageNumber).then(page => {
//                         return page.getTextContent().then(textContent => {
//                             let pageText = textContent.items.map(item => item.str).join(' ');
//                             extractedText += `Page ${pageNumber}:\n${pageText}\n\n`;
//                         });
//                     }));
//                 }

//                 await Promise.all(pagesPromises);
//                 console.log('Text extraction completed (PDF):', extractedText);
//                 await generateResponse(extractedText);
//             };
//             fileReader.readAsArrayBuffer(file);
//         }
//         // Check for DOCX file
//         else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
//             fileReader.onload = async function (event) {
//                 const arrayBuffer = event.target.result;
//                 try {
//                     const result = await mammoth.extractRawText({ arrayBuffer });
//                     extractedText = result.value;
//                     console.log('Text extraction completed (DOCX):', extractedText);
//                     await generateResponse(extractedText);
//                 } catch (error) {
//                     console.error('Error extracting DOCX:', error);
//                 }
//             };
//             fileReader.readAsArrayBuffer(file);
//         }
//         // Invalid file type
//         else {
//             alert('Please select a valid PDF or DOCX file.');
//             preloader.style.display = 'none'; // Hide preloader if invalid file
//         }
//     }
//     // If no file but user input is provided
//     else if (userInput.value) {
//         extractedText = userInput.value;
//         console.log('Using user input text:', extractedText);
//         await generateResponse(extractedText);
//     } else {
//         alert('Please select a file or provide input.');
//         preloader.style.display = 'none'; // Hide preloader if no input
//     }

//     // Function to generate response from the language model
//     async function generateResponse(extractedText) {
//         try {
//             // Simulate processing delay for 2 seconds
//             await new Promise(resolve => setTimeout(resolve, 2000));

//             // Check if language model is available
//             const isAvailable = await ai.languageModel.capabilities();
//             if (isAvailable !== "no") {
//                 const session = await ai.languageModel.create();
//                 const pdfUrl = '../knowledgeBase.pdf'; // URL for knowledge base
//                 const extractedText2 = await extractPDFText(pdfUrl);

//                 const result = await session.prompt(`
//                     Analyze the following text for misinformation: "${extractedText}". 
//                     Use this knowledge base: "${extractedText2}". 
//                     Summarize the findings and rank the misinformation based on severity.
//                 `);

//                 resultDiv.textContent = result; // Display result in the browser
//             } else {
//                 console.log("Language model is not available.");
//             }
//         } catch (error) {
//             console.error("An error occurred:", error);
//         } finally {
//             preloader.style.display = 'none'; // Hide preloader after processing
//         }
//     }
// });
// pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

document.getElementById('submit').addEventListener('click', async function (event) {
    event.preventDefault(); // Prevent form submission
    
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0]; // Get the selected file
    const userInput = document.getElementById('userInput'); // User input for manual text entry
    let extractedText = ''; // Initialize for text extraction
    const preloader = document.getElementById('preloader');
    const resultDiv = document.getElementById('result');
    
    // Show preloader after the button is clicked
    preloader.style.display = 'flex'; 

    if (file) {
        const fileType = file.type;
        const fileReader = new FileReader();

        // Check for PDF file
        if (fileType === 'application/pdf') {
            fileReader.onload = async function () {
                const typedArray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument(typedArray).promise;

                let pagesPromises = [];
                for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                    pagesPromises.push(pdf.getPage(pageNumber).then(page => {
                        return page.getTextContent().then(textContent => {
                            let pageText = textContent.items.map(item => item.str).join(' ');
                            extractedText += `Page ${pageNumber}:\n${pageText}\n\n`;
                        });
                    }));
                }

                await Promise.all(pagesPromises);
                console.log('Text extraction completed (PDF):', extractedText);
                await generateResponse(extractedText);
            };
            fileReader.readAsArrayBuffer(file);
        }
        // Check for DOCX file
        else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
            fileReader.onload = async function (event) {
                const arrayBuffer = event.target.result;
                try {
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    extractedText = result.value;
                    console.log('Text extraction completed (DOCX):', extractedText);
                    await generateResponse(extractedText);
                } catch (error) {
                    console.error('Error extracting DOCX:', error);
                }
            };
            fileReader.readAsArrayBuffer(file);
        }
        // Invalid file type
        else {
            alert('Please select a valid PDF or DOCX file.');
            preloader.style.display = 'none'; // Hide preloader if invalid file
        }
    }
    // If no file but user input is provided
    else if (userInput.value) {
        extractedText = userInput.value;
        console.log('Using user input text:', extractedText);
        await generateResponse(extractedText);
    } else {
        alert('Please select a file or provide input.');
        preloader.style.display = 'none'; // Hide preloader if no input
    }

    // Function to generate response from the language model
    async function generateResponse(extractedText) {
        try {
            // Simulate processing delay for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Check if language model is available
            const isAvailable = await ai.languageModel.capabilities();
            if (isAvailable !== "no") {
                const session = await ai.languageModel.create();
                const pdfUrl = 'https://knowledgebase-brown.vercel.app/kb.pdf'; // URL for knowledge base
                const extractedText2 = await extractPDFText(pdfUrl); // Call the new function

                const result = await session.prompt(`
                    Analyze the following text for misinformation: "${extractedText}". 
                    Use this knowledge base: "${extractedText2}". 
                    Summarize the findings and rank the misinformation based on severity. Also if the text doesn't contain any medical content. inform the user that material submitted does not contain medical related content
                `);

                resultDiv.textContent = result; // Display result in the browser
            } else {
                console.log("Language model is not available.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            preloader.style.display = 'none'; // Hide preloader after processing
        }
    }
});

// Declare the missing function for extracting text from a PDF URL
async function extractPDFText(pdfUrl) {
    try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        let extractedText = '';

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            extractedText += `Page ${pageNumber}:\n${pageText}\n\n`;
        }

        console.log('Text extraction completed (PDF from URL):', extractedText);
        return extractedText;
    } catch (error) {
        console.error('Error extracting PDF from URL:', error);
        return '';
    }
}

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
