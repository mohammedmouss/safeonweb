async function fetchRSS() {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const targetUrl = 'https://safeonweb.be/fr/rss';
    const fetchUrl = `${proxyUrl}${encodeURIComponent(targetUrl)}`;
    
    try {
        console.log('Fetching URL:', fetchUrl); // Debugging: Log the request URL
        const response = await fetch(fetchUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // The response is JSON with a `contents` property that contains the base64-encoded RSS feed
        const result = await response.json();
        
        // Decode the base64 string using TextDecoder to handle UTF-8 properly
        const base64Content = result.contents.split(',')[1]; // Extract the base64 data
        const byteArray = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));
        const decodedData = new TextDecoder('utf-8').decode(byteArray);

        console.log('Decoded Data:', decodedData); // Debugging: Log the decoded data
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(decodedData, "application/xml");

        if (xmlDoc.querySelector("parsererror")) {
            throw new Error("Error parsing XML");
        }

        console.log('Parsed XML:', xmlDoc); // Debugging: Log the parsed XML
        const items = xmlDoc.querySelectorAll("item");
        const scrollList = document.getElementById('scroll-list');

        scrollList.innerHTML = ''; // Clear existing items to avoid duplicates

        items.forEach(item => {
            const title = item.querySelector("title")?.textContent || 'No Title';
            const link = item.querySelector("link")?.textContent || '#';
            const description = item.querySelector("description")?.textContent || 'No Description';
            const pubDate = item.querySelector("pubDate")?.textContent || 'No Date';

            // Create an li element for each item
            const newsItem = document.createElement('li');
            newsItem.classList.add('news-item');
            newsItem.innerHTML = `
                <h3><a class="news-item--link" href="${link}" target="_blank">${title}</a></h3>
                <!--<span>${description}</span>
                <small>${pubDate}</small>-->
            `;
            
            // Add the li element to the scroll list
            scrollList.appendChild(newsItem);
        });

    } catch (error) {
        console.error('Error fetching the RSS feed:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchRSS);
