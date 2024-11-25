import { useSelector } from "react-redux";


const InvoicePage = () => {
  const summary = useSelector((state) => state.invoices);
  
  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    color: "#333",
    padding: "20px",
    backgroundColor: "#f9f9f9",
  };

  const sectionStyle = {
    marginBottom: "30px",
    padding: "15px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  };

  const headingStyle = {
    borderBottom: "2px solid #ddd",
    paddingBottom: "10px",
    marginBottom: "15px",
    fontSize: "1.2em",
    color: "#555",
  };

  const listStyle = {
    listStyleType: "disc",
    paddingLeft: "20px",
  };

  const listItemStyle = {
    marginBottom: "5px",
    lineHeight: "1.5",
  };

  const importantNoteStyle = {
    fontStyle: "italic",
    color: "#666",
    backgroundColor: "#f4f4f4",
    padding: "10px",
    borderRadius: "5px",
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <h3 style={headingStyle}>Invoice Details:</h3>
        <ul style={listStyle}>
          {summary?.invoiceDetails && Object.keys(summary.invoiceDetails).length > 0 ? (
            Object.entries(summary.invoiceDetails).map(([key, value], index) => (
              <li key={index} style={listItemStyle}>
                <strong>{key}:</strong> {value}
              </li>
            ))
          ) : (
            <li style={listItemStyle}>No invoice details available.</li>
          )}
        </ul>
      </div>


      <div style={sectionStyle}>
        <h3 style={headingStyle}>Additional Charges:</h3>
        <ul style={listStyle}>
          {summary?.additionalCharges?.length > 0 ? (
            summary.additionalCharges.map((item, index) => (
              <li key={index} style={listItemStyle}>
                {item}
              </li>
            ))
          ) : (
            <li style={listItemStyle}>No additional charges available.</li>
          )}
        </ul>
      </div>

      <div style={sectionStyle}>
        <h3 style={headingStyle}>Taxes:</h3>
        <ul style={listStyle}>
          {summary?.taxes?.length > 0 ? (
            summary.taxes.map((item, index) => (
              <li key={index} style={listItemStyle}>
                {item}
              </li>
            ))
          ) : (
            <li style={listItemStyle}>No tax information available.</li>
          )}
        </ul>
      </div>

      <div style={sectionStyle}>
        <h3 style={headingStyle}>Terms and Conditions:</h3>
        <ul style={listStyle}>
          {summary?.termsAndConditions?.length > 0 ? (
            summary.termsAndConditions.map((item, index) => (
              <li key={index} style={listItemStyle}>
                {item}
              </li>
            ))
          ) : (
            <li style={listItemStyle}>No terms and conditions available.</li>
          )}
        </ul>
      </div>

      <div style={sectionStyle}>
        <h3 style={headingStyle}>Important Note:</h3>
        <p style={importantNoteStyle}>
          {summary?.importantNote || "No additional notes available."}
        </p>
      </div>
    </div>
  );
};

export default InvoicePage;