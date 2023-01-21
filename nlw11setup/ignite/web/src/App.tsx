import { Habit } from "./components/Habit";

function App() {
  return (
    <div>
      <Habit completed={1} />
      <Habit completed={10} />
      <Habit completed={20} />
    </div>
  )
};

export default App;