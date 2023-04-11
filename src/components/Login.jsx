import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
`;

const LoginTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 16px;
`;

const LoginInput = styled.input`
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 16px;
  width: 100%;
  font-size: 16px;
`;

const LoginButton = styled.button`
  background-color: #0077cc;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
`;

const LoginError = styled.p`
  color: red;
  margin-bottom: 16px;
`;

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setErrorMessage("Please enter a username and password");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8899/api/v1/auth/authenticate", {
        username,
        password,
      });

      // Save the token to local storage
      localStorage.setItem("token", response.data.token);
      const tokenExpiration = Date.now() + 30 * 60 * 1000;
      localStorage.setItem('tokenExpiration', tokenExpiration);
      
      navigate("/home");
    } catch (error) {
      setErrorMessage("Invalid username or password");
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Login</LoginTitle>
        {errorMessage && <LoginError>{errorMessage}</LoginError>}
        <label>
          Username:
          <LoginInput
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label>
          Password:
          <LoginInput
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <LoginButton type="submit">Login</LoginButton>
        <Link to="/auth/signup">Don't have an account? Sign up</Link>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;
