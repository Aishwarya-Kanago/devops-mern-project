import React, { useEffect, useState } from "react";
import "./userList.css";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useList } from "../../UserContext";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UserCard from "./UserCard";
import { useSelector } from "react-redux";
import { BASEAPIURL } from "../../constants";

const UserList = () => {
  const theme = useSelector((state) => state.theme.currentTheme);
  const navigate = useNavigate();
  const { usersList: userList, setUsersList } = useList();
  const [originalData, setOriginalData] = useState(userList);
  const [filteredData, setFilteredData] = useState([]);

  const [filterInput, setFilterInput] = useState({
    searchUSer: "",
    statusInput: "All",
  });

  useEffect(() => {
    setOriginalData(userList);
    setFilteredData(userList);
  }, [userList]);

  const handleDelete = (_id) => {
    axios
      .delete(`${BASEAPIURL}/users/${_id}/`)
      .then((res) => {
        const newData = originalData?.filter((item) => item._id !== _id);
        setUsersList(newData);
        alert("deleted successfully");
        window.location.reload();
      })
      .catch((err) => {
        alert(`Something went wrong : ${err}`);
      });
  };

  const onChangeHandler = (e) => {
    const newFilters = { ...filterInput, [e.target.name]: e.target.value };
    setFilterInput(newFilters);
  };

  useEffect(() => {
    const filterUser = originalData?.filter((item) => {
      const searchCondition =
        item.username
          .toLowerCase()
          .includes(filterInput.searchUSer.toLowerCase()) ||
        item.email.toLowerCase().includes(filterInput.searchUSer.toLowerCase());
      const statusCondtion =
        filterInput.statusInput === "All" ||
        item.status.toLowerCase() === filterInput.statusInput.toLowerCase();

      return searchCondition && statusCondtion;
    });

    setFilteredData(filterUser);
  }, [filterInput]);

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.3, borderRadius: "16px" },
    {
      field: "user",
      headerName: "User name",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="userList-info">
            <img className="userList-img" src={params.row.profile_pic} alt="" />
            {params.row.username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "status", headerName: "Status", flex: 0.5 },
    { field: "transaction", headerName: "Transaction", flex: 0.5 },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      borderRadius: "16px",
      renderCell: (params) => {
        return (
          <div className="action-icons">
            <Link to={"/user/" + params.row._id} className="edit-link">
              <EditIcon
                className={`userList-edit-user ${
                  theme === "dark" && "userList-edit-user-dark"
                }`}
              />
            </Link>
            <DeleteIcon
              className={`userList-delete-user ${
                theme === "dark" && "userList-delete-user-dark"
              } `}
              onClick={() => handleDelete(params.row._id)}
            />
          </div>
        );
      },
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="data-table">
      <div className="userpage-topbar">
        <div
          className={`flex alignCenter justifySpaceBetween tableHeaderContainer ${
            theme === "dark" && "tableHeaderContainer-dark"
          }`}
        >
          <h3 className="page-title user-title">Users</h3>
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
                placeholder="Search User"
                name="searchUSer"
                value={filterInput.searchUSer}
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button
              className={`addButton ${theme === "dark" && "addButton-dark"}`}
              onClick={() => {
                navigate("/newUser");
              }}
            >
              <PersonAddIcon />
            </button>
          </div>
        </div>
      </div>

      <Paper
        className="user-table"
        sx={{
          height: 630,
          width: "100%",
          border: `2px solid ${theme === "light" ? "#ddd" : "rgb(56, 56, 56)"}`,
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
          sx={{
            "&, [class^=MuiDataGrid]": { border: "none" },
          }}
          getRowId={(row) => row._id}
        />
      </Paper>
      <UserCard data={filteredData} handleDelete={handleDelete} />
    </div>
  );
};

export default UserList;
