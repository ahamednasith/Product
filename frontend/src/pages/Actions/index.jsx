import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import './index.css';
import { Link, useParams } from "react-router-dom";
import del from '../../delete.jpeg';




export default function Action() {
    const {productID} = useParams();
    console.log(productID);
    const [productDatas,setProductDatas] = useState([]);
    console.log(productDatas)
    const handleAdd =  () => {
        const product = {id:'',rate: '', discount: '', price: '', };
        setProductDatas([...productDatas, product]);
    }
    const handleShow = async () => {
        console.log(productID);
        try {
            const response = await axios.post('http://localhost:3000/product/all',{productID});
            setProductDatas(response.data.productData);
        } catch (error) {
            console.log({error:error.message})
        }
    }
    const handleInputChange = (e, index, fieldName) => {
        const updatedProductDatas = [...productDatas]; 
        updatedProductDatas[index][fieldName] = e.target.value;
        const rate = parseFloat(updatedProductDatas[index]['rate']);
        const discount = parseFloat(updatedProductDatas[index]['discount']);
        if (!isNaN(rate) && !isNaN(discount)) {
            const price = rate - (rate * (discount / 100));
            updatedProductDatas[index]['price'] = price;
        } 
        setProductDatas(updatedProductDatas); 
    }
    const handleEdit = (async) => {
        productDatas.forEach(async (item) => {
            const id = item.id||0;
            console.log(id);
            const productId = item.productID??productID;
            const rate = item.rate;
            const discount = item.discount;
            const price = item.price;                
            console.log(id,productId,rate,discount,price);
            try{
                const response = await axios.post('http://localhost:3000/product/update',[{id,productId,rate,discount,price}]);
                console.log(response.data)
                window.location.reload()
            } catch (error) {
                console.log({error:error.message})
            }
        })
    }
    const handleDelete = async (productID,id) => {
        try{
            const response = await axios.post('http://localhost:3000/product/delete',{productID,id});
            window.location.reload()
        } catch (error) {
            console.log({error:error.message})
        }
    }
    useEffect(()=>{
        handleShow();
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
            <section id="info" class="block justify-center items-center h-[1400px]">
            <h1 class="text-[40px] text-[#fff] pt-[100px] pl-[1050px]">Product Information </h1>
                {productDatas.map((item, index) => (
                        <form key={index}  class="block justify-between items-center pt-[20px] px-[480px]">
                        <div class="flex  justify-center  items-center border-[2px] border-solid border-[#C5f601] rounded-[30px]  min-w-[1300px] min-h-[200px]">
                            <label class="text-[#C5f602] text-[26px] relative -top-[40px]">Rate</label>
                            <input type="text" name="rate" placeholder="Product Rate" value={item.rate} class="relative top-[4px] -left-[150px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[70px] text-[#fff]" onChange={e => handleInputChange(e,index,'rate')}></input>
                            <label class="text-[#C5f602] text-[26px] relative  -top-[40px] left-[150px]">Discount</label>
                            <input type="text" name="discount" placeholder="Product Discount" value={item.discount} class="relative top-[4px] -left-[30px] w-[200px] h-[50px] rounded-[25px] rounded-r-[0px] text-[18px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[30px] text-[#fff] z-[0]" onChange={e => handleInputChange(e,index,'discount')} ></input>
                            <div class="relative top-[4px] right-[43px] text-[20px] rounded-r-[30px] text-center pt-[10px] border-l-[0px] w-[50px] h-[50px] border-solid border-[1px] border-[#e65151] bg-[#000] text-[#ffffff69] z-[1]">%</div>
                            <label class="text-[#C5f602] text-[26px] relative -top-[40px] -right-[250px]">Price</label>
                            <input type="text" name="price" value={item.rate } class="text-[18px] relative top-[4px] -right-[100px] w-[125px] h-[50px] rounded-[25px] rounded-r-[0px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[50px] line-through decoration-black text-[#C5f602]"></input>
                            <input type="text" name="price" value={item.price} class="relative top-[4px] -right-[90px] text-[18px] w-[125px] h-[50px] rounded-[25px] rounded-l-[0px] border-solid border-[1px] border-[#e65151] border-l-[0px] bg-[#000] pl-[0px] text-[#fff]" onChange={e => handleInputChange(e,index,'price')}></input>
                            <Link to='/session' type="button" onClick={() =>{handleDelete(item.productID,item.id)}} class="flex bg-[#C5f601] w-[100px] h-[40px] pt-[10px] relative top-[50px] left-[120px] rounded-[30px] text-[15px] hover:bg-[#fff]"><img class="w-[40px] pl-[15px]" src={del} alt="delete"/> Delete </Link>
                        </div>
                    </form>
                ))}
                <Link to='/session' type="button" onClick={() => (handleEdit())} class="bg-[#C5f601] w-[200px] h-[50px] relative top-[50px] left-[1200px] text-center pt-[10px] rounded-[30px] text-[20px] hover:bg-[#fff]">Submit</Link>
                <button type="button" class="bg-[#E80A0A] w-[80px] h-[35px] relative -right-[1800px] -bottom-[30px] rounded-[30px] border-solid border-[1px] items-center border-[#fff] hover:bg-[#fff]" onClick={handleAdd}>ADD</button>
        </section>
        </div>
    )
}