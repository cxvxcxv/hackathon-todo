import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css'

const Register = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isAlreadyExists, setIsAlreadyExists] = useState(false);
	const [isRegistered, setIsRegistered] = useState(false);

	const navigate = useNavigate();

	const createUser = () => {
		if (isRegistered) return;
		setIsAlreadyExists(false);
		axios
			.post("http://localhost:8080/register", { username, password })
			.then(response => {
				if (response.data === "You already have an account") {
					setIsAlreadyExists(true);
					return;
				}
				window.localStorage.setItem("userId", response.data.id);
				setIsRegistered(true);
				setTimeout(() => {
					navigate("../tasks");
				}, 3000)
			})
			.catch(e => console.log(e));
	};

	return (
		<div>
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
			<div>{isAlreadyExists && <p>This user already exists</p>}</div>
			<div>
				{isRegistered && (
					<p>
						You have been successfully registered, redirecting to tasks page in
						3 seconds
					</p>
				)}
			</div>
			<img src="background.svg" alt=""></img>
		</div>
	);
};

export default Register;
