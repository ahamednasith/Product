import React, { useState } from "react";
import { Helmet } from "react-helmet";
import './index.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import remove from "../../images/remove.jpeg";

export default function Form() {
  const [products, setProducts] = useState([{ rate: '', discount: '', price: '', image: '', preview: '' }]);
  const navigate = useNavigate();


  const handleInput = (index, e) => {
    const updatedProducts = [...products];
    if (e.target.name === 'image') {
      updatedProducts[index]['image'] = e.target.files[0];
      updatedProducts[index]['preview'] = URL.createObjectURL(e.target.files[0]);
    } else {
      updatedProducts[index][e.target.name] = e.target.value;
      const rate = parseFloat(updatedProducts[index]['rate']);
      const discount = parseFloat(updatedProducts[index]['discount']);
      if (!isNaN(rate) && !isNaN(discount)) {
        const price = rate - (rate * (discount / 100));
        updatedProducts[index]['price'] = price.toFixed(2);
      }
    }
    setProducts(updatedProducts);
  };


  const handleAdd = () => {
    const product = { rate: '', discount: '', price: '', image: '' };
    setProducts([...products, product]);
  }

  const imageRemove = (index) => {
    const removeImage = [...products];
    removeImage[index].image = "";
    removeImage[index].preview = "";
    setProducts(removeImage);
  }


  const handleRemove = async (index) => {
    let data = [...products];
    data.splice(index, 1)
    setProducts(data)
  }


  const validation = (products) => {
    const data = [...products];
    let valid = true;
    for (let i = 0; i < data.length; i++) {
      if(products.length > 1 && data[i].image === ""){
        data[i].imageValid = "Image has Required";
        valid = false;
      }else {
        data[i].imageValid = ""
      }
      if (data[i].rate === "") {
        data[i].rateValid = "Rate has Required";
        valid = false;
      } else {
        data[i].rateValid = ""
      }
      if (data[i].discount === "") {
        data[i].discountValid = "Discount has Required";
        valid = false;
      } else {
        data[i].discountValid = ""
      }
      if (data[i].price === "") {
        data[i].priceValid = "Price has Required";
        valid = false;
      } else {
        data[i].priceValid = ""
      }
    }
    setProducts(data);
    return valid;
  }


  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const error = validation(products);
      if (error) {
        const formData = new FormData();

        products.forEach((item, index) => {
          formData.append(`products[${index}][rate]`, item.rate);
          formData.append(`products[${index}][discount]`, item.discount);
          formData.append(`products[${index}][price]`, item.price);
          formData.append('productImages', item.image)
        });
        const response = await axios.post('http://localhost:3000/product', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data) {
          navigate('/session');
        }
      } else {
        console.log(error)
      }
    } catch (error) {
      console.log({ error: error.message });
    }
  }



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
        <Link to='/session' class="flex justify-center items-center text-[20px] absolute bg-[#168cb9] top-[100px] left-[1900px] w-[100px] h-[50px] rounded-[10px] hover:bg-[#fff] hover:border-[#168cb9] hover:border-[3px]">Back </Link>
        <h1 class="text-[40px] text-[#fff] pt-[100px] pl-[1050px]">Product Information </h1>
        <form class="block justify-between items-center pt-[20px] px-[300px]">
          {products.map((item, index) => (
            <div>
              <div key={index} class="flex  justify-center  items-center border-[2px] border-solid border-[#C5f601] rounded-[30px]  min-w-[1900px] min-h-[250px]">
                <div class="block">
                  <label class="text-[#C5f602] text-[26px] relative -top-[60px] left-[40px]">Image</label>
                  <input type="file" name="image" class="relative -top-[10px] -left-[100px] text-[18px] w-[200px] h-[50px] pt-[8px] rounded-[25px] border-solid border-[1px] border-[#e65151] bg-[#000] text-[#fff]" onChange={e => handleInput(index, e)}></input>
                  {products.length > 1 && (<span class="text-[#E80A0A] relative top-[50px] -left-[270px]">{item.imageValid}</span>)}
                </div>
                {item.preview && (<div style={{ position: "relative" }}><img src={item.preview} alt="preview" className="w-[200px] border-[1px]" /><button type="button" className="w-[20px] absolute -top-[10px] -right-[10px]" onClick={() => imageRemove(index)}><img src={remove} alt="remove" /></button></div>)}
                <div class="block">
                  <label class="text-[#C5f602] text-[26px] relative -top-[60px] left-[145px]">Rate</label>
                  <input type="text" name="rate" placeholder="Product Rate" class="relative -top-[10px] left-[0px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[70px] text-[#fff]" onChange={e => handleInput(index, e)}></input>
                  <span class="text-[#E80A0A] relative top-[50px] -left-[200px]">{item.rateValid}</span>
                </div>
                <div class="block">
                  <label class="text-[#C5f602] text-[26px] relative  -top-[35px] left-[145px]">Discount</label>
                  <input type="text" name="discount" placeholder="Product Discount" value={item.discount} class="relative top-[27px] -left-[30px] w-[200px] h-[50px] rounded-[25px] rounded-r-[0px] text-[18px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[30px] text-[#fff] z-[0]" onChange={e => handleInput(index, e)} ></input>
                  <div class="relative -top-[23px] -right-[280px] text-[20px] rounded-r-[30px] text-center pt-[10px] border-l-[0px] w-[50px] h-[50px] border-solid border-[1px] border-[#e65151] bg-[#000] text-[#ffffff69] z-[1]">%</div>
                  <span class="text-[#E80A0A] relative left-[118px]">{item.discountValid}</span>
                </div>
                <div class="block">
                  <label class="text-[#C5f602] text-[26px] relative -top-[60px] -right-[280px]">Price</label>
                  <input type="text" name="price" value={item.rate} class="text-[18px] relative -top-[10px] -right-[140px] w-[125px] h-[50px] rounded-[25px] rounded-r-[0px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[50px] line-through decoration-black text-[#C5f602]"></input>
                  <input type="text" name="price" value={item.price} class="relative -top-[10px] -right-[118px] text-[18px] w-[125px] h-[50px] rounded-[25px] rounded-l-[0px] border-solid border-[1px] border-[#e65151] border-l-[0px] bg-[#000] pl-[0px] text-[#fff]" onChange={e => handleInput(index, e)}></input>
                  <span class="text-[#E80A0A] relative top-[50px] -left-[60px]">{item.priceValid}</span>
                </div>
                {products.length > 1 && (<button type="button" class="bg-[#3F66D9] w-[80px] h-[35px] relative -right-[120px] top-[68px] rounded-[30px] border-solid border-[1px] items-center border-[#fff] hover:bg-[#fff] hover:border-[#3F66D9] hover:border-[2px]" onClick={() => handleRemove(index)}>Remove</button>)}
              </div>
            </div>
          ))}
          <button type="button" class="bg-[#E80A0A] w-[80px] h-[35px] relative -right-[1500px] bottom-[60px] rounded-[30px] border-solid border-[1px] items-center border-[#fff] hover:bg-[#fff] hover:border-[#E80A0A] hover:border-[2px]" onClick={handleAdd}>ADD</button>
          <button type="button" onClick={handleSubmit} class="bg-[#C5f601] w-[200px] h-[50px] relative top-[40px] left-[800px] text-center pt-[5px] rounded-[30px] text-[20px] hover:bg-[#fff] hover:border-[#C5f602] hover:border-[3px]">Submit</button>
        </form>
      </section>
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  )
}