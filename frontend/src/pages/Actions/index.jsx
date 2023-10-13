import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import remove from "../../images/remove.jpeg";
import addImage from '../../images/pngwing.com (3).png';




export default function Action({ productID,setIsAction,setIsProduct }) {
  const [productDatas, setProductDatas] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  const handleAdd = () => {
    const product = { id: '', rate: '', discount: '', price: '', image: '', preview: '', productSizes: [{ size: '', quantity: '', price: '' }] };
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


  const sizeAdd = (index) => {
    const updatedProducts = [...productDatas];
    updatedProducts[index].productSizes.push({ size: '', quantity: '', price: '' });
    setProductDatas(updatedProducts);
  };


  const sizeRemove = async (index, sizeIndex) => {
    let data = [...productDatas];
    const updatedSize = [...data[index].productSizes];
    updatedSize.splice(sizeIndex, 1)
    data[index].productSizes = updatedSize
    setProductDatas(data)
  }


  const handleRemove = async (index) => {
    let data = [...productDatas];
    data.splice(index, 1)
    setProductDatas(data)
  }


  const imageRemove = (index) => {
    const removeImage = [...productDatas];
    removeImage[index].image = "";
    removeImage[index].preview = "";
    setProductDatas(removeImage);
  }


  const handleInputChange = (index, e) => {
    const updatedProductDatas = [...productDatas];
    if (e.target.name === 'image') {
      updatedProductDatas[index]['image'] = e.target.files[0];
      updatedProductDatas[index]['preview'] = URL.createObjectURL(e.target.files[0])
      setProductDatas(updatedProductDatas)
    } else {
      updatedProductDatas[index][e.target.name] = e.target.value;
      const rate = parseFloat(updatedProductDatas[index]['rate']);
      const discount = parseFloat(updatedProductDatas[index]['discount']);
      if (!isNaN(rate) && !isNaN(discount)) {
        const price = rate - (rate * (discount / 100));
        updatedProductDatas[index]['price'] = price.toFixed(2);
      }
    }
    setProductDatas(updatedProductDatas);
  };


  const handleInputSize = (index, sizeIndex, e) => {
    const updatedProducts = [...productDatas];
    updatedProducts[index].productSizes[sizeIndex][e.target.name] = e.target.value;
    const rate = parseFloat(updatedProducts[index]['rate']);
    const discount = parseFloat(updatedProducts[index]['discount']);
    const quantity = parseInt(updatedProducts[index].productSizes[sizeIndex]['quantity']);
    if (!isNaN(rate) && !isNaN(discount) && !isNaN(quantity)) {
      const price = (rate - (rate * (discount / 100))) * quantity;
      updatedProducts[index].productSizes[sizeIndex]['price'] = price.toFixed(2);
    }
    setProductDatas(updatedProducts);
  };


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
    setProductDatas(data);
    return valid;
  };


  const handleEdit = async (e) => {
    const error = validation(productDatas);
    const formData = new FormData();
    productDatas.forEach((item, index) => {
      formData.append(`products[${index}][id]`, item.id);
      formData.append(`products[${index}][userID]`, item.userID);
      formData.append(`products[${index}][productID]`, item.productID || productID);
      formData.append(`products[${index}][sectionID]`, item.id);
      formData.append(`products[${index}][rate]`, item.rate);
      formData.append(`products[${index}][discount]`, item.discount);
      formData.append(`products[${index}][price]`, item.price);
      formData.append('productImages', item.image);
      item.productSizes.forEach((sizeItem, sizeIndex) => {
        formData.append(`products[${index}][productSizes][${sizeIndex}][id]`, sizeItem.id || '');
        formData.append(`products[${index}][productSizes][${sizeIndex}][sectionID]`, sizeItem.sectionID || item.id);
        formData.append(`products[${index}][productSizes][${sizeIndex}][size]`, sizeItem.size);
        formData.append(`products[${index}][productSizes][${sizeIndex}][quantity]`, sizeItem.quantity);
        formData.append(`products[${index}][productSizes][${sizeIndex}][price]`, sizeItem.price);
      });
    });
    if (error) {
      try {
        const response = await axios.post('http://localhost:3000/product/update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data) {
          navigate('/products');
          setIsAction(false);
          setIsProduct(true);
          window.location.reload();
        }
      } catch (error) {
        console.log({ error: error.message });
      }
    } else {
      console.log(error);
    }
  };

  useEffect(() => {
    handleShow();
  }, [])


  return (
    <div>
      <section id="info" class="block justify-center items-center h-[1400px]">
        <Link to="/products" class="flex justify-center items-center text-[20px] absolute bg-[#168cb9] top-[200px] right-[240px] w-[100px] h-[50px] rounded-[10px] hover:bg-[#fff] hover:border-[3px] hover:border-[#168cb9]" onClick={() => {setIsAction(false);setIsProduct(true)}}>Back </Link>
        <h1 class="text-[40px] text-[#fff] pt-[220px] pl-[1210px]">Product Information </h1>
        <div class="block justify-between items-center pt-[20px] pl-[600px] pr-[230px]">
          {productDatas.map((item, index) => (
            <form key={index} class="flex  justify-center relative items-center bg-[#404A5E] rounded-[30px]  min-w-[800px] min-h-[600px] mb-[40px]">
              <div>
                <div>
                  <label className="text-[#D2D5B2] text-[26px] absolute top-[45px] left-[200px]">Image</label>
                  {item.preview || item.image ? (
                    <div className="absolute top-[90px] left-[140px] w-[200px] h-[200px] ">
                      <img src={item.preview || item.image} alt="preview" className="w-[200px] h-[200px] rounded-[25px]" />
                      <img src={remove} alt="remove" className="w-[20px] absolute top-[10px] left-[170px]" onClick={() => imageRemove(index)} />
                    </div>
                  ) : (
                    <div className="absolute top-[90px] left-[140px] text-[18px] w-[200px] h-[200px] pt-[80px] text-center rounded-[25px] border-solid border-[1px] border-[#D2D5B2] bg-[#000] text-[#fff]" onClick={handleDivClick}>
                      <img src={addImage} alt="add" className="absolute top-[0px]" />
                      <input type="file" name="image" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => handleInputChange(index, e)} />
                    </div>
                  )}
                  {productDatas.length > 1 && (
                    <span className="text-[#E80A0A] absolute top-[300px] left-[165px] text-[18px]">{item.imageValid}</span>
                  )}
                </div>
                <div>
                  <label class="text-[#D2D5B2] text-[26px] absolute top-[120px] left-[653px]">Rate</label>
                  <input type="text" name="rate" value={item.rate} placeholder="Product Rate" class="absolute top-[170px] left-[560px] text-[18px] w-[250px] h-[50px] rounded-[25px] border-solid border-[1px] border-[#D2D5B2] bg-[#000] text-center text-[#fff]" onChange={e => handleInputChange(index, e)}></input>
                  <span class="text-[#E80A0A] text-[18px] absolute top-[230px] left-[620px]">{item.rateValid}</span>
                </div>
                <div>
                  <label class="text-[#D2D5B2] text-[26px] absolute  top-[120px] right-[550px]">Discount</label>
                  <input type="text" name="discount" placeholder="Product Discount" value={item.discount} class="absolute top-[170px] right-[530px] w-[200px] h-[50px] rounded-[25px] rounded-r-[0px] text-[18px] border-[1px] border-r-[0px] border-[#D2D5B2] bg-[#000] text-center text-[#fff] z-[0]" onChange={e => handleInputChange(index, e)} ></input>
                  <div class="absolute top-[170px] right-[480px] text-[20px] rounded-r-[30px] text-center pt-[10px] border-l-[0px] w-[50px] h-[50px] border-[1px] border-[#D2D5B5] bg-[#000] text-[#ffffff69] z-[1]">%</div>
                  <span class="text-[#E80A0A] absolute top-[230px] right-[510px] text-[18px]">{item.discountValid}</span>
                </div>
                <div>
                  <label class="text-[#D2D5B2] text-[26px] absolute top-[120px] right-[200px]">Price</label>
                  <input type="text" name="price" value={item.rate} class="text-[20px] absolute top-[170px] right-[230px] w-[125px] h-[50px] rounded-[25px] rounded-r-[0px] border-[1px] border-r-[0px] border-[#D2D5B5] bg-[#000] pl-[50px] line-through decoration-[#DA4B4B] decoration-[4px] text-[#D2D5B5]"></input>
                  <input type="text" name="price" value={item.price} class="absolute top-[170px] right-[105px] text-[20px] w-[125px] h-[50px] rounded-[25px] rounded-l-[0px] border-[1px] border-[#d2d5b5] border-l-[0px] bg-[#000] pl-[0px] text-[#fff]" onChange={e => handleInputChange(index, e)}></input>
                  <span class="text-[#E80A0A] absolute top-[230px] right-[155px] text-[18px]">{item.priceValid}</span>
                </div>
                {productDatas.length > 1 && (<button type="button" class="bg-[#3F66D9] w-[100px] h-[35px] absolute -right-[120px] top-[58px] rounded-[30px] text-[#fff] hover:bg-[#000] hover:border-[#3F66D9] hover:border-[2px]" onClick={() => handleRemove(index)}>Remove</button>)}
                <div className="pt-[351px]">
                  {item.productSizes.map((pair, sizeIndex) => (
                    <div>
                      <div key={sizeIndex} class="flex bg-[#273041] justify-center relative items-center top-[0px] min-w-[1660px] min-h-[300px] left-[0px] rounded-b-[30px] -mt-[30px]">
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
              </div>
            </form>
          ))}
        </div>
        <button type="button" onClick={() => (handleEdit())} class="bg-[#D2D5B5] w-[200px] h-[50px] relative top-[30px] left-[1300px] text-center pt-[5px] rounded-[30px] text-[25px] hover:bg-[#fff] hover:border-[#D2D5B5] hover:border-[4px]">Submit</button>
        <button type="button" class="bg-[#DA4B4B] w-[100px] h-[35px] relative left-[1950px] top-[10px]  rounded-[30px] text-[#fff] hover:bg-[#000] hover:border-[#DA4B4B] hover:border-[2px]" onClick={handleAdd}>ADD</button>
      </section>
    </div>
  )
}