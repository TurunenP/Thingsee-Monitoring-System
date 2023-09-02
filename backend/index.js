const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    try {
        // You should send a response here. For example:
        res.send('Hello, World!');
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching cat facts' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
