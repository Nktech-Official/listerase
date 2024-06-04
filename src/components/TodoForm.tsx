"use client";
import React, { useState } from "react";
import { push, ref, set } from "firebase/database";
import { database } from "@/app/firebase/config";
import { User } from "firebase/auth";

interface Todo {
  name: string;
  description: string;
}

const TodoForm: React.FC<{ user: User | undefined | null }> = ({ user }) => {
  const [todo, setTodo] = useState<Todo>({ name: "", description: "" });

  const createTodo = async (todo: Todo) => {
    try {
      const userId = user?.uid; // Extract the user ID
      const todoListRef = ref(database, `${userId}/todos`);
      const newTodoRef = push(todoListRef); // Generate a unique key
      console.log(userId);

      await set(newTodoRef, {
        ...todo,
        isComplete: false, // Set default isComplete to false
      });

      console.log("Todo created successfully!");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTodo({ ...todo, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createTodo(todo);
    setTodo({ name: "", description: "" }); // Clear form after submit
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex container w-5/6 mx-auto flex-col space-y-2"
    >
      <label htmlFor="name" className="text-sm font-medium">
        Todo Name:
      </label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Enter todo name"
        value={todo.name}
        onChange={handleChange}
        className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
      <label htmlFor="description" className="text-sm font-medium">
        Description (Optional):
      </label>
      <textarea
        id="description"
        name="description"
        rows={3}
        placeholder="Add a detailed description"
        value={todo.description}
        onChange={handleChange}
        className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
      >
        Create Todo
      </button>
    </form>
  );
};

export default TodoForm;
