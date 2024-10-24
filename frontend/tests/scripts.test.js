import { fetchPosts } from '../scripts';

describe('fetchPosts function', () => {
    // This will set up the DOM structure needed for the test
    beforeEach(() => {
        document.body.innerHTML = `
            <main id="post-list">
                <!-- Posts will be dynamically added here -->
            </main>
        `;
        
        // Mock the fetch API
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([{ title: 'Test Post', content: 'This is a test.', author: 'Author Name' }]),
            })
        );
    });

    test('fetchPosts populates post list', async () => {
        // Call the fetchPosts function
        await fetchPosts();

        // Check if the post was displayed in the post-list element
        const postList = document.getElementById('post-list');
        expect(postList.innerHTML).toContain('Test Post');
    });
});

