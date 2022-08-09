/**
 * @param {string} fileName 
 * @param {string} text 
 */
const downloadTxtFile = (fileName, text) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element)
}

/**
 * invoked from dashboard/CurrentYearFeesStatistics
 * @param {string} fileName 
 * @param {Array<string>} heading 
 * @param {Array<Array<string>>} body 
 */
export const generateCsv = (fileName, heading, body) => {
    const lines = []
    lines.push(`"${heading.join('","')}"`)
    body.forEach(line => lines.push(`"${line.join('","')}"`))
    downloadTxtFile(fileName, lines.join('\n'))
}