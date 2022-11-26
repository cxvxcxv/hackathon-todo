import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Tasks.css'

const Tasks = () => {
	const [tasks, setTasks] = useState([]);
	const [usernames, setUsernames] = useState([]);
	const [tags, setTags] = useState("");
	const [task, setTask] = useState("");
	const [deadline, setDeadline] = useState("");
	const [author, setAuthor] = useState("");
	const [inputNumber, setInputNumber] = useState([]);

	const navigate = useNavigate();

	const handleLogOut = () => {
		window.localStorage.removeItem("userId");
		navigate("../login");
	};

	const handleCreateTask = () => {
		const inputs = document.querySelectorAll("#inputs-form input");
		for (let i = 0; i < inputs.length; i++) {
			setUsernames([usernames.push(inputs[i].value)])
		}

		axios
			.post("http://localhost:8080/create", {
				usernames,
				task,
				tags,
				deadline,
				author,
			})
			.then(response => console.log(response.data))
			.catch(e => console.log(e));
	};

	const addInput = () => {
		setInputNumber([...inputNumber, []]);
	};

	useEffect(() => {
		if (!window.localStorage.getItem("userId")) navigate("../login");

		axios
			.post("http://localhost:8080/getUser", {
				id: window.localStorage.getItem("userId"),
			})
			.then(res => {
				axios.get("http://localhost:8080/tasks").then(response => {
					for (let i = 0; i < response.data.length; i++) {
						for (let j = 0; j < response.data[i].usernames.length; j++) {
							if (response.data[i].usernames[j] === res.data.username)
								setTasks([...tasks, response.data[i]]);
						}
					}
				});
			})
			.catch(e => console.log(e));
			console.log("a");
	}, []);

	return (
		<div className="wrapper">
			<h1>Tasks Page</h1>
			<button className="btn__create logOut" onClick={() => handleLogOut()}>
				Log Out
			</button>

			<form id="inputs-form">
				<input placeholder="Usernames" />
				{inputNumber.map((data, index) => (
					<input placeholder="usernames" key={index} />
				))}

				<button className="btn__create" onClick={() => addInput()}>
					addInput
				</button>
				<input placeholder="Tags" onChange={e => setTags(e.target.value)} />
				<button className="btn__create">Add Tags</button>
				<input type="date" onChange={e => setDeadline(e.target.value)} />
				<input placeholder="Author" onChange={e => setAuthor(e.target.value)} />
				<textarea
					placeholder="Task"
					onChange={e => setTask(e.target.value)}
				></textarea>
				<button className="btn__create" onClick={() => handleCreateTask()}>
					Create Task
				</button>
			</form>

			<div>
				{tasks?.map(task => (
					<div key={task.id}>
						from: {task.author}
						task: {task.task}
					</div>
				))}
			</div>
		</div>
	);
};

export default Tasks;
