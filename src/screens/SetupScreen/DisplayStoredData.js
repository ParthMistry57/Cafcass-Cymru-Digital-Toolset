import React, { useEffect, useState } from 'react';

const DisplayStoredData = () => {
    const [storedData, setStoredData] = useState(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('caseSetupData'));
        if (data) {
            setStoredData(data);
        }
    }, []);

    return (
        <div>
            <h1>Retrieved Data</h1>
            {storedData ? (
                <div>
                    <p><strong>First Name:</strong> {storedData.firstName}</p>
                    <p><strong>Last Name:</strong> {storedData.lastName}</p>
                    <p><strong>Date of Birth:</strong> {storedData.dob}</p>
                    <p><strong>Case ID:</strong> {storedData.caseId}</p>
                    <p><strong>Court ID:</strong> {storedData.courtId}</p>
                </div>
            ) : (
                <p>No data found in local storage.</p>
            )}
        </div>
    );
};

export default DisplayStoredData;
