import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css'

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isNotFound, setIsNotFound] = useState(false);

	const navigate = useNavigate();

	const setValue = (type, value) => {
		switch (type) {
			case "username":
				setUsername(value);
				break;
			case "password":
				setPassword(value);
				break;
			default:
				break;
		}
	};

	const handleLogin = () => {
		setIsNotFound(false);
		axios.post("http://localhost:8080/login", {username, password})
		.then(response => {
			if (response.data === "You probably don't have an account.") {
				setIsNotFound(true);
				return;
			}
			window.localStorage.setItem("userId", response.data);
			navigate("../tasks");
		})
	}

	return (
		<div>
			<div className="wrapper">
				<h1>Sign In</h1>
				<input
					type="text"
					required
					placeholder="username"
					onChange={e => setValue("username", e.target.value)}
				/>
				<input
					type="password"
					required
					placeholder="password"
					onChange={e => setValue("password", e.target.value)}
				/>
				<button onClick={() => handleLogin()}>Login</button>
				{isNotFound && <p>user is not found</p>}
			</div>
			<img src="background.svg" alt="" />
		</div>
	);
};

export default Login;
