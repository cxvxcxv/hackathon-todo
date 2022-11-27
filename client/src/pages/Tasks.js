import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Tasks.css";

const Tasks = () => {
	// Setting all necessary states for further management
	const [tasks, setTasks] = useState([]);
	const [usernames, setUsernames] = useState([]);
	const [tags, setTags] = useState("");
	const [task, setTask] = useState("");
	const [deadline, setDeadline] = useState("");
	const [author, setAuthor] = useState("");
	const [inputNumber, setInputNumber] = useState([]);
	const [isEmpty, setIsEmpty] = useState(false);
	const [currentDate, setCurrentDate] = useState('');

	const navigate = useNavigate();

	// Log out function
	const handleLogOut = () => {
		window.localStorage.removeItem("userId");
		navigate("../login");
	};

	// Creating new task
	const handleCreateTask = e => {
		if (!usernames || !author || !tags || !task || !deadline) {
			setIsEmpty(true);
			return;
		}
		setIsEmpty(false);
		e.preventDefault();
		const inputs = document.querySelectorAll("#inputs-form input");
		for (let i = 0; i < inputs.length; i++) {
			if (inputs[i].value) {
				setUsernames([usernames.push(inputs[i].value.trim())]);
			}
		}

			axios
				.post("http://localhost:8080/create", {
					usernames,
					task: task.trim(),
					done: false,
					tags: tags.trim(),
					deadline,
					author: author.trim(),
				})
				.then(response => {
					setTask("");
					setTags("");
					setDeadline("");
					setUsernames([]);
					setAuthor("");
				})
				.catch(e => console.log(e));
	};

	// Function for the button to implement a new input form
	const addInput = e => {
		e.preventDefault();
		setInputNumber([...inputNumber, []]);
	};

	// Function to check if we done the task
	const handleCheck = (taskId, taskUsernames, taskTask, taskTags, taskDone, taskDeadline, taskAuthor) => {
		axios.put("http://localhost:8080/change", {id: taskId, usernames: taskUsernames, task: taskTask, tags: taskTags, done: !taskDone, deadline: taskDeadline, author: taskAuthor })
	};

	// Function to delete the task which we want
	const handleDeleteTask = (key) => {
		axios.post('http://localhost:8080/delete', { id: key})
	}

	// Getting the current date in the format 'yyyy-mm-dd'
	function formatDate() {
		var d = new Date(),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		return [year, month, day].join("-");
	}


	// Get all tasks from the database everytime when the tasks state updates
	useEffect(() => {
		if (!window.localStorage.getItem("userId")) navigate("../login");

		axios
			.post("http://localhost:8080/getUser", {
				id: window.localStorage.getItem("userId"),
			})
			.then(res => {
				axios.get("http://localhost:8080/tasks").then(response => {
					var userTasks = [];
					for (let i = 0; i < response.data.length; i++) {
						for (let j = 0; j < response.data[i].usernames.length; j++) {
							if (response.data[i].usernames[j] === res.data.username) {
								userTasks.push(response.data[i]);
							}
						}
					}
					setTasks(userTasks);
				});
			})
			.catch(e => console.log(e));

			setCurrentDate(formatDate());

	}, [tasks, navigate]);

	return (
		<>
			<div className="wrapper">
				<h1>Tasks</h1>
				<button className="btn__create logOut" onClick={() => handleLogOut()}>
					Log Out
				</button>

				<form id="inputs-form">
					<input placeholder="Usernames" />
					{inputNumber.map((data, index) => (
						<input placeholder="usernames" key={index} />
					))}
					<button className="btn__create" onClick={e => addInput(e)}>
						Add Username
					</button>
				</form>

				<input
					value={tags}
					placeholder="Tags"
					onChange={e => setTags(e.target.value)}
				/>
				<input
					value={deadline}
					type="Date"
					min={currentDate}
					onChange={e => setDeadline(e.target.value)}
				/>
				<input
					value={author}
					placeholder="Author"
					onChange={e => setAuthor(e.target.value)}
				/>
				<textarea
					value={task}
					placeholder="Task"
					onChange={e => setTask(e.target.value)}
				/>
				<button
					type="submit"
					className="btn__create"
					onClick={e => handleCreateTask(e)}
				>
					Create Task
				</button>
				{isEmpty && <p>fields must not be empty</p>}

				<div className="cards">
					{tasks?.map(task => (
						<div className="card" key={task?.id}>
							<div>
								<ul className={task.done ? "done" : ""}>
									<li>{task?.task}</li>
									<li>{task?.tags}</li>
									<li>{task?.deadline}</li>
									<li>{task?.author}</li>
								</ul>
								<div>
									<button
										onClick={() => handleDeleteTask(task.id)}
										className="btn__small bin"
									>
										<img src="bin.png" alt="delete" />
									</button>
									<button
										onClick={() =>
											handleCheck(
												task.id,
												task.usernames,
												task.task,
												task.tags,
												task.done,
												task.deadline,
												task.author
											)
										}
										className="btn__small check"
									>
										<img src="check.png" alt="check" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Tasks;
