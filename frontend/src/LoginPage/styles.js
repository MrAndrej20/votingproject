import styled from 'styled-components';

export const LoginPageContainer = styled.div`
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    grid-template-rows: 20% 20% 20% 20% 20%;
    min-height: 100vh;
    background: #87CEEB;
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

export const VoteMenuContainer = styled.div`
    background-color: #87CEEB;
    min-height: 100vh;
    text-align: center;
    overflow: hidden;
`;

export const PollContainer = styled.div`
    border-style: solid;
    width: 25%;
    height: 300px;
    position: relative;
    left: 38%;
`;

export const Option = styled.div`
    text-align: left;
    word-wrap: break;
`;

export const VoteButtonWrapper = styled.div`
    position: absolute;
    bottom: 2%;
    left: 45%;
`;

export const VoteMessage = styled.div`
    background-color: ${props => props.color};
`;