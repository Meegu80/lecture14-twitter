import {createGlobalStyle} from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        background-color: black;
        color: white;
    }
    
    a {
        text-decoration: none;
        color: inherit;
    }
    
    input {
        &:focus {
            outline: none;
        }
    }
`;

export default GlobalStyle;