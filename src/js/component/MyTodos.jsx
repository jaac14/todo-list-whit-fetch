import React, { useEffect, useState } from "react";
//declarando el estado inicial de mi tarea
const initialState = {
  label: "",
  done: false,
};

let urlBase = "https://playground.4geeks.com/apis/fake/todos/user/jaac";

const MyTodos = () => {
  //guardando lo que se copia en mi input value
  const [task, setTask] = useState("");

  //guardando mi tarea ya lista en el estado que se mostrara
  const [myListTasks, setMyListTasks] = useState([]);

  //manejando el error
  const [error, setError] = useState(false);

  //alerta para el usuario borrado
  const [deleteAll, setDeleteAll] = useState(false);
  //funcion para traer todas las tareas de la API

  const getTask = async () => {
    try {
      let response = await fetch(urlBase);

      if (response.status == 404) {
        createUser();
        response = await fetch(urlBase);
      }

      if (response.ok) {
        let data = await response.json();
        setMyListTasks(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async () => {
    try {
      let response = await fetch(urlBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([]),
      });
    } catch (error) {
      console.log(error);
    }
  };

  async function updateFetch() {
    try {
      let response = await fetch(urlBase, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(myListTasks),
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function deleteUser() {
    try {
      let response = await fetch(urlBase, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        getTask();
        setDeleteAll(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTask();
  }, []);

  //function para fuardar my tarea ya terminada

  async function saveMyTaks(event) {
    if (event.key != "Enter") return;
    if (event.target.value.trim() === "") {
      setError(true);
      return;
    }
    setMyListTasks([...myListTasks, { label: task, done: false }]);
    if (updateFetch()) {
      setTask("");
      setError(false);
    } else setError(true);
  }

  //add my input value from my input to my state
  function addInputValue(event) {
    setTask(event.target.value);
  }

  //eliminar tareas
  const deleteTask = async (id) => {
    let newArr = myListTasks.filter((_, index) => index != id);
    try {
      let response = await fetch(urlBase, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArr),
      });
      if (response.ok) {
        getTask()
      }
    } catch (error) {
      console.log(error);
      return false;
    }

  };

  //funcion para mostrar alerta al borrar usuario

  //funcion para modificar el contador de tareas

  function taskCounter(number) {
    number = myListTasks.length;
    if (number === 0) {
      return "No hay tareas agregue una!";
    } else return number + " Task";
  }

  useEffect(() => {
    getTask();
  }, []);

  return (
    <div className="Container myTodos">
      {error ? (
        <div className="alert alert-danger">
          Debes ingresar un tipo de dato valido
        </div>
      ) : (
        false
      )}
      {deleteAll ? (
        <div className="alert alert-success">
          El usuario se borro satisfactoriamente
        </div>
      ) : (
        false
      )}
      <div className="input-style">
        <input
          name="label"
          type="text"
          placeholder="Add your tasks here "
          onChange={addInputValue}
          onKeyDown={saveMyTaks}
          value={task}
        />
      </div>
      <ol>
        {myListTasks.map((item, index) => {
          return (
            <li key={index} className="list-task">
              {item.label}
              <i
                className="fa-solid fa-trash-can fa-beat-fade"
                onClick={() => deleteTask(index)}
              ></i>
            </li>
          );
        })}
      </ol>
      <div className="number-task">{taskCounter(myListTasks.length)}</div>
      <div className="d-flex">
        <button
          onClick={() => {
            createUser();
          }}
          type="button"
          className="btn btn-primary"
        >
          Create User
        </button>
        <button
          onClick={() => {
            deleteUser();
          }}
          type="button"
          className="btn btn-danger"
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

export default MyTodos;

// 1 traerme todas las tareas de un usuario que estan guardadas en Data Base (API)
// 2 crear usuarios
// 3 guardar tareas
// 4 borrar tareas cuando se le da a la papelera
// 5 borrar usuario con todas las tareas
