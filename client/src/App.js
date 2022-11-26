import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";

function App() {

  return (
		<Routes>
			<Route path="/register" element={<Register />} />
			<Route path="/login" element={<Login />} />
			<Route path="/tasks" element={<Tasks />} />
		</Routes>
	);
}

export default App;
