document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const contentArea = document.getElementById('content-area');

    fetchTopic('endless');

    searchButton.addEventListener('click', () => {
        const topic = searchInput.value.trim();
        if (topic) {
            fetchTopic(topic);
            searchInput.value = ''; // Clear the input
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    async function fetchTopic(topic) {
        const url = `/api/get-topic?topic=${encodeURIComponent(topic)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch topic');
            }
            const data = await response.json();
            renderContent(topic, data.content);
        } catch (error) {
            console.error('Error fetching topic:', error);
            contentArea.innerHTML = '<p>Sorry, something went wrong. Rate Limit Exceeded.</p>';
        }
    }

    function renderContent(topic, content) {
        contentArea.innerHTML = ''; // Clear previous content

        const title = document.createElement('h2');
        title.textContent = topic;
        contentArea.appendChild(title);

        const paragraph = document.createElement('p');
        const processedContent = linkifyText(content);
        paragraph.innerHTML = processedContent; // Use innerHTML because we are adding anchor tags
        contentArea.appendChild(paragraph);
        
        addLinkListeners();

        const welcomeMessage = `
            <div class="welcome-container">
                <p>Welcome! Enter a word in the search bar to go on a journey.</p>
                <p>Each word is a link to a page of information.</p>
                <p>Click on a word to learn more about it.</p>
            </div>
        `;
        contentArea.insertAdjacentHTML('beforeend', welcomeMessage);
    }

    function linkifyText(text) {
        // This regex splits the text by spaces and punctuation, while keeping the delimiters.
        const wordsAndDelimiters = text.split(/([,."?!:;\s])/);
        
        return wordsAndDelimiters.map(part => {
            // If the part is a word (not a delimiter), wrap it in a link.
            if (part && !/([,."?!:;\s])/.test(part)) {
                return `<a href="#" class="topic-link">${part}</a>`;
            }
            // Otherwise, return the delimiter as is.
            return part;
        }).join('');
    }

    function addLinkListeners() {
        const topicLinks = document.querySelectorAll('.topic-link');
        topicLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const newTopic = e.target.textContent;
                fetchTopic(newTopic);
            });
        });
    }
});
