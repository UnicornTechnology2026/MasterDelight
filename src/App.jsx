import { useState } from "react";
import Header from "./components/Header";
import JumpMenu from "./components/JumpMenu";
import Loader from "./components/Loader";
import AgeGate from "./components/AgeGate";
import Welcome from "./components/Welcome";
import Quiz from "./components/Quiz";
import Blend from "./components/Blend";
import Hunt from "./components/Hunt";
import LevelComplete from "./components/LevelComplete";
import Final from "./components/Final";

const ORDER = ["quiz", "blend", "hunt"];
const START = { quiz: 0, blend: 0, hunt: 0 };

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [scores, setScores] = useState(START);
  const [result, setResult] = useState(null);
  const [run, setRun] = useState(0);
  const [aged, setAged] = useState(false); // set once the age gate screen is passed; unlocks the Jump menu levels

  const finish = (key) => (r) => {
    setScores((s) => ({ ...s, [key]: r.score }));
    setResult({ ...r, key });
    setScreen("complete");
  };
  const next = () => {
    const i = ORDER.indexOf(result.key);
    setScreen(i + 1 < ORDER.length ? ORDER[i + 1] : "final");
  };
  const restart = () => {
    setScores(START);
    setRun((n) => n + 1);
    setScreen("welcome");
  };
  const start = () => setScreen("quiz");
  const enter = () => {
    setAged(true);
    setScreen("welcome");
  }; // age gate passed
  // Jump straight to any page. Bumping `run` remounts the page, so a level always starts fresh.
  const jumpTo = (target) => {
    setRun((n) => n + 1);
    setScreen(target);
  };

  const level =
    screen === "complete"
      ? ORDER.indexOf(result.key) + 1
      : ORDER.indexOf(screen) + 1;
  const total = scores.quiz + scores.blend + scores.hunt;
  const current = screen === "complete" ? result.key : screen;
  const jump = (align) => (
    <JumpMenu current={current} aged={aged} onJump={jumpTo} align={align} />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon via-wine to-maroon">
      <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-3">
        {level > 0 ? (
          <Header level={level} total={total} jump={jump("left")} />
        ) : (
          screen !== "loading" &&
          screen !== "age" && (
            <div className="relative z-30 flex justify-end pb-2">
              {jump("right")}
            </div>
          )
        )}
        {screen === "loading" && <Loader onDone={() => setScreen("age")} />}
        {screen === "age" && <AgeGate onEnter={enter} />}
        {screen === "welcome" && <Welcome onStart={start} />}
        {screen === "quiz" && <Quiz key={run} onDone={finish("quiz")} />}
        {screen === "blend" && <Blend key={run} onDone={finish("blend")} />}
        {screen === "hunt" && (
          <Hunt key={run} onDone={finish("hunt")} jump={jump("left")} />
        )}
        {screen === "complete" && (
          <LevelComplete
            result={result}
            onNext={next}
            last={result.key === "hunt"}
          />
        )}
        {screen === "final" && <Final scores={scores} onRestart={restart} />}
      </main>
    </div>
  );
}
