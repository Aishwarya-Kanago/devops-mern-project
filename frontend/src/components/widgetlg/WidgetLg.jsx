import React from "react";
import "./widgetlg.css";
import { useTransaction } from "../../UserContext";
import { useSelector } from "react-redux";

const WidgetLg = () => {
  const transactionData = useTransaction();
  const theme = useSelector((state) => state.theme.currentTheme);

  const Button = ({ type }) => {
    return (
      <button className={"widgetlg-btn widgetlg-btn" + type}>{type}</button>
    );
  };
  return (
    <div
      className={`latest-transactions ${
        theme === "dark" && "latest-transactions-dark"
      }`}
    >
      <div className="widgetlg-title">
        <h3 className="sub-title">Lastest Transactions</h3>
      </div>
      <div className="table-for-transactions">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          {transactionData.map((user, idx) => {
            return (
              <tbody key={idx}>
                <tr>
                  <td>
                    <div className="customer-name">
                      <img
                        src={user.profile?.profile_pic}
                        alt="customer-picture"
                      />
                      <span>{`${user.first_name} ${user.last_name}`}</span>
                    </div>
                  </td>
                  <td>
                    {user.profile?.account_open_date
                      ? new Date(parseInt(user.profile?.account_open_date))
                          .toISOString()
                          .split("T")[0]
                      : ""}
                  </td>
                  <td>$ {user.profile?.transaction}</td>
                  <td>
                    <Button type={user.profile?.transaction_status} />
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default WidgetLg;
