import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import './index.css';
import { Link, useNavigate, useParams } from "react-router-dom";
import del from '../../delete.jpeg';




export default function Action() {
    const { productID } = useParams();
    const [productDatas, setProductDatas] = useState([]);
    const navigate = useNavigate();
    const handleAdd = () => {
        const product = { id: '', rate: '', discount: '', price: '', };
        setProductDatas([...productDatas, product]);
    }
    const handleShow = async () => {
        try {
            const response = await axios.post('http://localhost:3000/product/all', { productID });
            setProductDatas(response.data.productData);
        } catch (error) {
            console.log({ error: error.message })
        }
    }
    const handleRemove = async (index) => {
        let data = [...productDatas];
        data.splice(index, 1)
        setProductDatas(data)
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
    const validation = (productDatas) => {
        const data = [...productDatas];
        let valid = true;
        for (let i = 0; i < data.length; i++) {
            if (data[i].rate === "") {
                data[i].rateValid = "Rate has Required";
                valid = false;
            } else {
                data[i].rateValid = ""
                valid = true;
            }
            if (data[i].discount === "") {
                data[i].discountValid = "Discount has Required";
                valid = false;
            } else {
                data[i].discountValid = ""
                valid = true;
            }
            if (data[i].price === "") {
                data[i].priceValid = "Price has Required";
                valid = false;
            } else {
                data[i].priceValid = ""
                valid = true;
            }
        }
        setProductDatas(data);
        return valid;
    }
    const handleEdit = async (e) => {
        const error = validation(productDatas);
        if (error) {
            productDatas.forEach(async (item) => {
                const id = item.id || 0;
                const productId = item.productID ?? productID;
                const rate = item.rate;
                const discount = item.discount;
                const price = item.price;
                try {
                    const response = await axios.post('http://localhost:3000/product/update', [{ id, productId, rate, discount, price }]);
                    if (response) {
                        navigate('/session');
                    }
                    else {
                        console.log(error);
                    }
                } catch (error) {
                    console.log({ error: error.message })
                }
            })
        } else {
            console.log(error);
        }
    }
    const handleDelete = async (productID, id) => {
        try {
            const response = await axios.post('http://localhost:3000/product/delete', { productID, id });
            window.location.reload();
        } catch (error) {
            console.log({ error: error.message })
        }
    }
    useEffect(() => {
        handleShow();
    }, [])
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
                <Link to='/session' class="flex justify-center items-center text-[20px] absolute bg-[#168cb9] top-[100px] left-[1900px] w-[100px] h-[50px] rounded-[10px] hover:bg-[#fff]">Back </Link>
                <h1 class="text-[40px] text-[#fff] pt-[100px] pl-[1050px]">Product Information </h1>
                {productDatas.map((item, index) => (
                    <form key={index} class="block justify-between items-center pt-[20px] px-[480px]">
                        <div class="flex  justify-center  items-center border-[2px] border-solid border-[#C5f601] rounded-[30px]  min-w-[1300px] min-h-[250px]">
                            <div>
                                <label class="text-[#C5f602] text-[26px] relative -top-[40px]">Rate</label>
                                <input type="text" name="rate" placeholder="Product Rate" value={item.rate} class="relative top-[4px] -left-[150px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-solid border-[1px] border-[#e65151] bg-[#000] text-center text-[#fff]" onChange={e => handleInputChange(e, index, 'rate')}></input>
                                <span class="text-[#E80A0A] relative top-[50px] -left-[350px]">{item.rateValid}</span>
                            </div>
                            <div>
                                <label class="text-[#C5f602] text-[26px] relative  -top-[14px] left-[110px]">Discount</label>
                                <input type="text" name="discount" placeholder="Product Discount" value={item.discount} class="relative top-[29px] -left-[62px] text-center w-[200px] h-[50px] rounded-[25px] rounded-r-[0px] text-[18px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[30px] text-[#fff] z-[0]" onChange={e => handleInputChange(e, index, 'discount')} ></input>
                                <div class="relative -top-[21px] -right-[245px] text-[20px] rounded-r-[30px] text-center pt-[10px] border-l-[0px] w-[50px] h-[50px] border-solid border-[1px] border-[#e65151] bg-[#000] text-[#ffffff69] z-[1]">%</div>
                                <span class="text-[#E80A0A] relative left-[80px]">{item.discountValid}</span>
                            </div>
                            <div>
                                <label class="text-[#C5f602] text-[26px] relative -top-[40px] -right-[250px]">Price</label>
                                <input type="text" name="price" value={item.rate} class="text-[18px] relative top-[4px] -right-[100px] w-[125px] h-[50px] rounded-[25px] rounded-r-[0px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[50px] line-through decoration-black text-[#C5f602]"></input>
                                <input type="text" name="price" value={item.price} class="relative top-[4px] -right-[90px] text-[18px] w-[125px] h-[50px] rounded-[25px] rounded-l-[0px] border-solid border-[1px] border-[#e65151] border-l-[0px] bg-[#000] pl-[0px] text-[#fff]" onChange={e => handleInputChange(e, index, 'price')}></input>
                                <span class="text-[#E80A0A] relative top-[50px] -left-[105px]">{item.rateValid}</span>
                            </div>
                            <button type="button" onClick={() => { handleDelete(item.productID, item.id) }} class="flex bg-[#C5f601] w-[100px] h-[40px] pt-[10px] relative top-[50px] left-[100px] rounded-[30px] text-[15px] hover:bg-[#fff]"><img class="w-[40px] pl-[15px]" src={del} alt="delete" /> Delete </button>
                            {index === 0 ? '' : <button type="button" class="bg-[#3F66D9] w-[80px] h-[35px] relative -right-[210px] top-[68px] rounded-[30px] border-solid border-[1px] items-center border-[#fff] hover:bg-[#fff]" onClick={() => handleRemove(index)}>Remove</button>}
                        </div>
                    </form>
                ))}
                <button type="button" onClick={() => (handleEdit())} class="bg-[#C5f601] w-[200px] h-[50px] relative top-[50px] left-[1200px] text-center pt-[10px] rounded-[30px] text-[20px] hover:bg-[#fff]">Submit</button>
                <button type="button" class="bg-[#E80A0A] w-[80px] h-[35px] relative -right-[1800px] -bottom-[30px] rounded-[30px] border-solid border-[1px] items-center border-[#fff] hover:bg-[#fff]" onClick={handleAdd}>ADD</button>
            </section>
        </div>
    )
}