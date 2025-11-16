import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { BASEAPIURL } from "./constants";

const UserDataContext = createContext([]);
const UserTransactionContext = createContext([]);
const UserListContext = createContext();
const FilteredDataContext = createContext();

export function useData() {
  return useContext(UserDataContext);
}

export function useTransaction() {
  return useContext(UserTransactionContext);
}

export function useList() {
  return useContext(UserListContext);
}

export function useFliterData() {
  return useContext(FilteredDataContext);
}

export const UserContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [usersList, setUsersList] = useState();
  const [transaction, setTransaction] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const getUserData = () => {
    axios.get(`${BASEAPIURL}/users/`).then((res) => {
      const response = res.data;
      setData(response);

      const sortedData = response.sort((a, b) => b._id - a._id);
      const activeUsers = sortedData.slice(0, 6);
      setFilteredData(activeUsers);

      const topTransations = response
        .sort((a, b) => b.profile?.transaction - a.profile?.transaction)
        .slice(0, 6);
      setTransaction(topTransations);

      const processedData = [];
      response.forEach((user) => {
        const newUserObj = {
          _id: user._id,
          username: user.username,
          email: user.email,
          status: user.profile?.status,
          transaction: `$ ${user.profile?.transaction}`,
          profile_pic: user.profile?.profile_pic,
        };
        processedData.push(newUserObj);
      });
      setUsersList(processedData);
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <UserDataContext.Provider value={filteredData}>
      <UserTransactionContext.Provider value={transaction}>
        <UserListContext.Provider value={{ usersList, setUsersList }}>
          {children}
        </UserListContext.Provider>
      </UserTransactionContext.Provider>
    </UserDataContext.Provider>
  );
};
