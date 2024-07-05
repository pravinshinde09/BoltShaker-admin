export type ColorCodes = 'primary' | 'primary100' | 'primary200' | 'secondary' | 'gray' | 'gray100' | 'white' | 'black' | 'black100'
    | 'black200' | 'black300' | 'transparentBlack' | 'background' | 'card' | 'text' | 'icon' | 'inputBox' | 'shadowColor';

const lightColors: Record<ColorCodes, string> = {
    primary: '#FC3D0A',
    primary100: "#F83758",
    primary200: "#FFDDD4",
    secondary: '#f9f9f9',
    gray: '#dedede',
    gray100: "#8899A6",
    white: '#fff',
    black: "#000000",
    black100: "#121212",
    black200: '#1f1b24',
    black300: '#C8C8C8',
    transparentBlack: 'rgba(0, 0, 0, 0.5)',
    background: '#fff',
    card: '#fff',
    text: "#000000",
    icon: "#000000",
    inputBox: '#fff',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
}


const darkColors: Record<ColorCodes, string> = {
    primary: '#FC3D0A',
    primary100: "#F83758",
    primary200: "#FFDDD4",
    secondary: '#1f1b24',
    gray: '#dedede',
    gray100: "#8899A6",
    white: '#fff',
    black: "#000000",
    black100: "#121212",
    black200: '#1f1b24',
    black300: '#C8C8C8',
    transparentBlack: 'rgba(0, 0, 0, 0.5)',
    background: "#121212",
    card: '#29232f',
    text: '#fff',
    icon: "#fff",
    inputBox: "#242526",
    shadowColor: '#dedede'
}

export const COLORS = {
    light: lightColors,
    dark: darkColors
}