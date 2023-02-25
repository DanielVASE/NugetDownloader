import React, {Fragment, useState} from 'react';
import {Autocomplete, Button, TextField} from "@mui/material";
import axios from "axios";

interface Props {
    AUTO_COMPLETE_URL: string
    PACKAGE_CONTENT_URL: string
}

function MainPage(props: Props) {

    const {AUTO_COMPLETE_URL, PACKAGE_CONTENT_URL} = props;
    const [packages, setPackages] = useState([]);
    const [versions, setVersions] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState('')
    const [selectedPackage, setSelectedPackage] = useState('')

    const onInputChangeHandler = (event: any, newInputValue: string) => {
        const getAutoComplete = async (newInputValue: string): Promise<void> => {
            const result = await axios.get(`${AUTO_COMPLETE_URL}?q=${newInputValue}&prerelease=true`);
            setPackages(result.data.data);
        }
        newInputValue ? getAutoComplete(newInputValue) : setPackages([]);
    }

    const onPackageSelected = (event: any, selectedPackage: string | null) => {
        const getPackageVersions = async (selectedPackage: string): Promise<void> => {
            const result = await axios.get(`${PACKAGE_CONTENT_URL}${selectedPackage}/index.json`);
            setSelectedPackage(selectedPackage);
            setVersions(result.data.versions.reverse());
        }
        selectedPackage && getPackageVersions(selectedPackage.toLowerCase());
    }

    const handleClick = () => {
        const downloadPackage = async (): Promise<void> => {
            const response = await axios.get(`${PACKAGE_CONTENT_URL}${selectedPackage}/${selectedVersion}/${selectedPackage}.nuspec`,
                {responseType: 'blob'});
            // create file link in browser's memory
            const href = URL.createObjectURL(response.data);

            // create "a" HTML element with href to file & click
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', `${selectedPackage}.${selectedVersion}.nuspec`); //or any other extension
            document.body.appendChild(link);
            link.click();

            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        }
        downloadPackage();
    }

    const getDependencies = async () => {
         const response = await axios.get(`https://api.nuget.org/v3/registration5-semver1/${selectedPackage}/${selectedVersion}.json`);

    }

    return (
    <Fragment>
        <Autocomplete
            options={packages}
            onInputChange={onInputChangeHandler}
            onChange={onPackageSelected}
            sx={{width: 300}}
            noOptionsText='No Packages'
            renderInput={params => <TextField {...params} variant='standard'/>}
        />
        <Autocomplete
            options={versions}
            sx={{width: 300}}
            disabled={versions.length === 0}
            onChange={(event: any, newValue: string | null) => {
                newValue && setSelectedVersion(newValue)
            }}
            noOptionsText='No versions'
            renderInput={params => <TextField {...params} variant='standard'/>}
        />
        <Button onClick={handleClick}>Download</Button>
    </Fragment>
);
}

export default MainPage;
