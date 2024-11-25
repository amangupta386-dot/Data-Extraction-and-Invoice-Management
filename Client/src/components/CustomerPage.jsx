
import { useSelector } from "react-redux";

const CustomerPage = () => {

    const summary = useSelector((state) => state.customers || state?.customers?.items);

    if (!summary || Object.keys(summary).length === 0) {
        return <p style={{ color: "#555", fontStyle: "italic" }}>No data available.</p>;
    }

    const invoices = summary?.invoices || summary || []; // Extract invoices
    const summaryData = summary?.summary || {}; // Extract summary

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
    };

    const thStyle = {
        backgroundColor: "#f4f4f4",
        border: "1px solid #ddd",
        padding: "8px",
        textAlign: "left",
    };

    const tdStyle = {
        border: "1px solid #ddd",
        padding: "8px",
    };

    const renderInvoiceItems = (invoices) => (
        <div style={{ marginBottom: "40px" }}>
            <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>Invoice Details</h3>
            {invoices.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Invoice Number</th>
                            <th style={thStyle}>Invoice Date</th>
                            <th style={thStyle}>Product Name</th>
                            <th style={thStyle}>Quantity</th>
                            <th style={thStyle}>Price with Tax</th>
                            <th style={thStyle}>Item Total Amount</th>
                            <th style={thStyle}>Tax (%)</th>
                            <th style={thStyle}>Customer Name</th>
                            <th style={thStyle}>Company</th>
                            <th style={thStyle}>Phone Number</th>
                            <th style={thStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice, invoiceIndex) =>
                            invoice?.items?.map((item, itemIndex) => (
                                <tr key={`${invoiceIndex}-${itemIndex}`}>
                                    <td style={tdStyle}>{invoice.invoiceNumber || "N/A"}</td>
                                    <td style={tdStyle}>{invoice.invoiceDate || "N/A"}</td>
                                    <td style={tdStyle}>{item.productName || "N/A"}</td>
                                    <td style={tdStyle}>{item.qty || "N/A"}</td>
                                    <td style={tdStyle}>
                                        ₹{item.priceWithTax ? item.priceWithTax.toLocaleString() : "0.00"}
                                    </td>
                                    <td style={tdStyle}>
                                        ₹{item.itemTotal ? item.itemTotal.toLocaleString() : "0.00"}
                                    </td>
                                    <td style={tdStyle}>{item.taxPercentage || "0"}%</td>
                                    <td style={tdStyle}>{invoice.customer?.name || invoice.partyName || "N/A"}</td>
                                    <td style={tdStyle}>{invoice.customer?.company || invoice.partyCompanyName || "N/A"}</td>
                                    <td style={tdStyle}>{invoice.customer?.phone || invoice.phoneNumber || "N/A"}</td>
                                    <td style={tdStyle}>{invoice.status || "N/A"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            ) : (
                <p style={{ color: "#555", fontStyle: "italic" }}>No invoice details available.</p>
            )}
        </div>
    );

    const renderSummary = (summaryData) => (
        <div>
            <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>Summary</h3>
            {Object.keys(summaryData).length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Label</th>
                            <th style={thStyle}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(summaryData).map(([key, value], index) => (
                            <tr key={index}>
                                <td style={tdStyle}>{key || "N/A"}</td>
                                <td style={tdStyle}>
                                    ₹{value ? value.toLocaleString() : "0.00"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ color: "#555", fontStyle: "italic" }}>No summary data available.</p>
            )}
        </div>
    );

    return (
        <div style={{ fontFamily: "Arial, sans-serif", color: "#333", padding: "20px", backgroundColor: "#f9f9f9" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Customer Details</h2>
            {renderInvoiceItems(invoices)}
            {renderSummary(summaryData)}
        </div>
    );
};

export default CustomerPage;