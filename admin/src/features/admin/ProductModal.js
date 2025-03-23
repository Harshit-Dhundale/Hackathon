// client/src/features/admin/ProductModal.js
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import api from "../../utils/api";
import "./ProductModal.css";

const modalRoot = document.getElementById("modal-root");

const ProductModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  subCategories
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    subCategory: "",
    stock: "",
    quantityUnit: "unit",
    quantityValue: 1,
    specifications: {
      weight: "",
      composition: "",
      usageInstructions: "",
      suitableFor: ""
    }
  });
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        ...initialData,
        specifications: initialData.specifications || {
          weight: "",
          composition: "",
          usageInstructions: "",
          suitableFor: ""
        }
      });
      setImagePreview(initialData.imageUrl);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "",
      subCategory: "",
      stock: "",
      quantityUnit: "unit",
      quantityValue: 1,
      specifications: {
        weight: "",
        composition: "",
        usageInstructions: "",
        suitableFor: ""
      }
    });
    setImagePreview("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.specifications) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [name]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = async (file) => {
    const formPayload = new FormData();
    formPayload.append("image", file);
    
    try {
      setUploadingImage(true);
      const response = await api.post("/upload", formPayload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
      setUploadError("");
    } catch (err) {
      setUploadError("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    handleFileUpload(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{initialData ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="product-modal-form">
          <div className="form-columns">
            <div className="form-column">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {Object.keys(subCategories).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {formData.category && (
                <div className="form-group">
                  <label>Subcategory:</label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {subCategories[formData.category].map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Specifications Section */}
              <div className="specifications-section">
                <h3>Product Specifications (Optional)</h3>
                <div className="form-group">
                  <label>Weight:</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.specifications.weight}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Composition:</label>
                  <input
                    type="text"
                    name="composition"
                    value={formData.specifications.composition}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Usage Instructions:</label>
                  <textarea
                    name="usageInstructions"
                    value={formData.specifications.usageInstructions}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Suitable For:</label>
                  <input
                    type="text"
                    name="suitableFor"
                    value={formData.specifications.suitableFor}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Price (₹):</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantity Unit:</label>
                <select
                  name="quantityUnit"
                  value={formData.quantityUnit}
                  onChange={handleChange}
                  required
                >
                  <option value="kg">Kilogram</option>
                  <option value="liter">Liter</option>
                  <option value="packet">Packet</option>
                  <option value="bag">Bag</option>
                  <option value="bottle">Bottle</option>
                  <option value="unit">Unit</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantity Value:</label>
                <input
                  type="number"
                  name="quantityValue"
                  min="1"
                  value={formData.quantityValue}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Image:</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <div className="uploading-overlay">Uploading...</div>}
                  {uploadError && <div className="error-text">{uploadError}</div>}
                  {imagePreview && (
                    <div className="modal-image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn" disabled={uploadingImage}>
              {initialData ? "Update Product" : "Add Product"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    modalRoot
  );
};

export default ProductModal;