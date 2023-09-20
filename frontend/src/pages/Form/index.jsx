import React, { useState } from "react";
import { Helmet } from "react-helmet";
import './index.css';
import axios from "axios";
import { Link } from "react-router-dom";

export default function Form() {
    const [products, setProducts] = useState([{ rate: '', discount: '', price: '' }]);
    const handleInput = (index, e) => {
        const updatedProducts = [...products];
        updatedProducts[index][e.target.name] = e.target.value;
        const rate = parseFloat(updatedProducts[index]['rate']);
        const discount = parseFloat(updatedProducts[index]['discount']);
        if (!isNaN(rate) && !isNaN(discount)) {
            const price = rate - (rate * (discount / 100));
            updatedProducts[index]['price'] = price.toFixed(2);
        }
        setProducts(updatedProducts);
    };
    const handleAdd =  () => {
        const product = {rate: '', discount: '', price: ''};
        setProducts([...products, product]);
    }
    const handleRemove = async (index) => {
        let data = [...products];
        data.splice(index, 1)
        setProducts(data)
    }
    const handleSubmit = async () => {
        try {
            console.log(products);
            const response = await axios.post('http://localhost:3000/product',products);
            console.log(response.data)
            window.location.reload();        
        } catch (error) {
            console.log({ error: error.message })
        }
    }
    console.log(products);
    return (
        <div>
            <Helmet>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Shops Near Me</title>
                <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
            </Helmet>
        <section id="info" class="block justify-center items-center h-[1400px]">
            <h1 class="text-[40px] text-[#fff] pt-[100px] pl-[1050px]">Product Information </h1>
            <form class="block justify-between items-center pt-[20px] px-[480px]">
                {products.map((item, index) => (
                    <div>
                        <div key={index} class="flex  justify-center  items-center border-[2px] border-solid border-[#C5f601] rounded-[30px]  min-w-[1300px] min-h-[200px]">
                            <label class="text-[#C5f602] text-[26px] relative -top-[40px]">Rate</label>
                            <input type="text" name="rate" placeholder="Product Rate" class="relative top-[4px] -left-[150px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[70px] text-[#fff]" onChange={e => handleInput(index,e)}></input>
                            <label class="text-[#C5f602] text-[26px] relative  -top-[40px] left-[150px]">Discount</label>
                            <input type="text" name="discount" placeholder="Product Discount" value={item.discount} class="relative top-[4px] -left-[30px] w-[200px] h-[50px] rounded-[25px] rounded-r-[0px] text-[18px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[30px] text-[#fff] z-[0]" onChange={e => handleInput(index, e)} ></input>
                            <div class="relative top-[4px] right-[43px] text-[20px] rounded-r-[30px] text-center pt-[10px] border-l-[0px] w-[50px] h-[50px] border-solid border-[1px] border-[#e65151] bg-[#000] text-[#ffffff69] z-[1]">%</div>
                            <label class="text-[#C5f602] text-[26px] relative -top-[40px] -right-[250px]">Price</label>
                            <input type="text" name="price" value={item.rate } class="text-[18px] relative top-[4px] -right-[100px] w-[125px] h-[50px] rounded-[25px] rounded-r-[0px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[50px] line-through decoration-black text-[#C5f602]"></input>
                            <input type="text" name="price" value={item.price} class="relative top-[4px] -right-[90px] text-[18px] w-[125px] h-[50px] rounded-[25px] rounded-l-[0px] border-solid border-[1px] border-[#e65151] border-l-[0px] bg-[#000] pl-[0px] text-[#fff]" onChange={e => handleInput(index, e)}></input>
                        </div>
                    </div>
                ))}
                <button type="button" class="bg-[#E80A0A] w-[80px] h-[35px] relative -right-[1300px] bottom-[60px] rounded-[30px] border-solid border-[1px] items-center border-[#fff] hover:bg-[#fff]" onClick={handleAdd}>ADD</button>
                <button type="button" class="bg-[#3F66D9] w-[80px] h-[35px] relative -right-[1330px] bottom-[60px] rounded-[30px] border-solid border-[1px] items-center border-[#fff] hover:bg-[#fff]" onClick={handleRemove}>Remove</button>
                <Link to='/session' type="button" onClick={handleSubmit} class="bg-[#C5f601] w-[200px] h-[50px] relative top-[50px] left-[600px] text-center pt-[10px] rounded-[30px] text-[20px] hover:bg-[#fff]">Submit</Link>
            </form>
        </section>
        <script src="https://cdn.tailwindcss.com"></script>
    </div>
    )
}