interface UserCardProps {
  name: string;
  age: number;
}

export default function UserCard({ name, age }: UserCardProps) {
  return (
    <div>
      <p>이름 : {name} </p>
      <p>나이 : {age}</p>
    </div>
  );
}
