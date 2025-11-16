import "./product.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chart from "../chart/Chart";
import { productData } from "../../UserData";
import CreateIcon from "@mui/icons-material/Create";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASEAPIURL } from "../../constants";

const Product = () => {
  const [product, setProduct] = useState({});
  const { productId } = useParams();
  const theme = useSelector((state) => state.theme.currentTheme);

  const getProductData = () => {
    axios.get(`${BASEAPIURL}/products/${productId}/`).then((res) => {
      const response = res.data;
      setProduct(response);
    });
  };

  useEffect(() => {
    getProductData();
  }, []);

  const onChangeHandler = (e) => {
    const newProduct = { ...product };

    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        const localImageUrl = URL.createObjectURL(file);
        newProduct[e.target.name] = localImageUrl;
        setProduct(newProduct);
      }
      return;
    }

    newProduct[e.target.name] = e.target.value;
    setProduct(newProduct);
  };

  const updateHandler = (e) => {
    axios.put(`${BASEAPIURL}/products/${productId}/`, product).then((res) => {
      if (res.status == 200) {
        alert("Product updated Sucessfully");
      }
    });
  };

  return (
    <div className="product">
      <div className="product-title-container">
        <h1 className="page-title">Product</h1>
      </div>
      <div className="product-top">
        <div
          className={`user-main-info product-col-1 ${
            theme === "dark" && "product-col-1-dark"
          }`}
        >
          <div className="profile-pic-container">
            <img
              src={product.product_pic}
              alt="user-img"
              className="product-img"
            />
            <div className="edit-profile-pic">
              <label
                htmlFor="file"
                className={`edit-icon ${theme === "dark" && "edit-icon-dark"}`}
              >
                <CreateIcon />
              </label>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                name="product_pic"
                onChange={onChangeHandler}
              />
            </div>
          </div>
          <div className="user-details product-details">
            <div className="tags">
              <span className="tag">{product.status}</span>
              <span className="tag">
                {product.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex alignCenter product-name-price">
              <p className="name">{product?.name}</p>
              <p className="price">${product?.price}</p>
            </div>
            <textarea
              name="description"
              className="description"
              value={product?.description}
              rows={3}
              onChange={onChangeHandler}
              cols={70}
            />
          </div>
        </div>
        <div className="product-col-2">
          <div
            className={`edit-userinfo product-edit-container ${
              theme === "dark" && "product-edit-container-dark"
            }`}
          >
            <form className="product-edit-form">
              <div className="user-info-input-flex">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Apple AirPod"
                  name="name"
                  value={product.name}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="user-info-input-flex">
                <label>Sales</label>
                <input
                  type="text"
                  placeholder="2200"
                  name="sales"
                  value={product.sales}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="user-info-input-flex">
                <label>Stock</label>
                <input
                  type="text"
                  placeholder="220"
                  name="stock"
                  value={product.stock}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="user-info-input-flex">
                <label>Price</label>
                <input
                  type="text"
                  placeholder="220"
                  name="price"
                  value={`${product.price}`}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="user-info-input-flex">
                <label>Status</label>
                <select
                  name="status"
                  className="active-options"
                  value={product.status}
                  onChange={onChangeHandler}
                >
                  <option>in_Stock</option>
                  <option>out_of_stock</option>
                  <option>discontinued</option>
                </select>
              </div>
              <div className="user-info-input-flex">
                <label>Active</label>
                <select
                  name="active"
                  id="active"
                  className="active-options"
                  value={product.active}
                  onChange={onChangeHandler}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </form>

            <button
              type="submit"
              className="update-btn product-update-btn"
              onClick={updateHandler}
            >
              Update
            </button>
          </div>
          <div className="product-sales-chart">
            <Chart
              data={productData}
              datakey="Sales"
              title="Sales Performance"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
