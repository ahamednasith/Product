const express = require('express');
const cors = require('cors');
const routes = require('./routers/product.router');
const path = require('path')
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);
app.use('/public/images', express.static(path.join(__dirname, 'public/images')));

app.listen(port, () => {
    console.log(`Server Has Running On ${port}`);
});