// src/components/CouncilsAndOrganizations.js
import React from 'react';
import Addcouncils from './Addcouncils'; // Adjust the import path if necessary
import styles from './Admin.module.css'; // Adjust the import path if necessary

const CouncilsAndOrganizations = ({ councils, showAddCouncilForm, setShowAddCouncilForm }) => {
  return (
    <div>
      <h2>Councils and Organizations</h2>
      <div className={styles.addCouncilButtonContainer}>
        <button
          className={styles.addCouncilButton}
          onClick={() => setShowAddCouncilForm(true)}
        >
          Add New Council
        </button>
      </div>
      <div className={styles.sectionBox}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableCell}>Organization</th>
              <th className={styles.tableCell}>Adviser</th>
              <th className={styles.tableCell}>President</th>
              <th className={styles.tableCell}>Vice-President</th>
              <th className={styles.tableCell}>Secretary</th>
              <th className={styles.tableCell}>Treasurer</th>
              <th className={styles.tableCell}>Auditor</th>
              <th className={styles.tableCell}>P.R.O</th>
              <th className={styles.tableCell}>Representative</th>
            </tr>
          </thead>
          <tbody>
            {councils.length > 0 ? (
              councils.map((council) => (
                <tr key={council.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{council.organization}</td>
                  <td className={styles.tableCell}>{council.adviser}</td>
                  <td className={styles.tableCell}>{council.president}</td>
                  <td className={styles.tableCell}>{council.vicePresident}</td>
                  <td className={styles.tableCell}>{council.secretary}</td>
                  <td className={styles.tableCell}>{council.treasurer}</td>
                  <td className={styles.tableCell}>{council.auditor}</td>
                  <td className={styles.tableCell}>{council.pro}</td>
                  <td className={styles.tableCell}>{council.rep}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.noEvents}>
                  No council available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <Addcouncils
          showAddCouncilForm={showAddCouncilForm}
          setShowAddCouncilForm={setShowAddCouncilForm}
        />
      </div>
    </div>
  );
};

export default CouncilsAndOrganizations;
