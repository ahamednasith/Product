import React, { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { RxCrossCircled } from "react-icons/rx";
import remove from "../../images/remove.jpeg";
import addImage from '../../images/image upload.png';

export default function Form({ setIsProduct, setIsForm, setIsInfo, isInfo }) {
  const userID = localStorage.getItem('userID');
  const [products, setProducts] = useState([{ productName: '', description: '', category: '', rate: '', discount: '', price: '', image: '', preview: '', productSizes: [{ size: '', quantity: '', price: '' }] }]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isImage, setIsImage] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const fileInputRef = useRef(null);
  const [tag, setTag] = useState('');
  const [inputValue, setInputValue] = useState('');


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTask(event);
    }
  };

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  // handldNext Button
  const handleNext = () => {
    const updatedErrors = {};
    products.forEach((item, index) => {
      if (!item.productName) {
        updatedErrors[index] = { ...updatedErrors[index], productName: 'Product Name is Required' };
      }
      if (!item.description) {
        updatedErrors[index] = { ...updatedErrors[index], description: 'Description is Required' };
      }
      if (!item.category) {
        updatedErrors[index] = { ...updatedErrors[index], category: 'Category is Required' };
      }
      if (!tag) {
        updatedErrors[index] = { ...updatedErrors[index], productTag: "Product Tag is Required" };
      }
    });
    if (Object.keys(updatedErrors).length > 0) {
      setErrors(updatedErrors);
      return;
    }
    setIsImage(true);
    setIsInfo(false);
    setIsDetails(false);
  };

  const handleImageNext = () => {
    const updatedErrors = {};
    if (imagePreviews.length === 0) {
      updatedErrors.image = "Please select at least one image.";
    } else if (imagePreviews.length > 10) {
      updatedErrors.image = "Sry We Can Upload Only 10 Images"
    }
    if (Object.keys(updatedErrors).length > 0) {
      setErrors(updatedErrors);
      return;
    }
    setIsImage(false);
    setIsInfo(false);
    setIsDetails(true);
  };

  // handleInputs
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

  const handleInputImage = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages = images.length + selectedFiles.length;
    if (totalImages > 10) {
      alert("You can upload only up to 10 images.");
      return;
    }
    const newImages = [...images, ...selectedFiles];
    setImages(newImages);
    const imagePreviews = newImages.map((file) =>
      URL.createObjectURL(file)
    );
    setImagePreviews(imagePreviews);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // add and remove Dynamic functions
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

  const handleRemoveField = (taskToRemove) => {
    const updatedTasks = tag.split(',').filter((task) => task !== taskToRemove).join(',');
    setTag(updatedTasks);
  };


  const addTask = (event) => {
    event.preventDefault();
    if (inputValue) {
      setTag((prevTag) => (prevTag ? `${prevTag},${inputValue}` : inputValue));
      setInputValue('');
    }
  };

  //Images Removes
  const imageRemove = (index) => {
    const removeImage = [...products];
    removeImage[index].image = "";
    removeImage[index].preview = "";
    setProducts(removeImage);
  }

  const handleImageRemove = (imgIndex) => {
    const updatedImages = images.filter((_, index) => index !== imgIndex);
    setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== imgIndex));
    setImages(updatedImages);
  }


  const handleRemove = async (index) => {
    let data = [...products];
    data.splice(index, 1)
    setProducts(data)
  }

  //Validation
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
          formData.append(`products[${index}][productName]`, item.productName);
          formData.append(`products[${index}][description]`, item.description);
          formData.append(`products[${index}][category]`, item.category);
          formData.append(`products[${index}][rate]`, item.rate);
          formData.append(`products[${index}][discount]`, item.discount);
          formData.append(`products[${index}][price]`, item.price);
          formData.append(`sectionImages`, item.image)
          item.productSizes.forEach((sizeItem, sizeIndex) => {
            formData.append(`products[${index}][productSizes][${sizeIndex}][size]`, sizeItem.size);
            formData.append(`products[${index}][productSizes][${sizeIndex}][quantity]`, sizeItem.quantity);
            formData.append(`products[${index}][productSizes][${sizeIndex}][price]`, sizeItem.price);
          });
        });
        formData.append('productTag', tag);
        images.forEach((imageFile) => {
          formData.append('productImages', imageFile);
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
          window.location.reload();
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
        <Link to='/products' class="flex justify-center items-center text-[20px] absolute bg-[#168cb9] top-[200px] right-[240px] w-[100px] h-[50px] rounded-[10px] hover:bg-[#fff] hover:border-[#168cb9] hover:border-[3px]" onClick={() => { setIsForm(false); setIsProduct(true) }}>Back </Link>
        <h1 class="text-[40px] text-[#fff] pt-[220px] pl-[1210px]">Product Information </h1>
        <form class="block justify-between items-center pt-[20px] pl-[600px] pr-[230px]">
          {products.map((item, index) => (
            <div className="flex">
              <div className={`${isDetails ? "min-h-[500px]" : "min-h-[600px]"} min-w-[1600px] bg-[#404A5E] rounded-[25px] absolute left-[650px] top-[380px]`}>
                <div className="w-[100%] h-[100px] bg-[#273041] rounded-t-[25px]">
                  <div className={`text-[20px] absolute top-[40px] left-[50px] space-x-[20px] hover:text-[#fff] ${isInfo ? "text-[#fff] border-b-[4px] border-[#D2D5B2]" : "text-[#000]"}`} onClick={() => { setIsInfo(true); setIsImage(false); setIsDetails(false); }}>Product Info</div>
                  <div className={`text-[20px] absolute top-[40px] left-[250px] space-x-[20px] hover:text-[#fff] ${isImage ? "text-[#fff] border-b-[4px] border-[#D2D5B2]" : "text-[#000]"}`} onClick={() => { setIsInfo(false); setIsImage(true); setIsDetails(false); }}>Product Image</div>
                  <div className={`text-[20px] absolute top-[40px] left-[450px] space-x-[20px] hover:text-[#fff] ${isDetails ? "text-[#fff] border-b-[4px] border-[#D2D5B2]" : "text-[#000]"}`} onClick={() => { setIsInfo(false); setIsImage(false); setIsDetails(true); }}>Product Details</div>
                </div>
                <div>
                  {isInfo && (
                    <div>
                      <div className="flex relative">
                        <div>
                          <label className="text-[#D2D5B2] text-[25px] absolute top-[50px] left-[40px] w-[200px]">Product Name</label>
                          <input type="text" name="productName" placeholder="Enter Product Name" className="bg-[#273041]  text-[#fff] w-[725px] h-[45px] pl-[30px] absolute top-[95px] left-[40px] rounded-[7px] border-[#F7FF9B] border-[1px] text-[20px] text-[#000] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInput(index, e)}></input>
                          {errors[index] && errors[index].productName && (<span class="priority text-[#E80A0A] absolute top-[150px] left-[43px] text-[20px] w-[300px]">{errors[index].productName}</span>)}
                        </div>
                        <div>
                          <label className="text-[#D2D5B2] text-[25px] absolute top-[50px] left-[820px]">Description</label>
                          <input type="text" name="description" placeholder="Enter a Description" className="bg-[#273041]  text-[#fff] w-[725px] h-[45px] pl-[30px] absolute top-[95px] left-[820px] rounded-[7px] border-[#F7FF9B] border-[1px] text-[20px] text-[#000] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInput(index, e)}></input>
                          {errors[index] && errors[index].description && (<span class="priority text-[#E80A0A] absolute top-[150px] left-[820px] text-[20px] w-[300px]">{errors[index].description}</span>)}
                        </div>
                        <div>
                          <label className="text-[#D2D5B2] text-[25px] absolute top-[200px] left-[40px]">Category</label>
                          <input type="text" name="category" placeholder="Which type of  Category ?" class="w-[725px]  text-[#fff] h-[45px] pl-[30px] absolute  top-[245px] left-[40px] rounded-[7px] bg-[#273041] text-[20px] border-[#F7FF9B] border-[1px] text-[#000] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInput(index, e)}></input>
                          {errors[index] && errors[index].category && (<span class="priority text-[#E80A0A] absolute top-[300px] left-[49px] text-[20px] w-[300px]">{errors[index].category}</span>)}
                        </div>
                        <div>
                          <label className="text-[#D2D5B2] text-[25px] absolute top-[200px] left-[820px]">Product Tag</label>
                          <div className="w-[725px]  bg-[#273041] text-[20px] border-[#F7FF9B] border-[1px] relative top-[245px] left-[820px] rounded-[7px]">
                            <div className="flex flex-wrap relative">
                              {tag.split(',').filter(task => task.trim() !== '').map((task, index) => (
                                <div key={index} className="flex flex-wrap min-w-[100px] min-h-[40px] mx-[10px] text-center my-[10px] space-x-[30px] border-[2px] border-[#404A5E] rounded-[5px] pr-[10px]">
                                  <div contentEditable={true} className="text-[#fff] pt-[5px] pl-[10px]">
                                    {task}
                                  </div>
                                  <span className="w-[20px] pt-[8px]" onClick={() => handleRemoveField(task)}><RxCrossCircled /></span>
                                </div>
                              ))}

                            </div>
                            <div className="flex">
                              <input type="text" value={inputValue} onChange={handleInputChange} onKeyPress={handleKeyPress} className="mx-[10px] my-[10px] bg-[#273041] w-[600px] text-[#fff] focus:border-transparent focus:outline-none" />
                              <span className="text-[30px] text-[#C5f602] relative  -bottom-[10px] -right-[60px]" onClick={addTask}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-red-500 hover:text-blue-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#C5f602" stroke-width="2" d="M12,22 L12,2 M2,12 L22,12"></path></svg></span>
                            </div>
                          </div>
                          {errors[index] && errors[index].productTag && (<span class="priority text-[#E80A0A] relative top-[260px] left-[829px] text-[20px] w-[300px]">{errors[index].productTag}</span>)}
                        </div>
                      </div>
                      <button type="button" className="w-[100px] h-[40px] text-[20px] absolute -bottom-[80px] right-[50px] bg-[#D2D5B2] rounded-[20px] hover:border-[4px] hover:bg-[#fff] hover:border-[#D2D5B2]" onClick={handleNext}> Next </button>
                    </div>
                  )}
                  {isImage && (
                    <div className="flex flex-wrap justify-start items-start absolute left-[60px] top-[150px]">
                      {imagePreviews.map((preview, imgIndex) => (
                        <div key={imgIndex} className={`w-[200px] h-[200px] relative mx-[20px] mb-[20px]`}>
                          <img src={preview} alt={`Preview ${imgIndex}`} className="rounded-[20px] w-[200px] h-[200px] border-[1px] border-[#D2D5B2]" />
                          {imagePreviews.length > 1 && (<button type="button" className="w-[20px] h-[20px] absolute top-[4px] right-[10px] flex items-center justify-center cursor-pointer" onClick={() => handleImageRemove(imgIndex)}><img src={remove} alt="remove" /></button>)}
                        </div>
                      ))}
                      <div className="relative top-[0px] left-[20px] text-[18px] w-[200px] h-[200px] pt-[80px] text-center rounded-[25px] border-[1px] border-[#D2D5B2] text-[#fff]" onClick={handleDivClick}>
                        <img src={addImage} alt="add" className="absolute top-[0px] rounded-[20px]" />
                        <input type="file" name="image" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleInputImage} multiple />
                        {errors.image && (<span class=" text-[#E80A0A] absolute top-[310px] -left-[90px] text-[20px] w-[500px]">{errors.image}</span>)}
                      </div>
                      <button type="button" className="w-[100px] h-[40px] text-[20px] absolute top-[520px] left-[1350px] bg-[#D2D5B2] rounded-[20px] hover:border-[4px] hover:bg-[#fff] hover:border-[#D2D5B2]" onClick={handleImageNext}> Next </button>
                      <button type="button" className="w-[100px] h-[40px] text-[20px] absolute top-[520px] left-[100px] bg-[#D2D5B2] rounded-[20px] hover:border-[4px] hover:bg-[#fff] hover:border-[#D2D5B2]" onClick={() => { setIsInfo(true); setIsImage(false); setIsDetails(false); }}> Back </button>
                    </div>
                  )}
                  {isDetails && products.map((item, index) => (
                    <div key={index}>
                      <div class="flex  justify-center relative items-center bg-[#404A5E] min-w-[800px] min-h-[600px] mt-[30px]">
                        <div>
                          <label class="text-[#D2D5B2] text-[26px] absolute top-[40px] left-[200px]">Image</label>
                          <div className="absolute top-[80px] left-[140px] text-[18px] w-[200px] h-[200px] pt-[80px] text-center rounded-[25px] border-[1px] border-[#D2D5B2] bg-[#000] text-[#fff]" onClick={handleDivClick}>
                            <img src={addImage} alt="add" className={item.preview ? "hidden" : "absolute top-[0px] rounded-[20px]"} />
                            <input type="file" name="image" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => handleInput(index, e)} />
                            {item.preview && (<div><img src={item.preview} alt="preview" className="w-[200px] h-[199px] rounded-[25px] absolute top-[0px] left-[0px]" /><button type="button" className="w-[20px] absolute top-[10px] left-[170px]" onClick={() => imageRemove(index)}><img src={remove} alt="remove" /></button></div>)}
                          </div>
                          {products.length > 1 && (<span class="text-[#E80A0A] text-[18px] absolute top-[290px] left-[165px]">{item.imageValid}</span>)}
                        </div>
                        <div>
                          <label class="text-[#D2D5B2] text-[26px] absolute top-[120px] left-[650px]">Rate</label>
                          <input type="text" name="rate" placeholder="Product Rate" class="absolute top-[170px] left-[560px] text-[18px] w-[250px] h-[50px] rounded-[5px] border-[1px] border-[#D2D5B5] bg-[#273041] pl-[70px] text-[#fff] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInput(index, e)}></input>
                          <span class="text-[#E80A0A] text-[18px] absolute top-[230px] left-[620px]">{item.rateValid}</span>
                        </div>
                        <div>
                          <label class="text-[#D2D5B2] text-[26px] absolute  top-[120px] right-[550px]">Discount</label>
                          <input type="text" name="discount" placeholder="Product Discount" value={item.discount} class="absolute top-[170px] right-[530px] w-[200px] h-[50px] rounded-[5px] rounded-r-[0px] text-[18px] border-[1px] border-r-[0px] border-[#D2D5B2] bg-[#273041] pl-[30px] text-[#fff] z-[0] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInput(index, e)} ></input>
                          <div class="absolute top-[170px] right-[480px] text-[20px] rounded-r-[5px] text-center pt-[10px] border-l-[0px] w-[50px] h-[50px] border-[1px] border-[#D2D5B5] bg-[#273041] text-[#ffffff69] z-[1] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]">%</div>
                          <span class="text-[#E80A0A] absolute top-[230px] right-[510px] text-[18px]">{item.discountValid}</span>
                        </div>
                        <div>
                          <label class="text-[#D2D5B2] text-[26px] absolute top-[120px] right-[200px]">Price</label>
                          <input type="text" name="price" value={item.rate} class="text-[20px] absolute top-[170px] right-[230px] w-[125px] h-[50px] rounded-[5px] rounded-r-[0px] border-[1px] border-r-[0px] border-[#D2D5B5] bg-[#273041] pl-[50px] line-through decoration-[#DA4B4B] decoration-[4px] text-[#D2D5B5] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]"></input>
                          <input type="text" name="price" value={item.price} class="absolute top-[170px] right-[105px] text-[20px] w-[125px] h-[50px] rounded-[5px] rounded-l-[0px] border-[1px] border-[#d2d5b5] border-l-[0px] bg-[#273041] pl-[0px] text-[#fff] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInput(index, e)}></input>
                          <span class="text-[#E80A0A] absolute top-[230px] right-[155px] text-[18px]">{item.priceValid}</span>
                        </div>
                        <div className="pt-[351px]">
                          {item.productSizes.map((pair, sizeIndex) => (
                            <div>
                              <div key={sizeIndex} class="flex relative top-[50px] min-w-[1660px] min-h-[300px] left-[0px] rounded-b-[25px] bg-[#273041] -mt-[30px]">
                                <div>
                                  <label class="text-[#D2D5B5] text-[26px] absolute top-[50px] left-[230px]">Size</label>
                                  <input type="text" name="size" value={pair.size} placeholder="Product Size" class="absolute top-[100px] left-[140px] text-[18px] w-[250px] h-[50px] rounded-[5px] border-[1px] border-[#D2D5B5] bg-[#404A5E] pl-[70px] text-[#fff] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInputSize(index, sizeIndex, e)}></input>
                                  <span class="text-[#E80A0A] absolute top-[160px] text-[18px] left-[200px]">{pair.sizeValid}</span>
                                </div>
                                {item.productSizes.length > 1 && (
                                  <div>
                                    <label class="text-[#D2D5B5] text-[26px] absolute top-[50px] right-[570px]">Price</label>
                                    <input type="text" name="price" placeholder="Product Price" value={pair.price} class="absolute top-[100px] right-[470px] text-[18px] w-[250px] h-[50px] rounded-[5px] border-[1px] border-[#D2D5B5] bg-[#404A5E] pl-[70px] text-[#fff] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInputSize(index, sizeIndex, e)}></input>
                                    <span class="text-[#E80A0A] relative top-[160px] left-[1000px] text-[18px]">{pair.priceValid}</span>
                                  </div>)}
                                <div>
                                  <label class="text-[#D2D5B5] text-[26px] absolute top-[50px] left-[609px]">Quantity</label>
                                  <input type="text" name="quantity" value={pair.quantity} placeholder="Product Quantity" class="absolute top-[100px] left-[553px] text-[18px] w-[250px] h-[50px] rounded-[5px] border-[1px] text-center border-[#D2D5B5] bg-[#404A5E] text-[#fff] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInputSize(index, sizeIndex, e)}></input>
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
                  {isDetails && (
                    <div>
                      <button type="button" className="w-[100px] h-[40px] text-[20px] relative top-[60px] left-[100px] bg-[#D2D5B2] rounded-[20px] hover:border-[4px] hover:bg-[#fff] hover:border-[#D2D5B2]" onClick={() => { setIsInfo(false); setIsImage(true); setIsDetails(false); }}> Back </button>
                      <button type="button" class="bg-[#DA4B4B] w-[100px] h-[35px] relative left-[1500px] top-[60px]  rounded-[30px] text-[#fff] hover:bg-[#000] hover:border-[#DA4B4B] hover:border-[2px]" onClick={handleAdd}>ADD</button>
                      <button type="button" onClick={handleSubmit} class="bg-[#D2D5B5] w-[200px] h-[50px] relative top-[80px] left-[650px] text-center pt-[5px] rounded-[30px] text-[25px] hover:bg-[#fff] hover:border-[#D2D5B5] hover:border-[4px]">Submit</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </form>
      </section>
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  )
}