import React, { useEffect, useState } from "react";
import modify from '../../modify.png';
import add from '../../add.webp';
import del from '../../delete.jpeg';
import { AiFillEye } from 'react-icons/ai';
import axios from "axios";
import { Link } from "react-router-dom";
import Form from "../Form";
import Action from "../Actions";
import View from "../View";

export default function Product() {
    const userID = localStorage.getItem('userID')
    const [productData, setProductData] = useState([]);
    const [productID, setProductID] = useState(null);
    const [isProduct, setIsProduct] = useState(true);
    const [isInfo, setIsInfo] = useState(false);
    const [isForm, setIsForm] = useState(false);
    const [isView, setIsView] = useState(false);
    const [isAction, setIsAction] = useState(false);


    const handleSection = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/product/${userID}`, { productData });
            setProductData(response.data.productData);
        } catch (error) {
            console.log({ error: error.message })
        }
    }


    const handleProductID = (productID) => {
        setProductID(productID)
    }

    const handleDelete = async (productID) => {
        try {
            const response = await axios.post('http://localhost:3000/product/delete', [{ productID }]);
            if (response) {
                setProductData(productData => productData.filter(item => item.productID !== productID));
            }
        } catch (error) {
            console.log({ error: error.message })
        }
    }
    useEffect(() => {
        handleSection();
    }, [])

    return (
        <div>
            {isProduct && (
                <section class="relative">
                    <div class="absolute top-[100px] left-[900px] text-[#fff]" id="product">
                        <h1 class=" absolute top-[100px] left-[480px] text-[40px] w-[400px]">Product List</h1>
                        <div>
                            <Link class="flex justify-center items-center absolute -left-[100px] top-[140px] w-[150px] h-[50px] border-[1px] border-double border-[#D2D5B2] rounded-[30px] text-[25px] hover:bg-[#fff] hover:text-[#000]" onClick={() => { setIsForm(true); setIsProduct(false); setIsInfo(true); }}>ADD<img class="w-[30px]" src={add} alt="add"></img></Link>
                        </div>
                        <table class="absolute -left-[100px] top-[200px] shadow-[#fff] min-w-[1300px]">
                            <tr>
                                <th class="bg-[#D2D5B2] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">Product Name</th>
                                <th class="bg-[#D2D5B2] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">Category</th>
                                <th class="bg-[#D2D5B2] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">Edit</th>
                                <th class="bg-[#D2D5B2] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">view</th>
                                <th class="bg-[#D2D5B2] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">Delete</th>
                            </tr>
                            {productData.map((item, index) => (
                                <tr key={index}>
                                    <td class="border border-[#D2D5B2] boredr-[1px] text-center">{item.productName}</td>
                                    <td class="border border-[#D2D5B2] boredr-[1px] text-center">{item.category}</td>
                                    <td class="border border-[#D2D5B2] border-[1px] pl-[8px] text-center w-[80px]"><Link to='/products' onClick={() => { handleProductID(item.productID); setIsAction(true); setIsProduct(false); setIsInfo(true); }}><img class="w-[50px] pl-[15px]" src={modify} alt="modify" /></Link></td>
                                    <td class="border border-[#D2D5B2] pl-[13px] border-[1px] text-center w-[80px]" onClick={() => { handleProductID(item.productID); setIsView(true); setIsProduct(false); }}><AiFillEye className="text-[40px] pl-[10px]" /></td>
                                    <td class="border border-[#D2D5B2] pl-[13px] border-[1px] text-center w-[80px]" onClick={() => handleDelete(item.productID)}><img class="w-[40px] pl-[15px]" src={del} alt="delete" /></td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </section>
            )}
            {isForm && <Form setIsProduct={setIsProduct} setIsForm={setIsForm} isInfo={isInfo} setIsInfo={setIsInfo} />}
            {isAction && <Action productID={productID} setIsAction={setIsAction} setIsProduct={setIsProduct} isInfo={isInfo} setIsInfo={setIsInfo} />}
            {isView && <View productID={productID} setIsView={setIsView} setIsProduct={setIsProduct} setIsAction={setIsAction} setIsInfo={setIsInfo} />}
        </div>
    )
}