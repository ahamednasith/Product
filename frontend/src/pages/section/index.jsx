import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import modify from '../../modify.png';
import add from '../../add.webp';
import del from '../../delete.jpeg';
import axios from "axios";
import './index.css';
import { Link } from "react-router-dom";

export default function Session() {
    const [productData, setProductData] = useState([]);


    const handleSection = async () => {
        try {
            const response = await axios.get('http://localhost:3000/product', { productData });
            setProductData(response.data.productData)
        } catch (error) {
            console.log({ error: error.message })
        }
    }

    const handleDelete = async (productID) => {
        try {
            const response = await axios.post('http://localhost:3000/product/delete', [{ productID }]);
            window.location.reload();
            console.log(response.data);
        } catch (error) {
            console.log({ error: error.message })
        }
    }


    useEffect(() => {
        handleSection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <section class="flex justify-center items-center w-[100%] h-[900px]">
                <div class="absolute top-[100px] left-[900px] text-[#fff]">
                    <h1 class=" relative left-[180px] text-[40px]">Product List</h1>
                    <Link to='/form' class="flex justify-center items-center relative -left-[400px] -top-[10px] w-[150px] h-[50px] border-[1px] border-double border-[#C5f601] rounded-[30px] text-[25px] hover:bg-[#fff] hover:text-[#000]">ADD<img class="w-[30px]" src={add} alt="add"></img></Link>
                    <table class="relative -left-[390px] shadow-[#fff] min-w-[1300px]">
                        <tr>
                            <th class="bg-[#C5f601] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">ProductID</th>
                            <th class="bg-[#C5f601] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">Count</th>
                            <th class="bg-[#C5f601] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">Edit</th>
                            <th class="bg-[#C5f601] border border-[1px] border-[#000] text-center text-[20px] text-[#000]">Delete</th>
                        </tr>
                        {productData.map((item, index) => (
                            <tr key={index}>
                                <td class="border border-[#C5f601] boredr-[1px] text-center">{item.productID}</td>
                                <td class="border border-[#C5f601] boredr-[1px] text-center">{item.count}</td>
                                <td class="border border-[#C5f601] border-[1px] pl-[8px] text-center w-[80px]"><Link to={`/action/${item.productID}`}><img class="w-[50px] pl-[15px]" src={modify} alt="modify" /></Link></td>
                                <td class="border border-[#C5f601] pl-[13px] border-[1px] text-center w-[80px]" onClick={() => handleDelete(item.productID)}><img class="w-[40px] pl-[15px]" src={del} alt="delete" /></td>
                            </tr>
                        ))}
                    </table>
                </div>
            </section>
        </div>
    )
}