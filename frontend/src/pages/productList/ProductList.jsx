import "./productList.css";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ProductCard from "./ProductCard";

import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASEAPIURL } from "../../constants";

const ProductList = () => {
  const theme = useSelector((state) => state.theme.currentTheme);
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [filterInput, setFilterInput] = useState({
    searchProduct: "",
    statusInput: "All",
  });
  const getProductData = () => {
    axios.get(`${BASEAPIURL}/products/`).then((res) => {
      const response = res.data;
      const requiredFields = [];
      response.forEach((product) => {
        const newProductObj = {
          _id: product._id,
          name: product.name,
          stock: product.stock,
          status: product.status,
          price: `$ ${product.price}`,
          product_pic: product.product_pic,
        };
        requiredFields.push(newProductObj);
      });
      setOriginalData(requiredFields);
      setFilteredData(requiredFields);
    });
  };

  useEffect(() => {
    getProductData();
  }, []);

  const handleDelete = (_id) => {
    axios
      .delete(`${BASEAPIURL}/products/${_id}/`)
      .then((res) => {
        const deleteProduct = originalData.filter((item) => item._id !== _id);
        setFilteredData(deleteProduct);
        setOriginalData(deleteProduct);
        alert("deleted successfully");
      })
      .catch((err) => {
        alert(`Something went wrong ${err}`);
      });
  };

  const onChangeHandler = (e) => {
    const newFilters = { ...filterInput, [e.target.name]: e.target.value };
    setFilterInput(newFilters);
  };

  useEffect(() => {
    const filterUser = originalData.filter((item) => {
      const searchCondition = item.name
        .toLowerCase()
        .includes(filterInput.searchProduct.toLowerCase());

      const statusCondtion =
        filterInput.statusInput === "All" ||
        item.status.toLowerCase() === filterInput.statusInput.toLowerCase();

      return searchCondition && statusCondtion;
    });

    setFilteredData(filterUser);
  }, [filterInput]);

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.3 },
    {
      field: "product",
      headerName: "Product",
      flex: 2,
      renderCell: (params) => {
        return (
          <div className="productList-info">
            <img
              className="productList-img"
              src={params.row.product_pic}
              alt=""
            />
            {params.row.name}
          </div>
        );
      },
    },
    { field: "stock", headerName: "Stock", flex: 0.5 },
    { field: "status", headerName: "Status", flex: 0.5 },
    { field: "price", headerName: "Price", flex: 0.5 },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <div className="action-icons">
            <Link to={"/product/" + params.row._id} className="edit-link">
              <EditIcon
                className={`productList-edit-user ${
                  theme === "dark" && "productList-edit-user-dark"
                }`}
              />
            </Link>
            <DeleteIcon
              className={`productList-delete-user ${
                theme === "dark" && "productList-delete-user-dark"
              }`}
              onClick={() => handleDelete(params.row._id)}
            />
          </div>
        );
      },
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="product-table">
      <div className="userpage-topbar">
        <div
          className={`flex alignCenter justifySpaceBetween tableHeaderContainer ${
            theme === "dark" && "tableHeaderContainer-dark"
          }`}
        >
          <h3 className="page-title user-title">Product List</h3>
          <div className="flex alignCenter tableFilterContainer">
            <div
              className={`searchBarContainer ${
                theme === "dark" && "searchBarContainer-dark"
              }`}
            >
              <SearchIcon className="searchIcon" />
              <input
                className={`tableFilterContainer__search tableFilterContainer__filter ${
                  theme === "dark" && "tableFilterContainer__filter-dark"
                }`}
                type="search"
                placeholder="Search Product"
                name="searchProduct"
                value={filterInput.searchProduct}
                onChange={onChangeHandler}
              />
            </div>
            <div className="status-info">
              <label>Status</label>
              <select
                className={`status tableFilterContainer__filter ${
                  theme === "dark" && "tableFilterContainer__filter-dark"
                }`}
                name="statusInput"
                value={filterInput.statusInput}
                onChange={onChangeHandler}
              >
                <option value="All">All</option>
                <option value="In_stock">In stock</option>
                <option value="Out_of_stock">Out of stock</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
            <button
              className={`addButton ${theme === "dark" && "addButton-dark"}`}
              onClick={() => {
                navigate("/newproduct");
              }}
            >
              <PostAddIcon />
            </button>
          </div>
        </div>
      </div>

      <Paper
        className="product-table-main-container"
        sx={{
          height: 630,
          width: "100%",
          border: `1px solid ${theme === "light" ? "#ddd" : "rgb(56, 56, 56)"}`,
          borderRadius: theme === "light" ? "16px" : "",
          boxShadow: theme === "light" && "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ "&, [class^=MuiDataGrid]": { border: "none" } }}
          getRowId={(row) => row._id}
        />
      </Paper>
      <ProductCard data={filteredData} handleDelete={handleDelete} />
    </div>
  );
};

export default ProductList;
