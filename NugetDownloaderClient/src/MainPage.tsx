import React, {useState} from 'react';
import {Autocomplete, Box, Button, Container, LinearProgress, Paper, TextField, Typography} from "@mui/material";
import axios from "axios";
import DownloadIcon from '@mui/icons-material/Download';

interface Props {
    AUTO_COMPLETE_URL: string
    PACKAGE_CONTENT_URL: string
}

const CustomPaper = (props: any) => {
    return <Paper elevation={10} sx={{backgroundColor: '#1A1A1A'}} {...props} />;
};

function MainPage(props: Props) {

    const {AUTO_COMPLETE_URL, PACKAGE_CONTENT_URL} = props;
    const [packages, setPackages] = useState([]);
    const [versions, setVersions] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

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
        selectedPackage ? getPackageVersions(selectedPackage.toLowerCase()) : setSelectedPackage('');
    }

    const handleClick = () => {
        const downloadPackage = async (): Promise<void> => {
            setIsDownloading(true);
            const response = await axios.post(`/download`,
                {
                    package: selectedPackage,
                    version: selectedVersion
                }, {responseType: 'blob'});
            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedPackage.toLowerCase()}.${selectedVersion}.zip`;
            a.click();
            setIsDownloading(false);
        }
        downloadPackage();
    }

    return (
        <Container component="main" >
            <Box sx={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                <Typography sx={{mt: 5, fontSize: 80, fontWeight: 'bold', color: '#eac367'}}>Epic NuGet Downloader</Typography>
                <Paper sx={{width: 'fit-content', alignItems: 'center', padding: '5rem', display: 'flex', flexDirection: 'column', mt: 5}}>
                    <Autocomplete
                        options={packages}
                        sx={{width: 400}}
                        onInputChange={onInputChangeHandler}
                        onChange={onPackageSelected}
                        PaperComponent={CustomPaper}
                        noOptionsText='No Packages'
                        renderInput={params => <TextField {...params} label='Search Package'/>}
                    />
                    <Autocomplete
                        options={versions}
                        sx={{width: 400, mt: 7.5}}
                        key={selectedPackage}
                        disabled={versions.length === 0 || !selectedPackage}
                        onChange={(event: any, newValue: string | null) => {
                            newValue && setSelectedVersion(newValue);
                        }}
                        PaperComponent={CustomPaper}
                        noOptionsText='No versions'
                        renderInput={params => <TextField {...params} label={selectedPackage ? 'Select Version' : 'Select Package First'}/>}
                    />
                    <Button
                        onClick={handleClick}
                        variant='contained'
                        disabled={!selectedPackage && !selectedVersion}
                        sx={{width: 200, mt: 7.5, fontSize: 20}}>
                        <DownloadIcon sx={{marginRight: '0.5rem'}}/>
                        Download
                    </Button>
                    {isDownloading && <LinearProgress sx={{width: '100%', mt: 7.5}}/>}
                </Paper>
            </Box>
        </Container>
    );
}

export default MainPage;
