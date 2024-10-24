const postListElement = document.getElementById('post-list');

export const fetchPosts = async () => {
    try {
        const response = await fetch('http://localhost:5001/api/posts'); // Adjust the URL if needed
        if (!response.ok) throw new Error('Network response was not ok');
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        postListElement.innerHTML = `<p>Error loading posts. Please try again later.</p>`;
    }
};

function displayPosts(posts) {
    postListElement.innerHTML = ''; // Clear the placeholder
    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <p><small>By ${post.author}</small></p>
        `;
        postListElement.appendChild(postElement);
    });
}

// Fetch posts when the page loads
document.addEventListener('DOMContentLoaded', fetchPosts);
