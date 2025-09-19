export default function Home() {
  // It should be passed
  function handleClick() {
    alert("hello world");
  }

  return (
    <div>
      Home page <button onClick={handleClick}>Click me</button>
    </div>
  );
}
