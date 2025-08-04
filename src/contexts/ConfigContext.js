import React, { createContext, useState, useEffect } from "react";
import { fetchConfiguration } from "../api/axios";

const ConfigContext = createContext();

const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    projectName: "",
    adminEmail: "",
    timeZone: "",
    timeFormat: "",
    dateFormat: "",
    currencySign: "",
    vatPercentage: "",
    taxPercentage: "",
    successBox: "",
    errorBox: "",
    warningBox: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchConfigurationData = async () => {
      try {
        const response = await fetchConfiguration();
        const data = response.data;
        
        setConfig({
          projectName: data.settings.project_name,
          adminEmail: data.settings.admin_email,
          timeZone: data.settings.time_zone,
          timeFormat: data.settings.time_format,
          dateFormat: data.settings.date_format,
          currencySign: data.settings.currency_sign,
          vatPercentage: data.settings.vat_percentage,
          taxPercentage: data.settings.tax_percentage,
          successBox: data.settings.success_box,
          errorBox: data.settings.error_box,
          warningBox: data.settings.warning_box,
        });
      } catch (err) {
        console.error("Error fetching configuration:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigurationData();
  }, []);

  return <ConfigContext.Provider value={{ config, loading, error }}>{children}</ConfigContext.Provider>;
};

const useConfig = () => {
  return React.useContext(ConfigContext);
};

export { ConfigProvider, useConfig };
