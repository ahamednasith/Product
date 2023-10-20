import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import remove from "../../images/remove.jpeg";
import addImage from '../../images/image upload.png';
import { RxCrossCircled } from "react-icons/rx";
import { GrAdd } from "react-icons/gr";




export default function Action({ productID, setIsAction, setIsProduct, setIsInfo, isInfo }) {
  const [productDatas, setProductDatas] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [productImage, setProductImage] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isImage, setIsImage] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const [tag, setTag] = useState('');
  const [inputValue, setInputValue] = useState('');


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTask(event);
    }
  };


  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleShow = async () => {
    try {
      const response = await axios.post('http://localhost:3000/product/all', { productID });
      setProductDatas(response.data.productData);
      setTag(response.data.productData[0].productTag)
      setProductImage(response.data.productImages);
    } catch (error) {
      console.log({ error: error.message })
    }
  }

  //handleNext Button
  const handleNext = () => {
    const updatedErrors = {};
    productDatas.forEach((item, index) => {
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
    productImage.forEach(() => {
      if (productImage.length === 0) {
        updatedErrors.image = "Please select at least one image."
      }
    })
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


  const handleImageRemove = (imgIndex) => {
    const newImages = [...images];
    const newImagePreviews = [...imagePreviews];
    const updatedProductImage = [...productImage];
    newImages.splice(imgIndex, 1);
    newImagePreviews.splice(imgIndex, 1);
    if (updatedProductImage[imgIndex]) {
      updatedProductImage.splice(imgIndex, 1);
    }
    setImages(newImages);
    setImagePreviews(newImagePreviews);
    setProductImage(updatedProductImage);
  };



  //handle Inputs
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

  const handleInputImage = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages = images.length + selectedFiles.length;
    if (totalImages > 10) {
      alert("You can upload only up to 10 images.");
      return;
    }
    const fileObjects = selectedFiles.map((file) => {
      if (file instanceof Blob) {
        return new File([file], file.name, { type: file.type });
      }
      return file;
    });
    const newImages = [...images, ...fileObjects.slice(0, 10 - images.length)];
    setImages(newImages);
    const imagePreviews = newImages.map((file) => {
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }
      return file;
    });
    setImagePreviews(imagePreviews);
  };


  const handleInput = (event) => {
    setInputValue(event.target.value);
  };


  //Add & Remove Dynamic Function 
  const sizeAdd = (index) => {
    const updatedProducts = [...productDatas];
    updatedProducts[index].productSizes.push({ size: '', quantity: '', price: '' });
    setProductDatas(updatedProducts);
  };


  const handleAdd = () => {
    const product = { id: '', rate: '', discount: '', price: '', image: '', preview: '', productSizes: [{ size: '', quantity: '', price: '' }] };
    setProductDatas([...productDatas, product]);
  }


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
    setProductDatas(data);
    return valid;
  };


  const handleEdit = async () => {
    try {
      const error = validation(productDatas);
      if (error) {
        const formData = new FormData();
        productDatas.forEach((item, index) => {
          formData.append(`products[${index}][id]`, item.id);
          formData.append(`products[${index}][userID]`, item.userID);
          formData.append(`products[${index}][productID]`, item.productID || productID);
          formData.append(`products[${index}][sectionID]`, item.id);
          formData.append(`products[${index}][productName]`, item.productName);
          formData.append(`products[${index}][description]`, item.description);
          formData.append(`products[${index}][category]`, item.category);
          formData.append(`products[${index}][rate]`, item.rate);
          formData.append(`products[${index}][discount]`, item.discount);
          formData.append(`products[${index}][price]`, item.price);
          formData.append('sectionImages', item.image);
          console.log(item.productSizes);
          item.productSizes.forEach((sizeItem, sizeIndex) => {
            formData.append(`products[${index}][productSizes][${sizeIndex}][id]`, sizeItem.id || '');
            formData.append(`products[${index}][productSizes][${sizeIndex}][sectionID]`, sizeItem.sectionID || item.id);
            formData.append(`products[${index}][productSizes][${sizeIndex}][size]`, sizeItem.size);
            formData.append(`products[${index}][productSizes][${sizeIndex}][quantity]`, sizeItem.quantity);
            formData.append(`products[${index}][productSizes][${sizeIndex}][price]`, sizeItem.price);
          });
        });
        productImage.forEach((imageItem, imgIndex) => {
          console.log(imageItem.id);
          formData.append(`productImages[${imgIndex}][id]`, imageItem.id || '');
        })
        images.forEach((imageFile) => {
          console.log(imageFile);
          formData.append('productImages', imageFile);
        });
        formData.append('productTag', tag);
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
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleShow();
  }, [])

  useEffect(() => {
    if (productImage.length > 0 && !images.length) {
      const productImages = productImage.map((input) => input.image);
      setImages(productImages);
      setImagePreviews(productImages);
    }
  }, [productImage, images]);

  return (
    <div>
      <section id="info" class="block justify-center items-center h-[1400px]">
        <Link to="/products" class="flex justify-center items-center text-[20px] absolute bg-[#168cb9] top-[200px] right-[240px] w-[100px] h-[50px] rounded-[10px] hover:bg-[#fff] hover:border-[3px] hover:border-[#168cb9]" onClick={() => { setIsAction(false); setIsProduct(true) }}>Back </Link>
        <h1 class="text-[40px] text-[#fff] pt-[220px] pl-[1210px]">Product Information </h1>
        <form class="block justify-between items-center pt-[20px] pl-[600px] pr-[230px]">
          {productDatas.map((item, index) => (
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
                          <input type="text" name="productName" placeholder="Enter Product Name" value={item.productName} className="bg-[#273041]  text-[#fff] w-[725px] h-[45px] pl-[30px] absolute top-[95px] left-[40px] rounded-[7px] border-[#F7FF9B] border-[1px] text-[20px] text-[#000] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInputChange(index, e)}></input>
                          {errors[index] && errors[index].productName && (<span class="priority text-[#E80A0A] absolute top-[150px] left-[43px] text-[20px] w-[300px]">{errors[index].productName}</span>)}
                        </div>
                        <div>
                          <label className="text-[#D2D5B2] text-[25px] absolute top-[50px] left-[820px]">Description</label>
                          <input type="text" name="description" placeholder="Enter a Description" value={item.description} className="bg-[#273041]  text-[#fff] w-[725px] h-[45px] pl-[30px] absolute top-[95px] left-[820px] rounded-[7px] border-[#F7FF9B] border-[1px] text-[20px] text-[#000] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInputChange(index, e)}></input>
                          {errors[index] && errors[index].description && (<span class="priority text-[#E80A0A] absolute top-[150px] left-[820px] text-[20px] w-[300px]">{errors[index].description}</span>)}
                        </div>
                        <div>
                          <label className="text-[#D2D5B2] text-[25px] absolute top-[200px] left-[40px]">Category</label>
                          <input type="text" name="category" placeholder="Which type of  Category ?" value={item.category} class="w-[725px]  text-[#fff] h-[45px] pl-[30px] absolute  top-[245px] left-[40px] rounded-[7px] bg-[#273041] text-[20px] border-[#F7FF9B] border-[1px] text-[#000] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInputChange(index, e)}></input>
                          {errors[index] && errors[index].category && (<span class="priority text-[#E80A0A] absolute top-[250px] left-[109px] text-[20px] w-[300px]">{errors[index].category}</span>)}
                        </div>
                        <div>
                          <label className="text-[#D2D5B2] text-[25px] absolute top-[200px] left-[820px]">Product Type</label>
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
                              <input type="text" value={inputValue} onChange={handleInput} onKeyPress={handleKeyPress} className="mx-[10px] my-[10px] bg-[#273041] w-[600px] text-[#fff] focus:border-transparent focus:outline-none" />
                              <span className="text-[30px] text-[#C5f602] relative  -bottom-[10px] -right-[60px]" onClick={addTask}><GrAdd /></span>
                            </div>
                          </div>
                          {errors[index] && errors[index].productTag && (<span class="priority text-[#E80A0A] relative top-[260px] left-[829px] text-[20px] w-[300px]">{errors[index].productTag}</span>)}
                        </div>
                      </div>
                      <button type="button" className="w-[100px] h-[40px] text-[20px] absolute bottom-[20px] right-[50px] bg-[#D2D5B2] rounded-[20px] hover:border-[4px] hover:bg-[#fff] hover:border-[#D2D5B2]" onClick={handleNext}> Next </button>
                    </div>
                  )}
                  {isImage && (
                    <div className="flex flex-wrap justify-start items-start absolute left-[60px] top-[150px]">
                      {imagePreviews.map((preview, imgIndex) => (
                        <div key={imgIndex} className={`w-[200px] h-[200px] relative mx-[20px] mb-[20px]`}>
                          <img src={preview} alt={`Preview ${imgIndex}`} className="rounded-[20px] border-[1px] border-[#D2D5B2]" />
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
                  {isDetails && productDatas.map((item, index) => (
                    <div key={index}>
                      <div class="flex  justify-center relative items-center bg-[#404A5E] min-w-[800px] min-h-[600px] mt-[30px]">
                        <div>
                          <label class="text-[#D2D5B2] text-[26px] absolute top-[40px] left-[200px]">Image</label>
                          {item.preview || item.image ? (
                            <div className="absolute top-[90px] left-[140px] w-[200px] h-[200px] ">
                              <img src={item.preview || item.image} alt="preview" className="w-[200px] h-[200px] rounded-[25px]" />
                              <img src={remove} alt="remove" className="w-[20px] absolute top-[10px] left-[170px]" onClick={() => imageRemove(index)} />
                            </div>
                          ) : (
                            <div className="absolute top-[90px] left-[140px] text-[18px] w-[200px] h-[200px] pt-[80px] text-center rounded-[25px] border-solid border-[1px] border-[#D2D5B2] bg-[#000] text-[#fff]" onClick={handleDivClick}>
                              <img src={addImage} alt="add" className="absolute top-[0px] rounded-[20px]" />
                              <input type="file" name="image" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => handleInputChange(index, e)} />
                            </div>
                          )}
                          {productDatas.length > 1 && (
                            <span class="text-[#E80A0A] text-[18px] absolute top-[290px] left-[165px]">{item.imageValid}</span>
                          )}
                        </div>
                        <div>
                          <label class="text-[#D2D5B2] text-[26px] absolute top-[120px] left-[650px]">Rate</label>
                          <input type="text" name="rate" value={item.rate} placeholder="Product Rate" class="absolute top-[170px] left-[560px] text-[18px] w-[250px] h-[50px] rounded-[5px] border-[1px] border-[#D2D5B5] bg-[#273041] text-center text-[#fff] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInputChange(index, e)}></input>
                          <span class="text-[#E80A0A] text-[18px] absolute top-[230px] left-[620px]">{item.rateValid}</span>
                        </div>
                        <div>
                          <label class="text-[#D2D5B2] text-[26px] absolute  top-[120px] right-[550px]">Discount</label>
                          <input type="text" name="discount" placeholder="Product Discount" value={item.discount} class="absolute top-[170px] right-[530px] w-[200px] h-[50px] rounded-[5px] rounded-r-[0px] text-[18px] border-[1px] border-r-[0px] border-[#D2D5B2] bg-[#273041] text-center pl-[30px] text-[#fff] z-[0] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInputChange(index, e)} ></input>
                          <div class="absolute top-[170px] right-[480px] text-[20px] rounded-r-[5px] text-center pt-[10px] border-l-[0px] w-[50px] h-[50px] border-[1px] border-[#D2D5B5] bg-[#273041] text-[#ffffff69] z-[1] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]">%</div>
                          <span class="text-[#E80A0A] absolute top-[230px] right-[510px] text-[18px]">{item.discountValid}</span>
                        </div>
                        <div>
                          <label class="text-[#D2D5B2] text-[26px] absolute top-[120px] right-[200px]">Price</label>
                          <input type="text" name="price" value={item.rate} class="text-[20px] absolute top-[170px] right-[230px] w-[125px] h-[50px] rounded-[5px] rounded-r-[0px] border-[1px] border-r-[0px] border-[#D2D5B5] bg-[#273041] pl-[50px] line-through decoration-[#DA4B4B] decoration-[4px] text-[#D2D5B5] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]"></input>
                          <input type="text" name="price" value={item.price} class="absolute top-[170px] right-[105px] text-[20px] w-[125px] h-[50px] rounded-[5px] rounded-l-[0px] border-[1px] border-[#d2d5b5] border-l-[0px] bg-[#273041] pl-[0px] text-[#fff] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInputChange(index, e)}></input>
                          <span class="text-[#E80A0A] absolute top-[230px] right-[155px] text-[18px]">{item.priceValid}</span>
                        </div>
                        {productDatas.length > 1 && (<button type="button" class="bg-[#3F66D9] w-[100px] h-[35px] absolute -right-[120px] top-[58px] rounded-[30px] text-[#fff] hover:bg-[#000] hover:border-[#3F66D9] hover:border-[2px]" onClick={() => handleRemove(index)}>Remove</button>)}
                        <div className="pt-[351px]">
                          {item.productSizes.map((pair, sizeIndex) => (
                            <div>
                              <div key={sizeIndex} class="flex bg-[#273041] justify-center relative items-center top-[50px] min-w-[1660px] min-h-[300px] left-[0px] rounded-b-[25px] -mt-[30px]">
                                <div>
                                  <label class="text-[#D2D5B5] text-[26px] absolute top-[50px] left-[230px]">Size</label>
                                  <input type="text" name="size" value={pair.size} placeholder="Product Size" class="absolute top-[100px] left-[140px] text-[18px] w-[250px] h-[50px] rounded-[5px] border-[1px] border-[#D2D5B5] bg-[#404A5E] text-center text-[#fff] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInputSize(index, sizeIndex, e)}></input>
                                  <span class="text-[#E80A0A] absolute top-[160px] text-[18px] left-[200px]">{pair.sizeValid}</span>
                                </div>
                                {item.productSizes.length > 1 && (
                                  <div>
                                    <label class="text-[#D2D5B5] text-[26px] absolute top-[50px] right-[570px]">Price</label>
                                    <input type="text" name="price" placeholder="Product Price" value={pair.price} class="absolute top-[100px] right-[470px] text-[18px] w-[250px] h-[50px] rounded-[5px] border-[1px] border-[#D2D5B5] bg-[#404A5E] text-center text-[#fff] focus:outline-none focus:border-[#F7FF9B] focus:ring-[3px] focus:ring-[#F7FF9B]" onChange={e => handleInputSize(index, sizeIndex, e)}></input>
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
                      </div>
                    </div>
                  ))}
                  {isDetails && (
                    <div>
                      <button type="button" onClick={() => (handleEdit())} class="bg-[#D2D5B5] w-[200px] h-[50px] relative top-[80px] left-[760px] text-center pt-[5px] rounded-[30px] text-[25px] hover:bg-[#fff] hover:border-[#D2D5B5] hover:border-[4px]">Submit</button>
                      <button type="button" class="bg-[#DA4B4B] w-[100px] h-[35px] relative left-[1200px] top-[60px] rounded-[30px] text-[#fff] hover:bg-[#000] hover:border-[#DA4B4B] hover:border-[2px]" onClick={handleAdd}>ADD</button>
                      <button type="button" className="w-[100px] h-[40px] text-[20px] relative top-[60px] -left-[160px] bg-[#D2D5B2] rounded-[20px] hover:border-[4px] hover:bg-[#fff] hover:border-[#D2D5B2]" onClick={() => { setIsInfo(false); setIsImage(true); setIsDetails(false); }}> Back </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </form>
      </section>
    </div>
  )
}