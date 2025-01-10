import React from 'react';
import './investors.css'
function InvestorPage() {
  return (
    <div className='test'>
      <h1>Investor Dashboard</h1>
      <iframe
        title="Defy'25_Harvifi"
        width="1000"
        height="541.25"
        marginTop = "100"
        margin
        src="https://app.powerbi.com/reportEmbed?reportId=ed990e8e-d7d6-48b1-95ca-30c7ef32a709&autoAuth=true&ctid=d4963ce2-af94-4122-95a9-644e8b01624d"
        frameBorder="0"
        allowFullScreen = "true"
      ></iframe>
    </div>
  );
}

export default InvestorPage;