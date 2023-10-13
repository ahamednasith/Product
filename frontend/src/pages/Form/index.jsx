import React, { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import remove from "../../images/remove.jpeg";
import addImage from '../../images/pngwing.com (3).png';

export default function Form({setIsProduct,setIsForm}) {
  const userID = localStorage.getItem('userID');
  const [products, setProducts] = useState([{ rate: '', discount: '', price: '', image: '', preview: '', productSizes: [{ size: '', quantity: '', price: '' }] }]);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleDivClick = () => {
    fileInputRef.current.click();
  };


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
    if (!isNaN(rate) && !isNaN(discount) && !isNaN(quantity)) {
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
          formData.append(`products[${index}][userID]`, userID);
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
          navigate(`/products`);
          setIsProduct(true);
          setIsForm(false);
          window.location.reload()
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
      <section id="info" class="block justify-center items-center h-[1400px]">
        <Link to='/products' class="flex justify-center items-center text-[20px] absolute bg-[#168cb9] top-[200px] right-[240px] w-[100px] h-[50px] rounded-[10px] hover:bg-[#fff] hover:border-[#168cb9] hover:border-[3px]" onClick={() => {setIsForm(false);setIsProduct(true)}}>Back </Link>
        <h1 class="text-[40px] text-[#fff] pt-[220px] pl-[1210px]">Product Information </h1>
        <form class="block justify-between items-center pt-[20px] pl-[600px] pr-[230px]">
          {products.map((item, index) => (
            <div>
              <div key={index} class="flex  justify-center relative items-center bg-[#404A5E] rounded-[30px]  min-w-[800px] min-h-[600px] mt-[40px]">
                <div>
                  <label class="text-[#D2D5B2] text-[26px] absolute top-[40px] left-[200px]">Image</label>
                  <div className="absolute top-[80px] left-[140px] text-[18px] w-[200px] h-[200px] pt-[80px] text-center rounded-[25px] border-[1px] border-[#D2D5B2] bg-[#000] text-[#fff]" onClick={handleDivClick}>
                    <img src={addImage} alt="add" className="absolute top-[0px]" />
                    <input type="file" name="image" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => handleInput(index, e)} />
                    {item.preview && (<div><img src={item.preview} alt="preview" className="w-[200px] h-[199px] rounded-[25px] absolute top-[0px] left-[0px]" /><button type="button" className="w-[20px] absolute top-[10px] left-[170px]" onClick={() => imageRemove(index)}><img src={remove} alt="remove" /></button></div>)}
                  </div>
                  {products.length > 1 && (<span class="text-[#E80A0A] text-[18px] absolute top-[290px] left-[165px]">{item.imageValid}</span>)}
                </div>
                <div>
                  <label class="text-[#D2D5B2] text-[26px] absolute top-[120px] left-[650px]">Rate</label>
                  <input type="text" name="rate" placeholder="Product Rate" class="absolute top-[170px] left-[560px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-[1px] border-[#D2D5B5] bg-[#000] pl-[70px] text-[#fff]" onChange={e => handleInput(index, e)}></input>
                  <span class="text-[#E80A0A] text-[18px] absolute top-[230px] left-[620px]">{item.rateValid}</span>
                </div>
                <div>
                  <label class="text-[#D2D5B2] text-[26px] absolute  top-[120px] right-[550px]">Discount</label>
                  <input type="text" name="discount" placeholder="Product Discount" value={item.discount} class="absolute top-[170px] right-[530px] w-[200px] h-[50px] rounded-[25px] rounded-r-[0px] text-[18px] border-[1px] border-r-[0px] border-[#D2D5B2] bg-[#000] pl-[30px] text-[#fff] z-[0]" onChange={e => handleInput(index, e)} ></input>
                  <div class="absolute top-[170px] right-[480px] text-[20px] rounded-r-[30px] text-center pt-[10px] border-l-[0px] w-[50px] h-[50px] border-[1px] border-[#D2D5B5] bg-[#000] text-[#ffffff69] z-[1]">%</div>
                  <span class="text-[#E80A0A] absolute top-[230px] right-[510px] text-[18px]">{item.discountValid}</span>
                </div>
                <div>
                  <label class="text-[#D2D5B2] text-[26px] absolute top-[120px] right-[200px]">Price</label>
                  <input type="text" name="price" value={item.rate} class="text-[20px] absolute top-[170px] right-[230px] w-[125px] h-[50px] rounded-[25px] rounded-r-[0px] border-[1px] border-r-[0px] border-[#D2D5B5] bg-[#000] pl-[50px] line-through decoration-[#DA4B4B] decoration-[4px] text-[#D2D5B5]"></input>
                  <input type="text" name="price" value={item.price} class="absolute top-[170px] right-[105px] text-[20px] w-[125px] h-[50px] rounded-[25px] rounded-l-[0px] border-[1px] border-[#d2d5b5] border-l-[0px] bg-[#000] pl-[0px] text-[#fff]" onChange={e => handleInput(index, e)}></input>
                  <span class="text-[#E80A0A] absolute top-[230px] right-[155px] text-[18px]">{item.priceValid}</span>
                </div>
                <div className="pt-[351px]">
                  {item.productSizes.map((pair, sizeIndex) => (
                    <div>
                      <div key={sizeIndex} class="flex relative top-[0px] min-w-[1660px] min-h-[300px] left-[0px] rounded-b-[30px] bg-[#273041] -mt-[30px]">
                        <div>
                          <label class="text-[#D2D5B5] text-[26px] absolute top-[50px] left-[230px]">Size</label>
                          <input type="text" name="size" value={pair.size} placeholder="Product Size" class="absolute top-[100px] left-[140px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-[1px] border-[#D2D5B5] bg-[#000] pl-[70px] text-[#fff]" onChange={e => handleInputSize(index, sizeIndex, e)}></input>
                          <span class="text-[#E80A0A] absolute top-[160px] text-[18px] left-[200px]">{pair.sizeValid}</span>
                        </div>
                        {item.productSizes.length > 1 && (
                          <div>
                            <label class="text-[#D2D5B5] text-[26px] absolute top-[50px] right-[570px]">Price</label>
                            <input type="text" name="price" placeholder="Product Price" value={pair.price} class="absolute top-[100px] right-[470px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-[1px] border-[#D2D5B5] bg-[#000] pl-[70px] text-[#fff]" onChange={e => handleInputSize(index, sizeIndex, e)}></input>
                            <span class="text-[#E80A0A] relative top-[160px] left-[1000px] text-[18px]">{pair.priceValid}</span>
                          </div>)}
                        <div>
                          <label class="text-[#D2D5B5] text-[26px] absolute top-[50px] left-[609px]">Quantity</label>
                          <input type="text" name="quantity" value={pair.quantity} placeholder="Product Quantity" class="absolute top-[100px] left-[553px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-[1px] text-center border-[#D2D5B5] bg-[#000] text-[#fff]" onChange={e => handleInputSize(index, sizeIndex, e)}></input>
                          <span class="text-[#E80A0A] absolute top-[160px] left-[586px] text-[18px]">{pair.quantityValid}</span>
                        </div>
                        {item.productSizes.length > 1 && (<button type="button" class="bg-[#3F66D9] w-[100px] h-[35px] absolute right-[300px] top-[105px] rounded-[30px] text-[#fff] hover:bg-[#000] hover:border-[2px]" onClick={() => sizeRemove(index, sizeIndex)}>Remove</button>)}
                      </div>
                    </div>
                  ))}
                  <button type="button" class="bg-[#DA4B4B] w-[100px] h-[35px] absolute right-[295px] bottom-[60px] rounded-[30px] text-[#fff] hover:bg-[#000] hover:border-[2px]" onClick={() => sizeAdd(index)}>ADD</button>
                </div>
                {products.length > 1 && (<button type="button" class="bg-[#3F66D9] w-[100px] h-[35px] absolute -right-[120px] top-[58px] rounded-[30px] text-[#fff] hover:bg-[#000] hover:border-[#3F66D9] hover:border-[2px]" onClick={() => handleRemove(index)}>Remove</button>)}
              </div>
            </div>
          ))}
          <button type="button" class="bg-[#DA4B4B] w-[100px] h-[35px] relative left-[1500px] top-[30px]  rounded-[30px] text-[#fff] hover:bg-[#000] hover:border-[#DA4B4B] hover:border-[2px]" onClick={handleAdd}>ADD</button>
          <button type="button" onClick={handleSubmit} class="bg-[#D2D5B5] w-[200px] h-[50px] relative top-[30px] left-[650px] text-center pt-[5px] rounded-[30px] text-[25px] hover:bg-[#fff] hover:border-[#D2D5B5] hover:border-[4px]">Submit</button>
        </form>
      </section>
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  )
}