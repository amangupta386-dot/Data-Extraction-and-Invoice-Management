import { useSelector } from "react-redux";

const ProductPage = () => {

    const summary = useSelector((state) => state.products);

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
        fontSize: "1.5em",
    };

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

    const renderItemsPurchased = (items) => {
        if (!items || items.length === 0) return null;

        return (
            <div style={sectionStyle}>
                <h3 style={headingStyle}>Items Purchased</h3>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Item Name</th>
                            <th style={thStyle}>Quantity</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>Discount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td style={tdStyle}>{item?.itemName}</td>
                                <td style={tdStyle}>{item?.quantity}</td>
                                <td style={tdStyle}>₹{item?.price?.toLocaleString()}</td>
                                <td style={tdStyle}>{item?.discountedPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div style={containerStyle}>

            {/* Store and Customer Details */}
            <div style={sectionStyle}>
                <h3 style={headingStyle}>Store Details</h3>
                <p><strong>Store:</strong> {summary?.store}</p>
                <p><strong>Location:</strong> {summary?.location}</p>
                <p><strong>GSTIN:</strong> {summary?.gstin}</p>
                <p><strong>Mobile:</strong> {summary?.mobile}</p>
            </div>

            <div style={sectionStyle}>
                <h3 style={headingStyle}>Customer Details</h3>
                <p><strong>Name:</strong> {summary?.customerName}</p>
                <p><strong>Bill No:</strong> {summary?.billNo || "N/A"}</p>
                <p><strong>Date:</strong> {summary?.date}</p>
            </div>

            {/* Items Purchased */}
            {renderItemsPurchased(summary?.itemsPurchased)}

            {/* Taxes and Total Amount */}
            <div style={sectionStyle}>
                <h3 style={headingStyle}>Tax Details</h3>
                <p><strong>IGST:</strong> {summary?.igst}</p>
                <p><strong>Total Amount:</strong> ₹{summary?.totalAmount?.toLocaleString()}</p>
            </div>
        </div>
    );
};

export default ProductPage;
