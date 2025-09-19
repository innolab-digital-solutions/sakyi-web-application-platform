export default function Home() {
  function handleClick() {
    console.log("clicked");
  }
  return (
    <div>
      Home page <button onClick={handleClick}>Click me</button>
    </div>
  );
}
