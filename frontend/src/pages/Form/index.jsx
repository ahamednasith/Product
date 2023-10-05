import React, { useState } from "react";
import { Helmet } from "react-helmet";
import './index.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import remove from "../../images/remove.jpeg";

export default function Form() {
  const [products, setProducts] = useState([{ rate: '', discount: '', price: '', image: '', preview: '', productSizes: [{ size: '', quantity: '', price: '' }] }]);
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


  const handleInputSize = (index, sizeIndex, e) => {
    const updatedProducts = [...products];
    updatedProducts[index].productSizes[sizeIndex][e.target.name] = e.target.value;
    const rate = parseFloat(updatedProducts[index]['rate']);
    const discount = parseFloat(updatedProducts[index]['discount']);
    const quantity = parseInt(updatedProducts[index].productSizes[sizeIndex]['quantity']);
    if (!isNaN(rate) && !isNaN(discount)) {
      const price = (rate - (rate * (discount / 100))) * quantity;
      updatedProducts[index].productSizes[sizeIndex]['price'] = price.toFixed(2);
    }
    setProducts(updatedProducts);
  };


  const sizeAdd = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].productSizes.push({ size: '', quantity: '', price: '' });
    setProducts(updatedProducts);
  };


  const sizeRemove = async (index, sizeIndex) => {
    let data = [...products];
    const updatedSize = [...data[index].productSizes];
    updatedSize.splice(sizeIndex, 1)
    data[index].productSizes = updatedSize
    setProducts(data)
  }


  const handleAdd = () => {
    const product = { rate: '', discount: '', price: '', image: '', productSizes: [{ size: '', quantity: '', price: '' }] };
    setProducts([...products, product]);
  };


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
    const data = products.map(product => ({ ...product }));
    let valid = true;
    for (let i = 0; i < data.length; i++) {
      if (products.length > 1 && data[i].image === "") {
        data[i].imageValid = "Image is Required";
        valid = false;
      } else {
        data[i].imageValid = "";
      }

      if (data[i].rate === "") {
        data[i].rateValid = "Rate is Required";
        valid = false;
      } else {
        data[i].rateValid = "";
      }

      if (data[i].discount === "") {
        data[i].discountValid = "Discount is Required";
        valid = false;
      } else {
        data[i].discountValid = "";
      }

      if (data[i].price === "") {
        data[i].priceValid = "Price is Required";
        valid = false;
      } else {
        data[i].priceValid = "";
      }

      if (data[i].productSizes) {
        const sizeData = data[i].productSizes;
        for (let j = 0; j < sizeData.length; j++) {
          if (sizeData[j].size === "") {
            sizeData[j].sizeValid = "Size is Required";
            valid = false;
          } else {
            sizeData[j].sizeValid = "";
          }

          if (sizeData[j].quantity === "") {
            sizeData[j].quantityValid = "Quantity is Required";
            valid = false;
          } else {
            sizeData[j].quantityValid = "";
          }

          if (sizeData[j].price === "") {
            sizeData[j].priceValid = "Price is Required";
            valid = false;
          } else {
            sizeData[j].priceValid = "";
          }
        }
      }
    }
    setProducts(data);
    return valid;
  };

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
          item.productSizes.forEach((sizeItem, sizeIndex) => {
            formData.append(`products[${index}][productSizes][${sizeIndex}][size]`, sizeItem.size);
            formData.append(`products[${index}][productSizes][${sizeIndex}][quantity]`, sizeItem.quantity);
            formData.append(`products[${index}][productSizes][${sizeIndex}][price]`, sizeItem.price);
          });
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
              <div key={index} class="flex  justify-center relative items-center border-[2px] border-solid border-[#C5f601] rounded-[30px]  min-w-[1900px] min-h-[600px]">
                <div class="block">
                  <label class="text-[#C5f602] text-[26px] absolute top-[75px] left-[200px]">Image</label>
                  <input type="file" name="image" accept="image/*" class="absolute top-[130px] left-[140px] text-[18px] w-[200px] h-[50px] pt-[8px] rounded-[25px] border-solid border-[1px] border-[#e65151] bg-[#000] text-[#fff]" onChange={e => handleInput(index, e)}></input>
                  {products.length > 1 && (<span class="text-[#E80A0A] absolute top-[190px] left-[165px]">{item.imageValid}</span>)}
                </div>
                {item.preview && (<div><img src={item.preview} alt="preview" className="w-[200px] absolute top-[40px] left-[400px] border-[1px]" /><button type="button" className="w-[20px] absolute top-[30px] left-[590px]" onClick={() => imageRemove(index)}><img src={remove} alt="remove" /></button></div>)}
                <div class="block">
                  <label class="text-[#C5f602] text-[26px] absolute top-[75px] left-[793px]">Rate</label>
                  <input type="text" name="rate" placeholder="Product Rate" class="absolute top-[130px] left-[695px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[70px] text-[#fff]" onChange={e => handleInput(index, e)}></input>
                  <span class="text-[#E80A0A] absolute top-[190px] left-[760px]">{item.rateValid}</span>
                </div>
                <div class="block">
                  <label class="text-[#C5f602] text-[26px] absolute  top-[75px] left-[1160px]">Discount</label>
                  <input type="text" name="discount" placeholder="Product Discount" value={item.discount} class="absolute top-[130px] left-[1095px] w-[200px] h-[50px] rounded-[25px] rounded-r-[0px] text-[18px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[30px] text-[#fff] z-[0]" onChange={e => handleInput(index, e)} ></input>
                  <div class="absolute top-[130px] right-[560px] text-[20px] rounded-r-[30px] text-center pt-[10px] border-l-[0px] w-[50px] h-[50px] border-solid border-[1px] border-[#e65151] bg-[#000] text-[#ffffff69] z-[1]">%</div>
                  <span class="text-[#E80A0A] absolute top-[190px] right-[604px]">{item.discountValid}</span>
                </div>
                <div class="block">
                  <label class="text-[#C5f602] text-[26px] absolute top-[75px] right-[250px]">Price</label>
                  <input type="text" name="price" value={item.rate} class="text-[18px] absolute top-[130px] right-[270px] w-[125px] h-[50px] rounded-[25px] rounded-r-[0px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[50px] line-through decoration-black text-[#C5f602]"></input>
                  <input type="text" name="price" value={item.price} class="absolute top-[130px] right-[168px] text-[18px] w-[125px] h-[50px] rounded-[25px] rounded-l-[0px] border-solid border-[1px] border-[#e65151] border-l-[0px] bg-[#000] pl-[0px] text-[#fff]" onChange={e => handleInput(index, e)}></input>
                  <span class="text-[#E80A0A] absolute top-[190px] right-[215px]">{item.priceValid}</span>
                </div>
                <div className="border-[1px] absolute top-[300px] border-[#C5f602] min-w-[1900px] "></div>
                <div className="block pt-[351px] px-[300px]">
                  {item.productSizes.map((pair, sizeIndex) => (
                    <div>
                      <div key={sizeIndex} class="flex  justify-center relative items-center top-[0px] min-w-[1900px] min-h-[200px] left-[0px]">
                        <div class="block">
                          <label class="text-[#C5f602] text-[26px] absolute top-[0px] left-[230px]">Size</label>
                          <input type="text" name="size" value={pair.size} placeholder="Product Size" class="absolute top-[50px] left-[140px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[70px] text-[#fff]" onChange={e => handleInputSize(index, sizeIndex, e)}></input>
                          <span class="text-[#E80A0A] absolute top-[110px] min-w-[200px] left-[200px]">{pair.sizeValid}</span>
                        </div>
                        {item.productSizes.length > 1 && (
                          <div class="block">
                            <label class="text-[#C5f602] text-[26px] absolute top-[0px] right-[625px]">Price</label>
                            <input type="text" name="price" placeholder="Product Price" value={pair.price} class="absolute top-[50px] right-[530px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-solid border-[1px] border-[#e65151] bg-[#000] pl-[70px] text-[#fff]" onChange={e => handleInputSize(index, sizeIndex, e)}></input>
                            <span class="text-[#E80A0A] relative top-[20px] left-[290px]">{pair.priceValid}</span>
                          </div>)}
                        <div class="block">
                          <label class="text-[#C5f602] text-[26px] absolute top-[0px] left-[769px]">Quantity</label>
                          <input type="text" name="quantity" value={pair.quantity} placeholder="Product Quantity" class="absolute top-[50px] left-[703px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-solid border-[1px] text-center border-[#e65151] bg-[#000] text-[#fff]" onChange={e => handleInputSize(index, sizeIndex, e)}></input>
                          <span class="text-[#E80A0A] absolute top-[110px]  min-w-[200px] left-[750px]">{pair.quantityValid}</span>
                        </div>
                        {item.productSizes.length > 1 && (<button type="button" class="bg-[#3F66D9] w-[80px] h-[35px] absolute right-[420px] top-[56px] rounded-[30px] border-solid border-[1px] items-center border-[#fff] hover:bg-[#fff] hover:border-[#3F66D9] hover:border-[2px]" onClick={() => sizeRemove(index, sizeIndex)}>Remove</button>)}
                      </div>
                    </div>
                  ))}
                  <button type="button" class="bg-[#E80A0A] w-[80px] h-[35px] absolute right-[420px] bottom-[20px] rounded-[30px] border-solid border-[1px] items-center border-[#fff] hover:bg-[#fff] hover:border-[#E80A0A] hover:border-[2px]" onClick={() => sizeAdd(index)}>ADD</button>
                </div>
                {products.length > 1 && (<button type="button" class="bg-[#3F66D9] w-[80px] h-[35px] absolute -right-[120px] top-[508px] rounded-[30px] border-solid border-[1px] items-center border-[#fff] hover:bg-[#fff] hover:border-[#3F66D9] hover:border-[2px]" onClick={() => handleRemove(index)}>Remove</button>)}
              </div>
            </div>
          ))}
          <button type="button" class="bg-[#E80A0A] w-[80px] h-[35px] relative left-[1740px] top-[30px]  rounded-[30px] border-solid border-[1px] items-center border-[#fff] hover:bg-[#fff] hover:border-[#E80A0A] hover:border-[2px]" onClick={handleAdd}>ADD</button>
          <button type="button" onClick={handleSubmit} class="bg-[#C5f601] w-[200px] h-[50px] relative top-[40px] left-[800px] text-center pt-[5px] rounded-[30px] text-[20px] hover:bg-[#fff] hover:border-[#C5f602] hover:border-[3px]">Submit</button>
        </form>
      </section>
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  )
}