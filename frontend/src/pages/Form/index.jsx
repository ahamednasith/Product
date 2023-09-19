import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import './index.css';
import modify from '../../modify.png';
import add from '../../add.webp';
import del from '../../delete.jpeg';
import axios from "axios";

export default function Form() {
    const [products, setProducts] = useState([{ rate: '', discount: '', price: '' }]);
    const [productData,setProductData] = useState([]);
    const [productDatas,setProductDatas] = useState([])
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
    const handleInputChange = (e, index, fieldName) => {
        const updatedProductDatas = [...productDatas]; 
        updatedProductDatas[index][fieldName] = e.target.value;
        const rate = parseFloat(updatedProductDatas[index]['rate']);
        const discount = parseFloat(updatedProductDatas[index]['discount']);
        if (!isNaN(rate) && !isNaN(discount)) {
            const price = rate - (rate * (discount / 100));
            updatedProductDatas[index]['price'] = price.toFixed(2);
        } 
        setProductDatas(updatedProductDatas); 
    }
    const handleAdd = async () => {
        const product = {rate: '', discount: '', price: '', };
        setProducts([...products, product]);
    }
    const handleRemove = async (index) => {
        let data = [...products];
        data.splice(index, 1)
        setProducts(data)
    }
    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/product',products);
        } catch (error) {
            console.log({ error: error.message })
        }
    }
    const handleSection = async () => {
        try {
            const response = await axios.get('http://localhost:3000/product',{productData});
            setProductData(response.data.productData)
        } catch (error) {
            console.log({ error: error.message })
        }
    }
    const handleShow = async (productID) => {
        try {
            const response = await axios.post('http://localhost:3000/product/all',{productID});
            setProductDatas(response.data.productData);
        } catch (error) {
            console.log({error:error.message})
        }
    }
    const handleEdit = async (productID,id,rate,discount,price) => {
        try {
            const response = await axios.post('http://localhost:3000/product/update',{productID,id,rate,discount,price});
            window.location.reload();
        } catch (error) {
            console.log({error:error.message})
        }
    }
    const handleDelete = async (productID,id) => {
        try{
            const response = await axios.post('http://localhost:3000/product/delete',{productID,id});
            window.location.reload();
        } catch (error) {
            console.log({error:error.message})
        }
    }
    useEffect(() => {
        handleSection()
    },[])
    return (
        <div>
            <Helmet>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Shops Near Me</title>
                <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
            </Helmet>
            <section class="flex justify-center items-center w-[100%] h-[900px]">
            <div class="absolute top-[100px] left-[900px] text-[#fff]">
                <h1 class=" relative left-[180px] text-[40px]">Product List</h1>
                <table class="relative -left-[390px] shadow-[#fff] min-w-[1300px]">
                    <tr>
                        <th class="bg-[#C5f601] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">ProductID</th>
                        <th class="bg-[#C5f601] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">Count</th>
                        <th class="bg-[#C5f601] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">Edit</th>
                        <th class="bg-[#C5f601] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">Add</th>
                        <th class="bg-[#C5f601] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">Delete</th>
                    </tr> 
                    {productData.map((item, index) => (
                        <tr key={index}>
                            <td class="border border-[#C5f601] boredr-[1px] text-center">{item.productID}</td> 
                            <td class="border border-[#C5f601] boredr-[1px] text-center">{item.count}</td>
                            <td class="border border-[#C5f601] border-[1px] pl-[8px] text-center w-[80px]"><a href="#edit" onClick={() => handleShow(item.productID)}><img class="w-[50px] pl-[15px]" src={modify} alt="modify"/></a></td>
                            <td class="border border-[#C5f601] pl-[13px] border-[1px] text-center w-[80px]"><a href="#info" onClick={() => handleAdd(item.productID)}><img class="w-[40px] pl-[15px]" src={add} alt="add"/></a></td>
                            <td class="border border-[#C5f601] pl-[13px] border-[1px] text-center w-[80px]"><a href="#edit" onClick={() => handleShow(item.productID)}><img class="w-[40px] pl-[15px]" src={del} alt="delete"/></a></td>
                        </tr>
                    ))}
                </table>
            </div>
        </section>
        <section id="info" class="block justify-center items-center h-[1400px]">
            <h1 class="text-[40px] text-[#fff] pt-[100px] pl-[1050px]">Product Information </h1>
            <form onSubmit={handleSubmit} class="block justify-between items-center pt-[20px] px-[480px]">
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
                <button type="submit" class="bg-[#C5f601] w-[200px] h-[50px] relative top-[50px] left-[600px] rounded-[30px] text-[20px] hover:bg-[#fff]">Submit</button>
            </form>
        </section>
        <section id="edit" class="h-[1000px]">
        <h1 class="text-[40px] text-[#fff] pt-[100px] pl-[1200px]">Edit</h1>
        {productDatas.map((item,index) => (
            <form key={index} class="block justify-between items-center pt-[20px] px-[150px]">
            <div  class="flex  justify-center px-[50px] items-center border-[2px] border-solid border-[#C5f601] rounded-[30px]  min-w-[2100px] min-h-[200px]">
                <label class="text-[#C5f602] text-[26px] relative -left-[10px] -top-[40px]">ID</label>
                <input type="text" name="ID" value={item.id} placeholder="Product Rate" class="relative top-[4px] -left-[150px] text-[18px] text-center w-[250px] h-[50px] rounded-[25px] border-solid border-[1px] border-[#e65151] bg-[#000] text-[#fff]"></input>
                <label class="text-[#C5f602] text-[26px] relative left-[100px] -top-[40px]">ProductID</label>
                <input type="text" name="productID" value={item.productID} placeholder="Product Rate" class="relative top-[4px] -left-[80px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[70px] text-[#fff]"></input>
                <label class="text-[#C5f602] text-[26px] relative left-[190px] -top-[40px]">Rate</label>
                <input type="text" name="rate" value={item.rate} placeholder="Product Rate" class="relative top-[4px] left-[40px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[70px] text-[#fff]" onChange={(e) => handleInputChange(e, index,'rate')}></input>
                <label class="text-[#C5f602] text-[26px] relative  -top-[40px] left-[270px]">Discount</label>
                <input type="text" name="discount" value={item.discount} placeholder="Product Discount" class="relative top-[4px] left-[100px] w-[200px] h-[50px] rounded-[25px] rounded-r-[0px] text-[18px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[30px] text-[#fff] z-[0]" onChange={(e) => handleInputChange(e, index,'discount')} ></input>
                <div class="relative top-[4px] left-[90px] text-[20px] rounded-r-[30px] text-center pt-[10px] border-l-[0px] w-[50px] h-[50px] border-solid border-[1px] border-[#e65151] bg-[#000] left-[800px] text-[#ffffff69] z-[1]">%</div>
                <label class="text-[#C5f602] text-[26px] relative -top-[40px] -right-[270px]">Price</label>
                <input type="text" name="price" value={item.rate} class="text-[18px] relative top-[4px] -right-[120px] w-[125px] h-[50px] rounded-[25px] rounded-r-[0px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[50px] line-through decoration-black text-[#C5f602]"></input>
                <input type="text" name="price" value={item.price} class="relative top-[4px] -right-[100px] text-[18px] w-[125px] h-[50px] rounded-[25px] rounded-l-[0px] border-solid border-[1px] border-[#e65151] border-l-[0px] bg-[#000] pl-[0px] text-[#fff]" onChange={(e) => handleInputChange(e, index,'price')}></input>
                <button type="button" onClick={() =>{handleEdit(item.productID,item.id,item.rate,item.discount,item.price)}} class="flex bg-[#C5f601] w-[100px] h-[40px] pt-[10px] relative top-[50px] left-[100px] rounded-[30px] text-[15px] hover:bg-[#fff]"><img class="w-[40px] pl-[15px]" src={modify} alt="modify"/> Modify </button>
                <button type="button" onClick={() =>{handleDelete(item.productID,item.id)}} class="flex bg-[#C5f601] w-[100px] h-[40px] pt-[10px] relative top-[50px] left-[120px] rounded-[30px] text-[15px] hover:bg-[#fff]"><img class="w-[40px] pl-[15px]" src={del} alt="delete"/> Delete </button>
            </div>
            </form>
            ))}
        </section>
        <script src="https://cdn.tailwindcss.com"></script>
    </div>
    )
}