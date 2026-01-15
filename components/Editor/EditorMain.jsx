"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useCart } from "@/context/cartContext";
import { GetBrandModels, GetCaseTypes } from "@/functions/GetAllPhone";
import CustomDropdown from "@/components/utils/CustomDropdown";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Designs = [
  {
    image: "https://i.ibb.co/9n8Yckw/airpods.png",
    title: "airpods",
    aspect: [1, 1],
    id: 1,
    price: 999,
    desc: `Compatible for Apple AirPods 2nd 1st charging case. 0.25mm see-through thin wall allows you to check the indicator status any time. Precise cutouts for easy access to all functions without any interference`,
  },
  {
    image: "https://i.ibb.co/p1td84k/mousepad.png",
    title: "mousepads",
    aspect: [1, 0.43],
    id: 2,
    price: 1150,
  },
  {
    image: "https://i.ibb.co/PrnPTW3/laptop-Sleeves.png",
    title: "laptopsleeves",
    aspect: [1, 1],
    id: 3,
    price: 1150,
  },
  {
    image: "https://i.ibb.co/bNjYR0z/popsocket.png",
    title: "popsockets",
    aspect: [1, 1],
    id: 4,
    price: 150,
  },
  {
    image: "https://i.ibb.co/tYZn2VV/template.png",
    title: "phonecases",
    aspect: [0.52, 1],
    id: 5,
    price: 550,
  },
];

