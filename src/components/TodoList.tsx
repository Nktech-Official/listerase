import React, { useState, useEffect, FormEventHandler } from "react";
import { onValue, ref, remove, update } from "firebase/database";
import { database } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import Check, { CheckSolid, CheckUpdate } from "./icons/Check";
import Edit from "./icons/Edit";
import Delete from "./icons/Delete";

interface Todo {
  name: string;
  description: string;
  isComplete: boolean;
  key: string;
}

const TodoList: React.FC<{ user: User | undefined | null }> = ({ user }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const unsubscribe = onValue(
      ref(database, `${user?.uid}/todos`),
      (snapshot) => {
        const data = snapshot.val() || {};
        const todoListWithKeys: Todo[] = [];

        for (const key in data) {
          todoListWithKeys.push({
            ...data[key], // Spread existing todo properties
            key, // Add the key property
          });
        }

        setTodos(todoListWithKeys);
      },
      (error) => {
        console.error("Error fetching todos:", error);
      }
    );

    return () => unsubscribe(); // Cleanup function to detach listener
  }, [user]);

  return (
    <div className="flex container w-5/6 mx-auto mt-10 flex-col space-y-4">
      <h1 className="text-3xl font-extrabold">Todo List</h1>
      {todos.map((todo) => (
        <TodoItem key={todo.name} todo={todo} user={user} />
      ))}
    </div>
  );
};

function TodoItem({
  todo,
  user,
}: {
  todo: Todo;
  user: User | null | undefined;
}) {
  const [updatedTodo, setUpdatedTodo] = useState<Todo>(todo);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  //Handle Database Write To Update Todo
  const updateTodo = () => {
    update(ref(database, `${user?.uid}/todos/${updatedTodo.key}`), updatedTodo) // Update specific todo
      .then(() => {
        setIsEditing(false);
        console.log("Todo updated complete successfully!");
      })
      .catch((error) => {
        console.error("Error while updating Todo:", error);
      });
    console.log("Edit todo:", todo);
  };
  //Handle Database Write to Update Todo
  const handleMarkComplete = () => {
    setUpdatedTodo((prev) => ({ ...prev, isComplete: !prev.isComplete }));

    updateTodo();
  };
  const handleDelete = () => {
    remove(ref(database, `${user?.uid}/todos/${todo.key}`)) // Delete specific todo
      .then(() => {
        console.log("Todo deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };
  const handleName: FormEventHandler<HTMLHeadElement> = (e) => {
    console.log(e.currentTarget.innerHTML);
    const name = e.currentTarget.innerHTML;
    setUpdatedTodo((prev) => ({ ...prev, name: name }));
  };
  const handelDes: FormEventHandler<HTMLParagraphElement> = (e) => {
    console.log(e);
    const desc = e.currentTarget.innerHTML;
    setUpdatedTodo((prev) => ({ ...prev, description: desc }));
  };

  return (
    <div className="rounded-md border border-gray-300 p-4 shadow-sm flex flex-col space-y-2">
      <h3
        contentEditable={isEditing}
        onInput={handleName}
        className={`text-lg font-medium ${
          todo.isComplete ? "line-through" : ""
        }`}
      >
        {todo.name}
      </h3>
      <p
        contentEditable={isEditing}
        onChange={handelDes}
        className={`text-gray-600 break-words ${
          todo.isComplete ? "line-through" : ""
        }`}
      >
        {todo.description}
      </p>
      <div className="flex space-x-2">
        <button
          type="button"
          className="px-4 py-2 rounded-md text-sm font-medium bg-transparent text-green-500 outline outline-1"
          onClick={() => handleMarkComplete()}
        >
          {todo.isComplete ? <CheckSolid /> : <Check />}
        </button>
        {!isEditing ? (
          <button
            type="button"
            className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsEditing(true)}
          >
            <Edit />
          </button>
        ) : (
          <button
            type="button"
            className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => updateTodo()}
          >
            <CheckUpdate />
          </button>
        )}
        <button
          type="button"
          className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={() => handleDelete()}
        >
          <Delete />
        </button>
      </div>
    </div>
  );
}

export default TodoList;
