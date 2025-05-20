interface TodoProps {
  todos: string[];
}

export default function TodoList({ todos }: TodoProps) {
  return (
    <div>
      {todos.length === 0 ? (
        <p>할 일이 없습니다!</p>
      ) : (
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>{todo}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
