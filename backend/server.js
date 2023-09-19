const express = require('express');
const cors = require('cors');
const routes = require('./routers/product.router');
const app = express();
const port= 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/',routes);

app.listen(port,() => {
    console.log(`Server Has Running On ${port}`);
});