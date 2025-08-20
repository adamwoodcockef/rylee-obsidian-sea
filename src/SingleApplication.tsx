import React from "react";
import styles from "./SingleApplication.module.css";
import { Application } from "./api/interfaces";

const SingleApplication = ({ application }: { application: Application }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className={styles.SingleApplication}>
      <div className={styles.cell}>
        <sub>Company</sub>
        <strong>{application.company}</strong>
      </div>
      <div className={styles.cell}>
        <sub>Name</sub>
        <strong>
          {application.first_name} {application.last_name}
        </strong>
      </div>
      <div className={styles.cell}>
        <sub>Email</sub>
        <a href={`mailto:${application.email}`} className={styles.emailLink}>
          {application.email}
        </a>
      </div>
      <div className={styles.cell}>
        <sub>Loan Amount</sub>
        <strong>{formatCurrency(application.loan_amount)}</strong>
      </div>
      <div className={styles.cell}>
        <sub>Application Date</sub>
        <strong>{formatDate(application.date_created)}</strong>
      </div>
      <div className={styles.cell}>
        <sub>Expiry date</sub>
        <strong>{formatDate(application.expiry_date)}</strong>
      </div>
    </div>
  );
};

export default SingleApplication;
