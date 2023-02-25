import { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#eac367',
        },
        background: {
            default: '#393939',
            paper: '#393939',
        },
        text: {
            primary: '#fafafa',
            secondary: '#ffebee',
            disabled: '#ffebee',
        },
    },
};

export const SERVICE_INDEX = 'https://api.nuget.org/v3/index.json';