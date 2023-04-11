import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
`;

const SignUpTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 16px;
`;

const SignUpInput = styled.input`
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 16px;
  width: 100%;
  font-size: 16px;
`;

const SignUpButton = styled.button`
  background-color: #0077cc;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
`;

const SignUpError = styled.p`
  color: red;
  margin-bottom: 16px;
`;

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setErrorMessage("Please enter a username and password");
      return;
    }

    setLoading(true);

    try {

      // Register the user
      await axios.post("http://localhost:8878/api/v1/auth/register", {
        username,
        password,
      });

      alert("Registered");

      // Automatically log in the user after registration
      const authResponse = await axios.post("http://localhost:8878/api/v1/auth/authenticate", {
        username,
        password,
      });

      // Save the token to local storage
      localStorage.setItem("token", authResponse.data.token);
      const tokenExpiration = Date.now() + 30 * 60 * 1000;
      localStorage.setItem('tokenExpiration', tokenExpiration);

      navigate("/home");
    } catch (error) {
      setErrorMessage("Failed to register");
    }

    setLoading(false);
  };

  return (
    <SignUpContainer>
      <SignUpForm onSubmit={handleSubmit}>
        <SignUpTitle>Sign Up</SignUpTitle>
        {errorMessage && <SignUpError>{errorMessage}</SignUpError>}
        <label>
          Username:
          <SignUpInput
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label>
          Password:
          <SignUpInput
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <SignUpButton type="submit" disabled={loading}>
  {loading ? "Loading..." : "Submit"}
</SignUpButton>

        <p className="login-link">Already have an account? <Link to="/auth/login">Log in</Link></p>
        </SignUpForm>
        </SignUpContainer>
  );
}

export default SignUp;
