import { useContext, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "./Provider/AuthProvider";
import Swal from "sweetalert2";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { user, logOut } = useContext(AuthContext);
  // const checkboxRef = useRef();
  const [isCompleted, setIsCompleted] = useState(true);

  const url = "http://localhost:5000/todo";

  const { data: todoData = [], refetch } = useQuery(["todo"], async () => {
    const res = await axios.get(`https://todo-server-bay.vercel.app/todo/${user?.email}`);
    return res.data;
  });

  const handleLogout = () => {
    logOut()
      .then()
      .catch((err) => {
        console.log(err);
      });
  };
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const date = form.date.value;
    const data = { title, description, date, email: user?.email };
    console.log(data);
    axios.post('https://todo-server-bay.vercel.app/todo', data).then((data) => {
      if (data.data.insertedId) {
        refetch();
        window.my_modal_3.close();
        form.reset();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your Task is Added",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleCheckbox = (id) => {
    setIsCompleted(!isCompleted);
    if (isCompleted) {
      axios.put(`https://todo-server-bay.vercel.app/todo/${id}`).then((data) => {
        if (data.data.modifiedCount) {
          refetch();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Task Completed",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://todo-server-bay.vercel.app/todo/${id}`).then((data) => {
          if (data.data.deletedCount > 0) {
            refetch();
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          }
        });
      }
    });
  };

  return (
    <div className="w-[90%] mx-auto">
      {user ? (
        <span className="flex justify-end items-center gap-2 mt-2">
          <img
            className="avatar w-8 h-8 rounded-full"
            src={user?.photoURL}
            title={user?.email}
          />
          <button onClick={handleLogout} className="btn btn-active btn-outline btn-ghost btn-xs">
            Logout
          </button>
        </span>
      ) : (
        <Link to="/login">
          <button className="fixed top-2 right-4 btn btn-outline btn-active btn-ghost btn-xs">Login</button>
        </Link>
      )}
      <h1 className="text-purple-400 mt-8 font-bold text-3xl text-center">
        Task Manger
      </h1>
      <div className="mx-auto ">
        <button
          className="btn px-4 py-2 mb-4 transition ease-in-out delay-0 hover:shadow-lg rounded bg-green-500 flex justify-center items-center gap-1 mx-auto mt-8"
          onClick={() => window.my_modal_3.showModal()}
        >
          <FaPlus /> Add Task
        </button>
        <dialog id="my_modal_3" className="modal">
          <form
            onSubmit={handleTaskSubmit}
            method="dialog"
            className="modal-box"
          >
            <input
              name="title"
              type="text"
              placeholder="Title"
              className="input input-bordered input-sm w-full max-w-xs"
            />
            <input
              name="description"
              type="text"
              placeholder="Description"
              className="input mt-4 mb-4 input-bordered input-sm w-full max-w-xs"
            />
            <input
              name="date"
              type="date"
              placeholder="Due Date"
              className="input input-bordered input-sm w-full max-w-xs"
            />
            <div className="modal-action">
              <button
                type="submit"
                className="block mt-4 btn btn-sm btn-accent"
              >
                Add Task
              </button>
            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {todoData.map((todo) => (
              <tr key={todo._id}>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>{todo.date}</td>
                <td>
                  {todo?.status ? (
                    <p>Completed</p>
                  ) : (
                    <input
                      onChange={() => handleCheckbox(todo._id)}
                      type="checkbox"
                      className="checkbox"
                    />
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="text-xl text-red-500"
                  >
                    <FaTrash></FaTrash>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
