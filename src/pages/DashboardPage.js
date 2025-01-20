import React from "react";
import Layout from "../layout/Layout";
import MainContent from "../pages/MainContent";

const DashboardPage = () => {
  const [cartTotal, setCartTotal] = React.useState(0);

  const updateCartTotal = (total) => {
    setCartTotal(total);
  };

  return (
    <Layout cartTotal={cartTotal}>
      <MainContent updateCartTotal={updateCartTotal} />
    </Layout>
  );
};

export default DashboardPage;