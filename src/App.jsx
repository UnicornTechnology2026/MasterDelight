import { useState } from "react";
import Header from "./components/Header";
import JumpMenu from "./components/JumpMenu";
import Loader from "./components/Loader";
import AgeGate from "./components/AgeGate";
import Login from "./components/Login";
import Otp from "./components/Otp";
import Welcome from "./components/Welcome";
import Quiz from "./components/Quiz";
import Blend from "./components/Blend";
import Hunt from "./components/Hunt";
import LevelComplete from "./components/LevelComplete";
import Final from "./components/Final";

const ORDER = ["quiz", "blend", "hunt"];
const START = { quiz: 0, blend: 0, hunt: 0 };
const PRE = ["loading", "age", "otp"]; // screens before the game: no header / jump menu

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [scores, setScores] = useState(START);
  const [result, setResult] = useState(null);
  const [run, setRun] = useState(0);
  const [aged, setAged] = useState(false); // set once login + OTP are done; unlocks the Jump menu levels
  const [user, setUser] = useState(null); // { name, city, mobile }

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

  const enter = () => setScreen("login"); // age gate passed
  const login = (details) => {
    setUser(details);
    setScreen("otp");
  };
  const verified = () => {
    setAged(true);
    setScreen("welcome");
  }; // OTP passed

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
  const base = total - (scores[screen] ?? 0); // total of the OTHER levels, so a level's live total never double-counts its own old score
  const current = screen === "complete" ? result.key : screen;
  const jump = (align) => (
    <JumpMenu current={current} aged={aged} onJump={jumpTo} align={align} />
  );

  const fit = screen === "welcome"; // Welcome fits the screen exactly, with no scrolling
  const deskFit = screen === "blend" || screen === "quiz";
  const huntFit = ["hunt", "complete", "final"].includes(screen); // these screens fill the screen exactly
  const wide = [
    "welcome",
    "quiz",
    "blend",
    "hunt",
    "complete",
    "final",
  ].includes(screen); // full-width desktop layout

  return (
    <div
      className={`app-bg ${fit || huntFit ? "h-dvh overflow-hidden" : deskFit ? "min-h-dvh lg:h-dvh lg:overflow-hidden" : "min-h-dvh"}`}
    >
      <main
        className={`mx-auto flex flex-col px-4 py-3 lg:px-10 ${fit || huntFit ? "h-dvh" : deskFit ? "min-h-dvh lg:h-dvh" : "min-h-dvh"} ${wide ? "max-w-7xl" : "max-w-md"}`}
      >
        {level > 0 ? (
          <Header level={level} total={total} jump={jump("left")} />
        ) : (
          !PRE.includes(screen) && (
            <div className="relative z-30 flex justify-end pb-2">
              {jump("right")}
            </div>
          )
        )}

        {screen === "loading" && <Loader onDone={() => setScreen("age")} />}
        {screen === "age" && <AgeGate onEnter={enter} />}
        {screen === "login" && <Login onSubmit={login} initial={user} />}
        {screen === "otp" && (
          <Otp
            mobile={user?.mobile}
            onVerified={verified}
            onBack={() => setScreen("login")}
          />
        )}
        {screen === "welcome" && <Welcome onStart={start} user={user} />}
        {screen === "quiz" && (
          <Quiz key={run} onDone={finish("quiz")} base={base} />
        )}
        {screen === "blend" && (
          <Blend key={run} onDone={finish("blend")} base={base} />
        )}
        {screen === "hunt" && (
          <Hunt key={run} onDone={finish("hunt")} base={base} />
        )}
        {screen === "complete" && (
          <LevelComplete
            result={result}
            onNext={next}
            last={result.key === "hunt"}
            level={level}
            total={total}
          />
        )}
        {screen === "final" && <Final scores={scores} onRestart={restart} />}
      </main>
    </div>
  );
}
