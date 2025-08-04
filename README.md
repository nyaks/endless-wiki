# Endless Wiki

An encyclopedia where every word is a link. Click any word to dive deeper into an endless chain of knowledge.

## How it Works

Endless Wiki is a simple web application that allows you to explore topics in a unique way. You start by searching for a word or topic. The application uses the Google Gemini AI to generate a concise definition. Every word in that definition is a clickable link. Clicking on any word will fetch its definition, creating an endless chain of discovery.

## Technology Stack

*   **Frontend:** HTML, CSS, JavaScript
*   **Backend:** Node.js, Express
*   **API:** Google Generative AI

## Getting Started

### Prerequisites

*   Node.js
*   An API key from Google AI Studio.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/endless-wiki.git
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root of the project and add your Google AI API key:
    ```
    API_KEY=your_api_key
    ```
4.  Start the server:
    ```bash
    npm start
    ```
5.  Open your browser and navigate to `http://localhost:3000`.

## How to Use

1.  Enter a word or topic in the search bar and click "Go".
2.  The definition will appear below.
3.  Click on any word in the definition to explore that topic.
