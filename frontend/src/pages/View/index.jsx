import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function View({ productID, setIsView, setIsProduct,setIsAction,setIsInfo }) {
    const [productDatas, setProductDatas] = useState([]);
    const [productImages, setProductImage] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([])
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [tag, setTag] = useState('');


    const handleShow = async () => {
        try {
            const response = await axios.post('http://localhost:3000/product/all', { productID });
            setProductDatas(response.data.productData);
            setProductImage(response.data.productImages);
            setProductName(response.data.productData[0].productName);
            setDescription(response.data.productData[0].description);
            setCategory(response.data.productData[0].category);
            setTag(response.data.productData[0].productTag)
        } catch (error) {
            console.log({ error: error.message })
        }
    }

    useEffect(() => {
        handleShow();
    }, [])

    useEffect(() => {
        if (productImages.length > 0) {
            const productImage = productImages.map((div) => div.image);
            setImagePreviews(productImage);
        }
    }, [productImages]);
    return (
        <div>
            <section class="block justify-center items-center h-[1400px] w-[1800px]">
                <Link to="/products" class="flex justify-center items-center text-[20px] absolute bg-[#168cb9] top-[200px] right-[240px] w-[100px] h-[50px] rounded-[10px] hover:bg-[#fff] hover:border-[3px] hover:border-[#168cb9]" onClick={() => { setIsView(false); setIsProduct(true) }}>Back </Link>
                <div class="flex justify-center items-center relative left-[500px] top-[200px] bg-red-500 w-[100px] h-[50px] rounded-[10px] text-[25px] hover:bg-[#fff] hover:text-[#000]" onClick={() => {setIsAction(true);setIsProduct(false);setIsView(false);setIsInfo(true)}}>Edit</div>
                <h1 class="text-[40px] text-[#fff] pt-[160px] pl-[1210px]">Product Information </h1>
                <div class="block justify-between items-center pt-[20px] pl-[600px] pr-[230px]">
                    <h1 className="text-[30px] relative -left-[50px] top-[50px] text-[#D2D5B2]">1.PRODUCT INFO:-</h1>
                    <div className="relative">
                        <h1 className="text-[30px] relative left-[40px] text-[#168cb9] top-[80px]">Product Name:</h1>
                        <h2 className="text-[30px] relative left-[350px] text-[#fff] top-[37px]">{productName}</h2>
                    </div>
                    <div className="realtive">
                        <h1 className="text-[30px] relative left-[40px] text-[#168cb9] top-[50px]">Description:</h1>
                        <h2 className="text-[30px] relative left-[350px] text-[#fff] top-[7px]">{description}</h2>
                    </div>
                    <div className="relative">
                        <h1 className="text-[30px] relative left-[40px] text-[#168cb9] top-[20px]">Category:</h1>
                        <h2 className="text-[30px] relative left-[350px] text-[#fff] -top-[24px]">{category}</h2>
                    </div>
                    <div className="relative">
                        <h1 className="text-[30px] relative left-[40px] text-[#168cb9] -top-[0px]">Product Tag:</h1>
                        <div className="flex flex-wrap relative left-[350px] -top-[60px]">
                            {tag.split(',').filter(task => task.trim() !== '').map((task, index) => (
                                <div key={index} className="flex flex-wrap min-w-[200px] min-h-[45px] mx-[10px] pl-[50px] text-[24px] text-center my-[10px] space-x-[30px] border-[2px] border-[#404A5E] rounded-[5px] ">
                                    <div contentEditable={true} className="text-[#fff] pt-[5px] pl-[10px]">
                                        {task}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <h1 className="text-[30px] relative -left-[50px] top-[0px] text-[#D2D5B2]">2.PRODUCT IMAGES:-</h1>
                    <div className="relative flex flex-wrap top-[50px] left-[10px]">
                        {imagePreviews.map((preview, imgIndex) => (
                            <div key={imgIndex} className={`w-[200px] h-[200px] relative mx-[20px] mb-[20px]`}>
                                <img src={preview} alt={`Preview ${imgIndex}`} className="rounded-[20px] border-[1px] border-[#D2D5B2]" />
                            </div>
                        ))}
                    </div>
                    <h1 className="text-[30px] relative -left-[50px] top-[100px] text-[#D2D5B2]">3.PRODUCT DETAILS:-</h1>
                    {productDatas.map((item, index) => (
                        <div key={index}>
                            <div class="flex  justify-center relative top-[150px] items-center bg-[#404A5E] min-w-[1660px] min-h-[600px] mt-[30px]">
                                <div>
                                    <label class="text-[#D2D5B2] text-[26px] absolute top-[40px] left-[200px]">Image</label>
                                    {item.image && (
                                        <div className="absolute top-[90px] left-[140px] w-[200px] h-[200px] ">
                                            <img src={item.image} alt="preview" className="w-[200px] h-[200px] rounded-[25px]" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label class="text-[#D2D5B2] text-[26px] absolute top-[120px] left-[650px]">Rate</label>
                                    <div class="absolute top-[170px] left-[560px] text-[25px] w-[250px] h-[50px] rounded-[5px] border-[1px] border-[#D2D5B5] bg-[#273041] text-center text-[#fff] pt-[8px]">{item.rate}</div>
                                </div>
                                <div>
                                    <label class="text-[#D2D5B2] text-[26px] absolute  top-[120px] right-[550px]">Discount</label>
                                    <div class="absolute top-[170px] right-[530px] w-[200px] h-[50px] rounded-[5px] rounded-r-[0px] text-[18px] border-[1px] border-r-[0px] border-[#D2D5B2] bg-[#273041] text-[25px] text-center pl-[30px] pt-[8px] text-[#fff] z-[0]">{item.discount}</div>
                                    <div class="absolute top-[170px] right-[480px] text-[20px] rounded-r-[5px] text-center pt-[10px] border-l-[0px] w-[50px] h-[50px] border-[1px] border-[#D2D5B5] bg-[#273041] text-[#ffffff69] z-[1] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]">%</div>
                                </div>
                                <div>
                                    <label class="text-[#D2D5B2] text-[26px] absolute top-[120px] right-[200px]">Price</label>
                                    <div class="text-[20px] absolute top-[170px] right-[230px] w-[125px] h-[50px] rounded-[5px] rounded-r-[0px] border-[1px] border-r-[0px] border-[#D2D5B5] bg-[#273041] pl-[20px] line-through decoration-[#DA4B4B] decoration-[4px] text-[#D2D5B5] text-[25px] pt-[8px]">{item.rate}</div>
                                    <div class="absolute top-[170px] right-[105px] text-[20px] w-[125px] h-[50px] rounded-[5px] rounded-l-[0px] border-[1px] border-[#d2d5b5] border-l-[0px] bg-[#273041] pl-[0px] text-[#fff] text-[25px] pt-[8px]">{item.price}</div>
                                </div>
                                <div className="pt-[351px]">
                                    {item.productSizes.map((pair, sizeIndex) => (
                                        <div>
                                            <div key={sizeIndex} class="flex bg-[#273041] justify-center relative items-center top-[50px] min-w-[1660px] min-h-[300px] left-[0px] -mt-[30px]">
                                                <div>
                                                    <label class="text-[#D2D5B5] text-[26px] absolute top-[50px] left-[230px]">Size</label>
                                                    <div class="absolute top-[100px] left-[140px] text-[18px] w-[250px] h-[50px] rounded-[5px] border-[1px] border-[#D2D5B5] bg-[#404A5E] text-center text-[#fff] text-[25px] pt-[8px]">{pair.size}</div>
                                                </div>
                                                <div>
                                                    <label class="text-[#D2D5B5] text-[26px] absolute top-[50px] right-[570px]">Price</label>
                                                    <div class="absolute top-[100px] right-[470px] text-[18px] w-[250px] h-[50px] rounded-[5px] border-[1px] border-[#D2D5B5] bg-[#404A5E] text-center text-[#fff] text-[25px] pt-[8px]">{pair.price}</div>
                                                </div>
                                                <div>
                                                    <label class="text-[#D2D5B5] text-[26px] absolute top-[50px] left-[609px]">Quantity</label>
                                                    <div class="absolute top-[100px] left-[553px] text-[18px] w-[250px] h-[50px] rounded-[5px] border-[1px] text-center border-[#D2D5B5] bg-[#404A5E] text-[#fff] text-[25px] pt-[8px]">{pair.quantity}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}