import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {

	// Setting local username and password values from inputs
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isNotFound, setIsNotFound] = useState(false);

	const navigate = useNavigate();

	const handleLogin = () => {
		setIsNotFound(false);
		axios
			.post("http://localhost:8080/login", { username, password })
			.then(response => {
				if (response.data === "You probably don't have an account.") {
					setIsNotFound(true);
					return;
				}
				window.localStorage.setItem("userId", response.data);
				navigate("../tasks");
			});
	};

	return (
		<>
			<div className="wrapper">
				<h1>Sign In</h1>
				<input
					type="text"
					required
					placeholder="username"
					onChange={e => setUsername(e.target.value)}
				/>
				<input
					type="password"
					required
					placeholder="password"
					onChange={e => setPassword(e.target.value)}
				/>
				<button onClick={() => handleLogin()}>Login</button>
				<Link to="/register">Register</Link>
				{isNotFound && <p>user is not found with such login and password</p>}
			</div>
			<img src="background.svg" className="background" alt="background" />
		</>
	);
};

export default Login;
