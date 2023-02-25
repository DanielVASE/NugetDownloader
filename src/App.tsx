import React, {useEffect, useState} from 'react';
import MainPage from "./MainPage";
import axios from "axios";
import {SERVICE_INDEX} from "./consts";

function App() {

  const [AUTO_COMPLETE_URL, set_AUTO_COMPLETE_URL] = useState('');
  const [PACKAGE_CONTENT_URL, set_PACKAGE_CONTENT_URL] = useState('');

  useEffect(() => {
    const fetchUrls = async (): Promise<void> => {
      const urls = (await axios.get(SERVICE_INDEX)).data.resources;
      set_AUTO_COMPLETE_URL(urls.filter((url: any) => url['@type'] === 'SearchAutocompleteService')[0]['@id']);
      set_PACKAGE_CONTENT_URL(urls.filter((url: any) => url['@type'] === 'PackageBaseAddress/3.0.0')[0]['@id']);
    }
    fetchUrls();
  }, []);

  return (
    <MainPage AUTO_COMPLETE_URL={AUTO_COMPLETE_URL} PACKAGE_CONTENT_URL={PACKAGE_CONTENT_URL}/>
  );
}

export default App;
