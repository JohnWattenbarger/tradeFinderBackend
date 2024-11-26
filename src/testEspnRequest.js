const axios = require('axios');

// Define the URL and cookies
const url = 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/FFL/seasons/2024/segments/0/leagues/1872031086?view=mTeam&view=mRoster&view=mSettings';

// Replace with your actual cookies
const cookies = 'espn_s2=AEB%2BwDQZJatNz7lcWV0bY2ojSXo6Cg1BvJBg8ABe%2FoRyII66ay9K42Ng0iXsfV%2FzHV%2BJEbQa%2FdxE4XbGAPZ%2BHA4kZxu9uwXNSGWEAphw2P8Lh5bvaQ8LpAN8o5axChLqTfUvvAYDj0DjlQ43769gLHLRKOXtOcya6uijflVdizrvaoX%2Fuz7MPpzIsdZwmCDGJ%2F5hgEsYuEq9I%2FQwHLll7wEeH%2BCgZDy9JIj5YV4zAL4jE9qeMBoQWr%2Fl86NjDrcdO%2BnU0NE%2B%2FShYqfN%2FxXJy9RCTpg%2FfHe%2FKboGWLV1Tm%2FOIbj7kTDAVtHc83IojTYn28nw%3D; SWID={368A6DCF-81F7-4242-B86E-1585A177F9F8}';

(async () => {
    try {
        const response = await axios.get(url, {
            headers: {
                'Cookie': cookies, // Add the cookies header
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', // Optional
                'Accept': 'application/json',
            },
        });

        console.log('Response Data:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.status, error.response.data);
        } else {
            console.error('Request Failed:', error.message);
        }
    }
})();
