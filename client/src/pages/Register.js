import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Register = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isAlreadyExists, setIsAlreadyExists] = useState(false);
	const [isRegistered, setIsRegistered] = useState(false);
	const [isEmpty, setIsEmpty] = useState(false);

	const navigate = useNavigate();

	const createUser = () => {
		if (isRegistered) return;
		if (!username.trim() || !password.trim()) return setIsEmpty(true);
		setIsAlreadyExists(false);
		setIsEmpty(false);
		axios
			.post("http://localhost:8080/register", { username: username.trim(), password: password.trim() })
			.then(response => {
				if (response.data === "You already have an account") {
					setIsAlreadyExists(true);
					return;
				}
				window.localStorage.setItem("userId", response.data.id);
				setIsRegistered(true);
				setTimeout(() => {
					navigate("../tasks");
				}, 3000);
			})
			.catch(e => console.log(e));
	};

	return (
		<>
			<div className="wrapper">
			<h1>Sign Up</h1>
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
			<button onClick={() => createUser()}>Sign Up</button>
			<Link to="/login">Login</Link>
			{isAlreadyExists && <p>This user already exists</p>}
			{isEmpty && <p>fields must not be empty or contain spaces around</p>}
			{isRegistered && (
				<p>
					You have been successfully registered, redirecting to tasks page in 3
					seconds
				</p>
			)}
		</div>
		<img src="background.svg" className="background" alt="background" />
		</>
	);
};

export default Register;