function EditorMain({ id, phone, product }) {
  const [image, setImage] = useState(null);
  const { addItemToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState("");
  const [models, setModels] = useState([]);
  const [model, setModel] = useState("");
  const [singleModel, setSingleModel] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);
  const [caseTypes, setCaseTypes] = useState([]);
  const [laptopSize, setLaptopSize] = useState({
    height: 0,
    width: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const editor = document.getElementById("editor");
    if (!!editor) editor.scrollIntoView({ behavior: "smooth" });
  }, []);

  const design = Designs.find((design) => design?.title === id);
  const imgref = useRef(null);

  // Display all brands (no filtering)
  const filteredBrands = useMemo(() => {
    if (!product || !Array.isArray(product)) {
      return [];
    }
    return product;
  }, [product]);

  // Convert brands to dropdown options
  const brandOptions = useMemo(() => {
    return filteredBrands.map((brand) => ({
      value: brand._id,
      label: brand.name,
    }));
  }, [filteredBrands]);

  // Convert models to dropdown options
  const modelOptions = useMemo(() => {
    return models.map((model) => ({
      value: model._id,
      label: model.name,
    }));
  }, [models]);

  useEffect(() => {
    if (!brand) {
      setModels([]);
      setModel("");
      setSingleModel(null);
      return;
    }

    async function fetchModels() {
      try {
        const brandData = await GetBrandModels(brand);
        const modelsArray = Array.isArray(brandData)
          ? brandData
          : brandData?.models || [];
        const activeModels = modelsArray.filter(
          (item) => item.isActivate === true
        );
        setModels(activeModels);
        setModel("");
        setSingleModel(null);
      } catch (error) {
        console.error("Error fetching models:", error);
        setModels([]);
      }
    }

    fetchModels();
  }, [brand]);

  useEffect(() => {
    if (!!model) {
      const filtered = models.filter((item) => item._id === model);
      const selectedModel = filtered[0];
      setSingleModel(selectedModel);

      async function fetchCaseTypes() {
        if (selectedModel?.caseTypes && selectedModel.caseTypes.length > 0) {
          const firstCaseType = selectedModel.caseTypes[0];
          if (typeof firstCaseType === "object" && firstCaseType._id) {
            setCaseTypes(selectedModel.caseTypes);
            setActiveVariant(firstCaseType._id);
          } else {
            try {
              const fetchedCaseTypes = await GetCaseTypes(
                selectedModel.caseTypes
              );
              if (fetchedCaseTypes && fetchedCaseTypes.length > 0) {
                setCaseTypes(fetchedCaseTypes);
                setActiveVariant(fetchedCaseTypes[0]._id);
              } else {
                setCaseTypes(
                  selectedModel.caseTypes.map((id) => ({
                    _id: id,
                    name: "Case Type",
                    price: selectedModel.price || 0,
                  }))
                );
                setActiveVariant(selectedModel.caseTypes[0]);
              }
            } catch (error) {
              console.error("Error fetching case types:", error);
              setCaseTypes(
                selectedModel.caseTypes.map((id) => ({
                  _id: id,
                  name: "Case Type",
                  price: selectedModel.price || 0,
                }))
              );
              setActiveVariant(selectedModel.caseTypes[0]);
            }
          }
        } else {
          setCaseTypes([]);
          setActiveVariant(null);
        }
      }

      fetchCaseTypes();
    } else {
      setCaseTypes([]);
      setActiveVariant(null);
    }
  }, [model]);

  function addCurrentItemToCart() {
    if (!image) {
      toast.error("Please upload an image");
      return false;
    }
    if (
      id === "laptopsleeves" &&
      (laptopSize.height === 0 || laptopSize.width === 0)
    ) {
      toast.error("Please enter the size of your laptop");
      return false;
    }
    setLoading(true);

    const variant =
      id === "laptopsleeves"
        ? `Height : ${laptopSize?.height} , Width : ${laptopSize?.width} (In Inches)`
        : "Custom Design";

    const itemId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const previewUrl = URL.createObjectURL(image);

    // Get brand name from filteredBrands
    const selectedBrand = filteredBrands.find((b) => b._id === brand);
    const selectedCaseType = caseTypes.find((item) => item._id === activeVariant);

    const data = {
      name: !phone ? design.title : singleModel?.name,
      qty: 1,
      image: previewUrl,
      variant: !phone ? variant : selectedCaseType?.name,
      id: itemId,
      price: !phone ? design.price : selectedCaseType?.price,
      // Additional fields for proper order tracking
      productId: phone ? singleModel?._id : null,
      brandName: phone ? selectedBrand?.name : null,
      modelName: phone ? singleModel?.name : null,
      caseType: phone ? selectedCaseType?.name : null,
      productType: phone ? "phonecase" : design.title,
    };

    const customCaseCoordinates = {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    };

    addItemToCart(data, image, customCaseCoordinates);
    toast.success("Item added to cart");
    setImage(null);
    setLoading(false);
    setActiveVariant(null);
    setLaptopSize({ height: 0, width: 0 });
    return true;
  }

  function handleAddToCart() {
    addCurrentItemToCart();
  }

  function handleBuyNow() {
    const added = addCurrentItemToCart();
    if (added) {
      router.push("/checkout");
    }
  }

  if (!design) return <h1>Design not found</h1>;

  const currentPrice = !activeVariant
    ? design?.price
    : caseTypes.find((item) => item._id === activeVariant)?.price;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link
            href="/"
            className="text-gray-500 hover:text-purple transition-colors duration-200 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </Link>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-gray-900 font-medium capitalize">
            {design?.title}
          </span>
        </nav>

        <div
          id="editor"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Preview Section */}
          <div className="flex flex-col gap-6">
            <div className="relative bg-white rounded-2xl shadow-lg p-6 lg:p-10">
              {/* Main Preview */}
              <div
                className="relative mx-auto overflow-hidden rounded-xl"
                style={{
                  maxWidth: `${design?.aspect[0] * 400}px`,
                }}
              >
                <div
                  className="relative w-full overflow-hidden rounded-xl"
                  style={{
                    backgroundImage:
                      (!!image && `url(${URL.createObjectURL(image)})`) ||
                      "url(https://i.ibb.co/TqJNrL0/custom-Design.png)",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                >
                  <img
                    onDoubleClick={() => {
                      document.getElementById("file").click();
                    }}
                    ref={imgref}
                    src={`${
                      !!singleModel
                        ? singleModel?.templateImg ||
                          "https://i.ibb.co/tYZn2VV/template.png"
                        : design?.image
                    }`}
                    alt="preview"
                    className="w-full object-contain cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Upload hint */}
              {!image && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-2xl pointer-events-none">
                  <div className="text-center p-4 bg-white/90 rounded-xl shadow-sm">
                    <p className="text-gray-600 text-sm">
                      Double-click to upload your design
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Warning Notice */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <svg
                className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm text-amber-800">
                Final product may vary slightly in color and design placement
                due to production processes.
              </p>
            </div>

            {/* Chosen Design Preview */}
            {!!image && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Your design"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    style={{
                      aspectRatio: singleModel?.ratio
                        ? `${singleModel.ratio.width}/${singleModel.ratio.height}`
                        : `${design?.aspect[0]}/${design?.aspect[1]}`,
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Your Design</p>
                    <p className="text-sm text-gray-500">
                      Recommended ratio:{" "}
                      <span className="text-purple font-medium">
                        {singleModel?.ratio
                          ? `${singleModel.ratio.width}:${singleModel.ratio.height}`
                          : `${design?.aspect[0]}:${design?.aspect[1]}`}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setImage(null)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col gap-6">
            {/* Product Header */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 capitalize">
                Custom {design?.title}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl lg:text-4xl font-bold text-purple">
                  Rs. {currentPrice?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="h-px bg-gray-200" />

            {/* Description */}
            {!phone && (
              <div className="prose prose-gray">
                {design?.desc ? (
                  <p className="text-gray-600 leading-relaxed">{design.desc}</p>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      How to customize:
                    </h3>
                    <ol className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple text-white text-sm font-medium rounded-full flex items-center justify-center">
                          1
                        </span>
                        <span>Click upload button below</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple text-white text-sm font-medium rounded-full flex items-center justify-center">
                          2
                        </span>
                        <span>Resize and adjust your image</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple text-white text-sm font-medium rounded-full flex items-center justify-center">
                          3
                        </span>
                        <span>Add to cart or buy now</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple text-white text-sm font-medium rounded-full flex items-center justify-center">
                          4
                        </span>
                        <span>Complete your order</span>
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Laptop Sleeves Size Input */}
            {id === "laptopsleeves" && (
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Laptop Dimensions{" "}
                  <span className="text-red-500 text-sm">(Required)</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Height (inches)
                    </label>
                    <input
                      onChange={(e) => {
                        if (isNaN(e.target.value)) return;
                        setLaptopSize({
                          ...laptopSize,
                          height: e.target.value,
                        });
                      }}
                      defaultValue={laptopSize.height || ""}
                      type="text"
                      placeholder="e.g., 10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Width (inches)
                    </label>
                    <input
                      defaultValue={laptopSize.width || ""}
                      onChange={(e) => {
                        if (isNaN(e.target.value)) return;
                        setLaptopSize({ ...laptopSize, width: e.target.value });
                      }}
                      type="text"
                      placeholder="e.g., 14"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Phone Model Selection */}
            {phone && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Select Your Device
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CustomDropdown
                    options={brandOptions}
                    value={brand}
                    onChange={(value) => setBrand(value)}
                    placeholder="Select Brand"
                    label="Brand"
                    required={true}
                  />
                  <CustomDropdown
                    options={modelOptions}
                    value={model}
                    onChange={(value) => {
                      if (value === "") return;
                      setModel(value);
                    }}
                    placeholder="Select Model"
                    label="Model"
                    required={true}
                    disabled={!brand || modelOptions.length === 0}
                  />
                </div>
              </div>
            )}

            {/* Case Type Selection */}
            {!!phone && !!singleModel && caseTypes.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Choose Case Type
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {caseTypes.map((type, index) => (
                    <button
                      key={type._id || index}
                      onClick={() => setActiveVariant(type._id)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        activeVariant === type._id
                          ? "border-purple bg-purple/5 shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      {activeVariant === type._id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-purple rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                      <span
                        className={`block font-medium ${
                          activeVariant === type._id
                            ? "text-purple"
                            : "text-gray-900"
                        }`}
                      >
                        {type?.name}
                      </span>
                      <span className="block text-sm text-gray-500 mt-1">
                        Rs. {type?.price?.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ratio Display */}
            {!!phone &&
              !!singleModel &&
              singleModel?.ratio &&
              singleModel.ratio.width > 0 &&
              singleModel.ratio.height > 0 && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <svg
                    className="w-5 h-5 text-blue-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Recommended Image Ratio:{" "}
                      <span className="font-bold">
                        {singleModel.ratio.width}:{singleModel.ratio.height}
                      </span>
                    </p>
                    <p className="text-xs text-blue-700">
                      Upload an image with this ratio for best results
                    </p>
                  </div>
                </div>
              )}

            <div className="h-px bg-gray-200" />

            {/* Action Buttons */}
            <div className="space-y-4">
              <input
                disabled={loading}
                onChange={(e) => {
                  if (e.target.files.length === 0) return;
                  setImage(e.target.files[0]);
                }}
                type="file"
                id="file"
                accept="image/*"
                className="hidden"
              />

              {/* Upload Button */}
              <label
                htmlFor="file"
                className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple hover:bg-purple/5 transition-all duration-200 group"
              >
                <div className="p-2 bg-purple/10 rounded-lg group-hover:bg-purple/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-purple"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 22H16C18.8284 22 20.2426 22 21.1213 21.1213C22 20.2426 22 18.8284 22 16V15C22 12.1716 22 10.7574 21.1213 9.87868C20.3431 9.10051 19.1569 9.01406 17 9.00195M7 9.00195C4.84315 9.01406 3.65685 9.10051 2.87868 9.87868C2 10.7574 2 12.1716 2 15V16C2 18.8284 2 20.2426 2.87868 21.1213C3.17848 21.4211 3.54062 21.6186 4 21.7487"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="font-medium text-gray-700 group-hover:text-purple transition-colors">
                  {image ? "Change Image" : "Upload Your Design"}
                </span>
              </label>

              {/* Add to Cart & Buy Now Buttons */}
              {!!image && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 py-4 px-6 bg-white border-2 border-gray-900 text-gray-900 rounded-xl font-semibold hover:bg-gray-900 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    
                    {loading ? "Adding..." : "Add to Cart"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 py-4 px-6 bg-purple text-white rounded-xl font-semibold hover:bg-purple/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      "Processing..."
                    ) : (
                      <>
                        Buy Now
                        
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple/30 rounded-full animate-spin border-t-purple"></div>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              Adding to cart...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditorMain;
