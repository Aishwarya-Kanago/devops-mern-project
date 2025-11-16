import axios from "axios";
import "./newProduct.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASEAPIURL } from "../../constants";

const NewProduct = () => {
  const navigate = useNavigate();
  const [newProduct, setnewProduct] = useState({});
  const theme = useSelector((state) => state.theme.currentTheme);

  const onChangeProduct = (e) => {
    const currentProduct = { ...newProduct };
    let inputValue = e.target.value;

    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        const localImageUrl = URL.createObjectURL(file);
        currentProduct[e.target.name] = localImageUrl;
        setnewProduct(currentProduct);
      }
      return;
    }

    if (e.target.name === "created_at") {
      inputValue = new Date(inputValue).getTime();
    }

    currentProduct[e.target.name] = inputValue;
    setnewProduct(currentProduct);
  };

  const createProduct = () => {
    axios
      .post(`${BASEAPIURL}/products/`, newProduct)
      .then((res) => {
        if (res.status === 201) {
          alert("Product created Sucessfully");
          navigate(`/products/`);
          window.location.reload();
        }
      })
      .catch((err) => {
        const res = err.response;
        const error_key = Object.keys(res.data)[0];
        const error_message = res.data[error_key];
        alert(`${error_key}:${error_message}`);
      });
  };

  return (
    <div className="newproduct">
      <div className="newproduct-title">
        <h1>New Product</h1>
      </div>
      <div className="newuser-form">
        <div
          className={`newuser-item ${theme === "dark" && "newuser-item-dark"}`}
        >
          <label htmlFor="file">Image</label>
          <input
            type="file"
            id="file"
            onChange={onChangeProduct}
            name="product_pic"
          />
        </div>
        <div className="newuser-item">
          <label>Name</label>
          <input
            type="text"
            placeholder="Apple Airpods"
            name="name"
            onChange={onChangeProduct}
          />
        </div>
        <div className="newuser-item">
          <label>Description</label>
          <input
            type="textarea"
            placeholder="Description"
            name="description"
            onChange={onChangeProduct}
          />
        </div>
        <div className="newuser-item">
          <label>Price $</label>
          <input
            type="text"
            placeholder="220"
            onChange={onChangeProduct}
            name="price"
          />
        </div>
        <div className="newuser-item">
          <label>Stock</label>
          <input
            type="text"
            placeholder="123"
            onChange={onChangeProduct}
            name="stock"
          />
        </div>
        <div className="newuser-item">
          <label>Status</label>
          <select
            name="status"
            id="status"
            className="active-options"
            onChange={onChangeProduct}
          >
            <option>in_stock</option>
            <option>out_of_stock</option>
            <option>discontinued</option>
          </select>
        </div>
        <div className="newuser-item">
          <label>Product Created At</label>
          <input
            type="date"
            placeholder="10.10.2022"
            name="created_at"
            onChange={onChangeProduct}
          />
        </div>
        <div className="newuser-item">
          <label>Sales</label>
          <input
            type="text"
            placeholder="5000"
            onChange={onChangeProduct}
            name="sales"
          />
        </div>
        <div className="newuser-item">
          <label>Active</label>
          <select
            name="active"
            id="active"
            className="active-options"
            onChange={onChangeProduct}
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
      </div>
      <button className="newuser-create-btn" onClick={createProduct}>
        Create
      </button>
    </div>
  );
};

export default NewProduct;
