export function NoteTodos({ todos, onAddTodo, onTodoChange }) {
  return (
    <div>
      {todos.map((todo, index) => (
        <input
          key={index}
          type="text"
          value={todo}
          onChange={(e) => onTodoChange(index, e.target.value)}
          placeholder={`Todo ${index + 1}`}
        />
      ))}
      <button type="button" onClick={onAddTodo}>Add Todo</button>
    </div>
  );
}