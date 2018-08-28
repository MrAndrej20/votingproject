import styled from 'styled-components';

export const LoginPageContainer = styled.div`
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    grid-template-rows: 20% 20% 20% 20% 20%;
    min-height: 100vh;
    background: lightGreen;
`;

export const Header = styled.h2`
    grid-column-start: 3;
    grid-column-end: 4;
    text-align: center;
`;

export const FormWrapper = styled.div`
    grid-row-start: 3;
    grid-row-end: 4;
    grid-column-start: 3;
    grid-column-end: 4;
    width: 100%;
`;

export const FormInput = styled.input`
    width: 100%;  
`;

export const ButtonWrapper = styled.div`
    text-align: center;
`;

export const ErrorMessage = styled.div`
    background-color: lightCoral;  
`;