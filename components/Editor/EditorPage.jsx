"use client";
import React from "react";

function EditorPage({
  design,
  image,
  setImage,
  images,
  setImages,
  showCrop,
  setShowCrop,
  cropedPic,
  setCropedPic,
}) {
  return (
    <div className=" w-full bg-white shadow-md rounded-md p-2 border-dashed border-2 border-gray-300 h-full flex flex-col gap-3    ">
      {(!showCrop && (
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-center">
            Customise <span className="capitalize ">{design.title}</span>
          </h1>
          <p className="text-gray-400 text-center">
            Customise your {design.title} with your own design
          </p>
          {/* write a short description */}
          <p className="text-gray-700 ">
            How to customise your {design.title}? <br />
            1. Click on the upload button below <br />
            2. Upload your image <br />
            3. Resize and adjust the image <br />
            4. Click on the Order button <br />
            5. Fill in the details and place the order
          </p>
          {/* images */}
          <div className="flex gap-2 flex-col">
            {!!image && (
              <div className="flex flex-col">
                <p className="text-gray-900">Choosen Design</p>
                <img
                  src={URL.createObjectURL(image)}
                  alt="custom"
                  className="w-20 h-20 object-contain border border-transparent"
                />
              </div>
            )}
            {images.length !== 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-gray-900">Your Photos</p>
                <div className="flex flex-wrap gap-3">
                  {images.map((img, index) => (
                    <img
                      onClick={() => {
                        setImage(img);
                        setShowCrop(true);
                      }}
                      key={index}
                      src={URL.createObjectURL(img)}
                      alt="custom"
                      className="w-20 h-20 object-contain border border-transparent"
                      style={{
                        border:
                          image === img
                            ? "2px solid blue"
                            : "2px solid transparent",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-center items-center p-5 border-dashed rounded-md ">
            <input
              onChange={(e) => {
                if (e.target.files.length === 0) return;
                setImage(e.target.files[0]);
                setImages([...images, e.target.files[0]]);
                setShowCrop(true);
              }}
              type="file"
              id="file"
              accept="image/*"
              className="hidden"
            />
            <label
              htmlFor="file"
              className="
                  bg-blue-400 text-white px-5 py-2 rounded-md cursor-pointer
                  "
            >
              Upload Image
            </label>
            <button
              className="
                  bg-red-400 text-white px-5 py-2 rounded-md cursor-pointer
                  "
            >
              Order
            </button>
          </div>
        </div>
      )) || (
        <div
          className="
           bg-white shadow-md rounded-md p-5 flex flex-col gap-5
           "
        >
          <h1 className="text-2xl font-bold text-center">Crop Image</h1>
          <div
            className="
               w-full h-[500px] bg-gray-100 flex items-center justify-center
               "
          >
            <CropImage
              image={image}
              aspect={design.aspect}
              setCropedPic={setCropedPic}
              setShowCrop={setShowCrop}
            />
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                setImage(cropedPic);
                setShowCrop(false);
              }}
              className="
                   bg-blue-400 text-white px-5 py-2 rounded-md cursor-pointer
                   "
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowCrop(false);
              }}
              className="
                   bg-red-400 text-white px-5 py-2 rounded-md cursor-pointer
                   "
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditorPage;
