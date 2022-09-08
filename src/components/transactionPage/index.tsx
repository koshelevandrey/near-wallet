import React from "react";
import iconsObj from "../../assets/icons";
import Header from "../header";
import Icon from "../icon";
import "./index.css";

interface Props {
  amount: number;
  receiver: string;
  hash: string;
}

const TransactionPage = ({ amount, receiver, hash }: Props) => {
  return (
    <div className="transactionPageContainer">
      <Header />
      <div className="body">
        <Icon src={iconsObj.transactionIcon} className="icon" />
        <div className="title">Transaction Complete !</div>
        <div className="secondaryTitle">You sent</div>
        <div className="near">{amount} NEAR</div>
        <div className="recipient">
          <a
            target={"_blank"}
            href={`https://explorer.testnet.near.org/transactions/${hash}`}
          >
            {receiver}
          </a>
        </div>
        <button className="btnContinue">Continue</button>
      </div>
    </div>
  );
};

export default TransactionPage;
