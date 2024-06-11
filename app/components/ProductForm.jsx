import React, { useState, useCallback } from 'react';
import getFormError from '@/app/lib/getFormError';
import { useFormStatus } from "react-dom";
import { useDropzone } from 'react-dropzone';

function ProductForm({ product, action, errors }) {
  const [productImages, setProductImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 

  const handleImageDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.filter(file => file.type.startsWith('image/'));
    const newImagesWithPreview = newImages.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));

    setProductImages(prevImages => [...prevImages, ...newImages]);
  }, []);

  const removeImage = useCallback((index) => {
    setProductImages(prevImages => prevImages.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setIsLoading(true); 

    const formData = new FormData(event.target);
    productImages.forEach((file) => {
      formData.append('productImages', file);
    });
     await action(formData); 
    
  }, [action, productImages]);

  return (
    <form
      className="w-[500px] p-3 flex flex-col justify-between items-center border border-slate-700 rounded-md"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      {/* Product Name */}
      <div className='w-full flex flex-col gap-2'>
        <label htmlFor="name">Name</label>
        <input
          className='py-2 px-1 border border-slate-600 rounded-md'
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name}
        />
        {errors && getFormError(errors, "name" || "")}
      </div>

      {/* Price in Cents */}
      <div className='w-full flex flex-col gap-2'>
        <label htmlFor="price">Price EUR</label>
        <input
          className='py-2 px-1 border border-slate-600 rounded-md'
          type="number"
          id="price"
          name="price"
          required
          defaultValue={product?.priceInCents}
        />
        {errors && getFormError(errors, "price" || "")}
      </div>

      {/* Quantity */}
      <div className='w-full flex flex-col gap-2'>
        <label htmlFor="quantity">Quantity</label>
        <input
          className='py-2 px-1 border border-slate-600 rounded-md'
          type="number"
          id="quantity"
          name="quantity"
          defaultValue={product?.quantity || 0}
          required
        />
        {errors && getFormError(errors, "quantity" || "")}
      </div>

      {/* Description */}
      <div className='w-full flex flex-col gap-2'>
        <label htmlFor="description">Description:</label>
        <textarea
          className='py-2 px-1 border border-slate-600 rounded-md'
          id="description"
          name="description"
          rows="4"
          required
          defaultValue={product?.description || ""}
        />
        {errors && getFormError(errors, "description")}
      </div>

      {/* Images */}
      <div className='w-full flex flex-col gap-2'>
        <label htmlFor="productImages">Product Images</label>
        <Dropzone onDrop={handleImageDrop} accept="image/*" multiple={true}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: 'dropzone w-full py-2 border border-dashed border-slate-600 rounded-md cursor-pointer' })}>
              <input {...getInputProps()} />
              <p className="text-center">Drag and drop images here, or click to select them</p>
            </div>
          )}
        </Dropzone>
        <div className="flex flex-wrap gap-2 mt-2">
          {productImages.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              <img src={image.preview} alt={`Detail ${index + 1}`} className="w-20 h-20 object-cover bg-[var(--light-gray)]" />
              <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-[15px] h-[15px] flex items-center justify-center">
                <span className='text-[8px]'>X</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
      <button
      className='bg-black text-white w-[400px] mx-auto my-6 py-2 px-1 rounded-md'
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? "Saving..." : "Save"}
    </button>
      </div>
    </form>
  );
}



const Dropzone = ({ onDrop, accept, multiple }) => {
  const onDropAccepted = useCallback((acceptedFiles) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropAccepted,
    accept,
    multiple
  });

  return (
    <div
      {...getRootProps()}
      className={`p-4 border-2 border-dashed rounded-md h-[150px] ${isDragActive ? 'border-green-500' : 'border-gray-300'}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default ProductForm;
