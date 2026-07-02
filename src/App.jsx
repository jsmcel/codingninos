import { useEffect, useMemo, useRef, useState } from "react";
import {
  Brush,
  CheckCircle2,
  Flag,
  Footprints,
  GitBranch,
  Lightbulb,
  LockKeyhole,
  Mic,
  MicOff,
  Music2,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  RotateCw,
  Sparkles,
  Square,
  Trash2,
  Trophy,
  Volume2,
  VolumeX,
  XCircle,
} from "lucide-react";
import { challenges, characters, commandCatalog, courseModules } from "./challenges.js";
import { playCommand, say, setMuted, setVoiceMuted, sounds } from "./audio.js";
import {
  ChickArt,
  ClockArt,
  CollectibleArt,
  CowArt,
  getCommandArt,
  GrassTuft,
  HedgeArt,
  PaintOutlineArt,
  PuddleArt,
  Scenery,
  SignalArt,
  SoundGoalArt,
  SplatArt,
  TargetArt,
} from "./BoardArt.jsx";

const directionVectors = {
  N: { x: 0, y: -1, angle: 0, label: "norte" },
  E: { x: 1, y: 0, angle: 90, label: "este" },
  S: { x: 0, y: 1, angle: 180, label: "sur" },
  W: { x: -1, y: 0, angle: 270, label: "oeste" },
};

const directionOrder = ["N", "E", "S", "W"];

const commandIcons = {
  start: Play,
  go: Footprints,
  stop: Square,
  left: RotateCcw,
  right: RotateCw,
  wait: Pause,
  hop: Sparkles,
  again2: Repeat,
  again3: Repeat,
  ifSignalGo: GitBranch,
  paint: Brush,
  moo: Music2,
  cluck: Music2,
  bridge: Repeat,
};

function getCommandVisual(commandId) {
  const visualMap = {
    start: { kind: "switch", asset: characters.start.asset, accent: "#52df65", purpose: "enciende" },
    go: { kind: "runner", asset: characters.go.asset, accent: "#2fd7bd", purpose: "avanza" },
    stop: { kind: "barrier", asset: characters.stop.asset, accent: "#ff5248", purpose: "detiene" },
    left: { kind: "turn-left", accent: "#f2a23a", purpose: "gira" },
    right: { kind: "turn-right", accent: "#7c72f0", purpose: "gira" },
    wait: { kind: "timer", accent: "#7ed9f2", purpose: "pausa" },
    hop: { kind: "spring", asset: characters.hop.asset, accent: "#ff86bd", purpose: "salta" },
    again2: { kind: "loop", accent: "#ffd24a", count: "2", purpose: "repite x2" },
    again3: { kind: "loop", accent: "#ffd24a", count: "3", purpose: "repite x3" },
    ifSignalGo: { kind: "signal", accent: "#8fdd62", purpose: "decide" },
    paint: { kind: "stamp", accent: "#7cb8ff", purpose: "pinta" },
    moo: { kind: "sound", accent: "#f9f1dc", purpose: "suena" },
    cluck: { kind: "sound", accent: "#ffe37a", purpose: "suena" },
    bridge: { kind: "bridge", accent: "#ef7f45", purpose: "rutina" },
  };
  return visualMap[commandId] || { kind: "spark", accent: commandCatalog[commandId]?.tone || "#74c9ea", purpose: "accion" };
}

function keyOf(point) {
  return `${point.x},${point.y}`;
}

function listToSet(points = []) {
  return new Set(points.map(keyOf));
}

function soundKey(goal) {
  return `${goal.x},${goal.y}:${goal.command}`;
}

function createInitialState(challenge) {
  const { start } = challenge.board;
  return {
    x: start.x,
    y: start.y,
    dir: start.dir,
    started: false,
    stopped: false,
    crashed: false,
    collected: new Set(),
    painted: new Set(),
    waited: new Set(),
    sounds: new Set(),
    message: "Listo para probar tu codigo.",
    step: -1,
    commandId: null,
  };
}

function rotate(dir, amount) {
  const index = directionOrder.indexOf(dir);
  return directionOrder[(index + amount + directionOrder.length) % directionOrder.length];
}

function cloneState(state) {
  return {
    ...state,
    collected: new Set(state.collected),
    painted: new Set(state.painted),
    waited: new Set(state.waited),
    sounds: new Set(state.sounds),
  };
}

function boardLookups(board) {
  return {
    wallSet: listToSet(board.walls),
    waterSet: listToSet(board.water),
    signalSet: listToSet(board.signals),
    collectibleSet: listToSet(board.collectibles),
    paintSet: listToSet(board.paintTiles),
    waitSet: listToSet(board.waitTiles),
    soundGoals: board.soundGoals || [],
  };
}

function collectAt(state, lookups) {
  const here = keyOf(state);
  if (lookups.collectibleSet.has(here)) {
    state.collected.add(here);
  }
}

function isBlocked(x, y, board, lookups) {
  if (x < 0 || y < 0 || x >= board.cols || y >= board.rows) return true;
  return lookups.wallSet.has(`${x},${y}`);
}

function requireStarted(state, challenge) {
  if (challenge.requiresStart && !state.started) {
    return { ...state, crashed: true, message: "Primero coloca Start para encender el programa." };
  }
  return state;
}

function moveOne(state, challenge, lookups, label = "Go") {
  if (state.crashed || state.stopped) return state;
  const ready = requireStarted(state, challenge);
  if (ready.crashed) return ready;
  const vector = directionVectors[ready.dir];
  const next = { x: ready.x + vector.x, y: ready.y + vector.y };
  if (isBlocked(next.x, next.y, challenge.board, lookups)) {
    return { ...ready, crashed: true, message: `${label}: habia una pared.` };
  }
  if (lookups.waterSet.has(keyOf(next))) {
    return { ...ready, crashed: true, message: `${label}: cayo en un charco.` };
  }
  const moved = cloneState({ ...ready, ...next, message: `${label}: paso correcto.` });
  collectAt(moved, lookups);
  return moved;
}

function hop(state, challenge, lookups) {
  if (state.crashed || state.stopped) return state;
  const ready = requireStarted(state, challenge);
  if (ready.crashed) return ready;
  const vector = directionVectors[ready.dir];
  const middle = { x: ready.x + vector.x, y: ready.y + vector.y };
  const next = { x: ready.x + vector.x * 2, y: ready.y + vector.y * 2 };
  if (isBlocked(next.x, next.y, challenge.board, lookups)) {
    return { ...ready, crashed: true, message: "Hop: no habia sitio para aterrizar." };
  }
  if (!lookups.waterSet.has(keyOf(middle))) {
    return { ...ready, crashed: true, message: "Hop: este salto necesitaba un charco delante." };
  }
  const jumped = cloneState({ ...ready, ...next, message: "Hop: charco superado." });
  collectAt(jumped, lookups);
  return jumped;
}

function runSound(commandId, state, challenge, lookups) {
  const ready = requireStarted(state, challenge);
  if (ready.crashed) return ready;
  const here = keyOf(ready);
  const matchingGoal = lookups.soundGoals.find(
    (goal) => goal.x === ready.x && goal.y === ready.y && goal.command === commandId,
  );
  const anySoundHere = lookups.soundGoals.some((goal) => goal.x === ready.x && goal.y === ready.y);
  if (!matchingGoal && anySoundHere) {
    return { ...ready, crashed: true, message: "Ese no era el sonido de esta casilla." };
  }
  if (!matchingGoal) {
    return { ...ready, crashed: true, message: "Aqui no habia boton de sonido." };
  }
  const sounds = new Set(ready.sounds);
  sounds.add(`${here}:${commandId}`);
  return { ...ready, sounds, message: `${commandCatalog[commandId].label}: sonido activado.` };
}

function runAtomicCommand(commandId, state, challenge, lookups) {
  if (state.crashed || state.stopped) return state;
  if (commandId === "start") {
    return { ...state, started: true, message: "Start: programa encendido." };
  }
  if (commandId === "stop") {
    const ready = requireStarted(state, challenge);
    if (ready.crashed) return ready;
    return { ...ready, stopped: true, message: "Stop: final perfecto." };
  }
  if (commandId === "go") return moveOne(state, challenge, lookups);
  if (commandId === "left") {
    const ready = requireStarted(state, challenge);
    if (ready.crashed) return ready;
    return { ...ready, dir: rotate(ready.dir, -1), message: "Gira izquierda: nueva direccion." };
  }
  if (commandId === "right") {
    const ready = requireStarted(state, challenge);
    if (ready.crashed) return ready;
    return { ...ready, dir: rotate(ready.dir, 1), message: "Gira derecha: nueva direccion." };
  }
  if (commandId === "wait") {
    const ready = requireStarted(state, challenge);
    if (ready.crashed) return ready;
    const waited = new Set(ready.waited);
    waited.add(keyOf(ready));
    return { ...ready, waited, message: "Espera: turno respetado." };
  }
  if (commandId === "hop") return hop(state, challenge, lookups);
  if (commandId === "paint") {
    const ready = requireStarted(state, challenge);
    if (ready.crashed) return ready;
    const painted = new Set(ready.painted);
    painted.add(keyOf(ready));
    return { ...ready, painted, message: "Pinta: baldosa coloreada." };
  }
  if (commandId === "ifSignalGo") {
    const ready = requireStarted(state, challenge);
    if (ready.crashed) return ready;
    const vector = directionVectors[ready.dir];
    const next = { x: ready.x + vector.x, y: ready.y + vector.y };
    if (lookups.signalSet.has(keyOf(next))) {
      return moveOne(ready, challenge, lookups, "Semaforo en verde, Go");
    }
    return { ...ready, message: "Semaforo: no hay verde delante, me quedo quieto." };
  }
  if (commandId === "moo" || commandId === "cluck") return runSound(commandId, state, challenge, lookups);
  if (commandId === "bridge") {
    return ["go", "go", "right"].reduce(
      (current, inner) => runAtomicCommand(inner, current, challenge, lookups),
      state,
    );
  }
  return { ...state, crashed: true, message: "Bloque desconocido." };
}

function executeProgram(challenge, program) {
  const lookups = boardLookups(challenge.board);
  const frames = [createInitialState(challenge)];
  let state = frames[0];
  collectAt(state, lookups);

  for (let index = 0; index < program.length; index += 1) {
    const commandId = program[index];
    const repeatCount = commandId === "again2" ? 2 : commandId === "again3" ? 3 : 0;

    if (repeatCount) {
      const nextCommand = program[index + 1];
      if (!nextCommand || nextCommand.startsWith("again") || nextCommand === "start" || nextCommand === "stop") {
        state = { ...state, crashed: true, message: "Again necesita un bloque de accion justo despues." };
        frames.push({ ...cloneState(state), step: index, commandId });
        break;
      }
      state = { ...state, message: `Again: repite el bloque siguiente x${repeatCount}.` };
      frames.push({ ...cloneState(state), step: index, commandId });
      for (let i = 0; i < repeatCount; i += 1) {
        state = runAtomicCommand(nextCommand, state, challenge, lookups);
        frames.push({ ...cloneState(state), step: index + 1, commandId: nextCommand });
        if (state.crashed || state.stopped) break;
      }
      index += 1;
    } else {
      state = runAtomicCommand(commandId, state, challenge, lookups);
      frames.push({ ...cloneState(state), step: index, commandId });
    }

    if (state.crashed || state.stopped) break;
  }

  const final = frames[frames.length - 1];
  const targetReached =
    !challenge.board.target || (final.x === challenge.board.target.x && final.y === challenge.board.target.y);
  const collectedAll = (challenge.board.collectibles || []).every((item) => final.collected.has(keyOf(item)));
  const paintedAll = (challenge.board.paintTiles || []).every((tile) => final.painted.has(keyOf(tile)));
  const waitedAll = (challenge.board.waitTiles || []).every((tile) => final.waited.has(keyOf(tile)));
  const soundsAll = (challenge.board.soundGoals || []).every((goal) => final.sounds.has(soundKey(goal)));
  const startOk = !challenge.requiresStart || final.started;
  const stopOk = !challenge.requiresStop || final.stopped;
  const success =
    !final.crashed && targetReached && collectedAll && paintedAll && waitedAll && soundsAll && startOk && stopOk;

  return {
    frames,
    final,
    success,
    status: success
      ? "Nivel superado: se desbloquea la siguiente escena."
      : final.crashed
        ? final.message
        : "Aun falta ajustar algun bloque.",
  };
}

const stepVoiceLines = {
  start: "¡Encendido!",
  go: "¡Go!",
  stop: "¡Stop! Fin.",
  left: "Gira a la izquierda",
  right: "Gira a la derecha",
  wait: "Espera un turno",
  hop: "¡Hop! Salto",
  paint: "¡Pinta!",
  moo: "¡Muuu!",
  cluck: "¡Co, co, có!",
  again2: "¡Otra vez, dos veces!",
  again3: "¡Otra vez, tres veces!",
  bridge: "Rutina puente",
};

function voiceLineForFrame(frame) {
  if (frame.crashed) return "¡Oh, oh! Choque.";
  if (frame.commandId === "ifSignalGo") {
    return frame.message.includes("quieto") ? "No hay verde. Me quedo quieto." : "¡Verde! Adelante.";
  }
  return stepVoiceLines[frame.commandId] || "";
}

function readLocalStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getPreviousChallenge(challenge) {
  const index = challenges.findIndex((item) => item.id === challenge.id);
  return index > 0 ? challenges[index - 1] : null;
}

function App() {
  const [challengeId, setChallengeId] = useState(challenges[0].id);
  const [selectedModuleId, setSelectedModuleId] = useState(courseModules[0].id);
  const [programs, setPrograms] = useState({});
  const [completed, setCompleted] = useState(() => readLocalStorage("codeblocks-completed", []));
  const [frameIndex, setFrameIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [startedStories, setStartedStories] = useState({});
  const [runResult, setRunResult] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);
  const lastPlayedFrame = useRef(0);
  const runChallengeId = useRef(null);

  const completedSet = useMemo(() => new Set(completed), [completed]);
  const challenge = useMemo(
    () => challenges.find((item) => item.id === challengeId) || challenges[0],
    [challengeId],
  );
  const activeModule = useMemo(
    () => courseModules.find((module) => module.id === selectedModuleId) || courseModules[0],
    [selectedModuleId],
  );
  const moduleChallenges = useMemo(
    () => challenges.filter((item) => item.moduleId === activeModule.id),
    [activeModule.id],
  );
  const program = programs[challenge.id] || [];
  const simulation = useMemo(() => executeProgram(challenge, program), [challenge, program]);
  const activeFrame = simulation.frames[Math.min(frameIndex, simulation.frames.length - 1)];
  const character = characters[challenge.character];
  const challengeNumber = challenges.findIndex((item) => item.id === challenge.id) + 1;
  const slotCount = Math.max(6, challenge.solution.length, program.length + 1);
  const storyOpen = !startedStories[challenge.id];
  const nextChallenge = challenges[challengeNumber] || null;
  const progress = Math.round((completedSet.size / challenges.length) * 100);

  function isUnlocked(item) {
    const previous = getPreviousChallenge(item);
    return !previous || completedSet.has(previous.id) || completedSet.has(item.id);
  }

  useEffect(() => {
    // Los programas ya no se persisten: cada sesion empieza con los retos limpios.
    localStorage.removeItem("codeblocks-programs");
  }, []);

  useEffect(() => {
    localStorage.setItem("codeblocks-completed", JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    setSelectedModuleId(challenge.moduleId);
  }, [challenge.moduleId]);

  useEffect(() => {
    setFrameIndex(0);
    setIsRunning(false);
    setRunResult(null);
  }, [challenge.id, program.length]);

  useEffect(() => {
    setMuted(!soundOn);
  }, [soundOn]);

  useEffect(() => {
    setVoiceMuted(!voiceOn);
  }, [voiceOn]);

  useEffect(() => {
    if (!isRunning || frameIndex === 0 || frameIndex === lastPlayedFrame.current) return;
    lastPlayedFrame.current = frameIndex;
    const frame = simulation.frames[frameIndex];
    if (!frame) return;
    if (frame.crashed) {
      sounds.crash();
    } else if (frame.commandId) {
      playCommand(frame.commandId);
    }
    const line = voiceLineForFrame(frame);
    if (line) say(line);
  }, [frameIndex, isRunning, simulation.frames]);

  useEffect(() => {
    if (!isRunning) return;
    const activeBlock = document.querySelector(".program-block.run-active");
    if (activeBlock) {
      activeBlock.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [frameIndex, isRunning]);

  useEffect(() => {
    if (!isRunning) return undefined;
    if (runChallengeId.current !== challenge.id) {
      // El nivel cambio con una ejecucion a medias: cancela sin marcar resultado.
      setIsRunning(false);
      return undefined;
    }
    if (frameIndex >= simulation.frames.length - 1) {
      setIsRunning(false);
      const result = simulation.success ? "success" : simulation.final.crashed ? "crash" : "incomplete";
      setRunResult(result);
      if (result === "success") {
        sounds.success();
        say("¡Reto superado! ¡Bien hecho!");
      } else if (result === "incomplete") {
        sounds.incomplete();
        say("Casi, casi. Prueba otra vez.");
      }
      if (simulation.success && !completedSet.has(challenge.id)) {
        setCompleted((items) => [...items, challenge.id]);
      }
      return undefined;
    }
    // Con la voz activa cada paso dura mas para que le de tiempo a cantarlo.
    const timer = window.setTimeout(() => setFrameIndex((current) => current + 1), voiceOn ? 900 : 500);
    return () => window.clearTimeout(timer);
  }, [challenge.id, completedSet, frameIndex, isRunning, simulation.final.crashed, simulation.frames.length, simulation.success, voiceOn]);

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        mode: isRunning ? "running" : "editing",
        course: "Codeblocks Quest",
        module: activeModule.title,
        level: { id: challenge.id, order: challengeNumber, title: challenge.title, skill: challenge.skill },
        player: {
          x: activeFrame.x,
          y: activeFrame.y,
          dir: activeFrame.dir,
          dirLabel: directionVectors[activeFrame.dir].label,
        },
        program,
        result: runResult,
        success: simulation.success,
        completed: completedSet.size,
        note: "Grid origin is top-left; x grows right, y grows down.",
      });
    window.advanceTime = (ms = 500) => {
      const steps = Math.max(1, Math.round(ms / 500));
      setFrameIndex((current) => Math.min(current + steps, simulation.frames.length - 1));
    };
    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [
    activeFrame.dir,
    activeFrame.x,
    activeFrame.y,
    activeModule.title,
    challenge.id,
    challenge.skill,
    challenge.title,
    challengeNumber,
    completedSet.size,
    isRunning,
    program,
    runResult,
    simulation.frames.length,
    simulation.success,
  ]);

  function updateProgram(nextProgram) {
    setPrograms((current) => ({ ...current, [challenge.id]: nextProgram }));
  }

  function selectChallenge(item) {
    if (!isUnlocked(item)) return;
    setChallengeId(item.id);
  }

  function addCommand(commandId) {
    sounds.place();
    updateProgram([...program, commandId]);
  }

  function moveCommand(from, to) {
    if (to < 0 || to >= program.length) return;
    const nextProgram = [...program];
    const [item] = nextProgram.splice(from, 1);
    nextProgram.splice(to, 0, item);
    updateProgram(nextProgram);
  }

  function removeCommand(index) {
    sounds.remove();
    updateProgram(program.filter((_, itemIndex) => itemIndex !== index));
  }

  function addHint() {
    const next = challenge.solution[program.length];
    if (next) addCommand(next);
  }

  function run() {
    if (storyOpen) return;
    setRunResult(null);
    setFrameIndex(0);
    lastPlayedFrame.current = 0;
    runChallengeId.current = challenge.id;
    setIsRunning(true);
  }

  function retryChallenge() {
    setRunResult(null);
    setFrameIndex(0);
    setIsRunning(false);
  }

  function goToNextChallenge() {
    if (!nextChallenge) return;
    setChallengeId(nextChallenge.id);
    setSelectedModuleId(nextChallenge.moduleId);
  }

  function beginChallenge() {
    setStartedStories((current) => ({ ...current, [challenge.id]: true }));
  }

  function resetCourse() {
    setPrograms({});
    setCompleted([]);
    setStartedStories({});
    setChallengeId(challenges[0].id);
    setSelectedModuleId(courseModules[0].id);
  }

  function speakStory() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${challenge.title}. ${challenge.story} ${character.name} dice: ${challenge.dialogue || ""}. Objetivo: ${challenge.objective}`,
    );
    utterance.lang = "es-ES";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="app-shell clean-shell">
      <header className="topbar clean-topbar" aria-label="Panel principal">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <p className="eyebrow">Wonderblocks coding course</p>
            <h1>Codeblocks Quest</h1>
          </div>
        </div>
        <div className="topbar-tools">
          <div className="progress-meter compact" aria-label={`Progreso ${progress}%`}>
            <strong>{completedSet.size}</strong>
            <span>/{challenges.length}</span>
            <div className="meter-track">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button
            aria-label={voiceOn ? "Silenciar la voz que canta los movimientos" : "Activar la voz que canta los movimientos"}
            className={`sound-toggle voice ${voiceOn ? "" : "off"}`}
            onClick={() => setVoiceOn((value) => !value)}
            title={voiceOn ? "Voz de movimientos: encendida" : "Voz de movimientos: apagada"}
            type="button"
          >
            {voiceOn ? <Mic size={20} aria-hidden="true" /> : <MicOff size={20} aria-hidden="true" />}
          </button>
          <button
            aria-label={soundOn ? "Silenciar sonidos" : "Activar sonidos"}
            className={`sound-toggle ${soundOn ? "" : "off"}`}
            onClick={() => setSoundOn((value) => !value)}
            title={soundOn ? "Efectos de sonido: encendidos" : "Efectos de sonido: apagados"}
            type="button"
          >
            {soundOn ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <section className="lesson-shell">
        <aside className="course-sidebar" aria-label="Ruta del curso">
          <div className="sidebar-head">
            <p className="eyebrow">Ruta</p>
            <h2>{activeModule.title}</h2>
          </div>

          <div className="module-tabs" aria-label="Modulos">
            {courseModules.map((module) => {
              const total = module.levelIds.length;
              const done = module.levelIds.filter((id) => completedSet.has(id)).length;
              const active = module.id === activeModule.id;
              const moduleUnlocked = module.levelIds.some((id) => {
                const item = challenges.find((level) => level.id === id);
                return item && isUnlocked(item);
              });
              return (
                <button
                  className={`module-tab ${active ? "active" : ""}`}
                  data-module-id={module.id}
                  disabled={!moduleUnlocked}
                  key={module.id}
                  onClick={() => setSelectedModuleId(module.id)}
                  type="button"
                >
                  <span>{module.order}</span>
                  <strong>{module.title}</strong>
                  <small>{done}/{total}</small>
                </button>
              );
            })}
          </div>

          <div className="level-path" aria-label="Niveles del modulo">
            {moduleChallenges.map((item) => {
              const isActive = item.id === challenge.id;
              const isDone = completedSet.has(item.id);
              const unlocked = isUnlocked(item);
              return (
                <button
                  className={`level-node ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
                  data-level-id={item.id}
                  disabled={!unlocked}
                  key={item.id}
                  onClick={() => selectChallenge(item)}
                  type="button"
                >
                  <span>{item.order}</span>
                  <strong>{item.skill}</strong>
                  {isDone ? <CheckCircle2 size={16} aria-hidden="true" /> : unlocked ? null : <LockKeyhole size={15} />}
                </button>
              );
            })}
          </div>

          <button className="tiny-action reset-link" type="button" onClick={resetCourse}>
            Reiniciar
          </button>
        </aside>

        <section className="stage-panel">
          {!storyOpen ? (
            <article className="mission-strip" aria-labelledby="mission-title">
              <div className="mission-character">
                <CharacterHero character={character} />
              </div>
              <div className="mission-copy">
                <p className="eyebrow">
                  Nivel {challengeNumber} - {challenge.skill}
                </p>
                <h2 id="mission-title">{challenge.title}</h2>
                <p className="mission-objective">{challenge.objective}</p>
                {showGuide ? (
                  <div className="reading-guide compact-guide">
                    <p>{challenge.prompt}</p>
                    <div>
                      {challenge.vocabulary.map((word) => (
                        <span key={word}>{word}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="read-actions">
                  <button className="icon-button warm" type="button" onClick={speakStory}>
                    <Volume2 size={18} aria-hidden="true" />
                    Leer
                  </button>
                  <button
                    aria-label="Ver pista de lectura"
                    className="icon-button ghost"
                    type="button"
                    onClick={() => setShowGuide((value) => !value)}
                  >
                    <Lightbulb size={18} aria-hidden="true" />
                    Pista
                  </button>
                </div>
              </div>
            </article>
          ) : null}

          <article className="board-panel clean-board-panel" aria-label="Tablero de juego">
            <Scenery />
            <div className="board-status">
              <StatusPill result={runResult} completed={completedSet.has(challenge.id)} />
            </div>
            {storyOpen ? (
              <article className="story-gate" aria-labelledby="story-title">
                <div className="story-gate-hero">
                  <CharacterHero character={character} />
                </div>
                <div className="story-gate-copy">
                  <p className="eyebrow">
                    Nivel {challengeNumber} - {activeModule.title}
                  </p>
                  <h2 id="story-title">{challenge.title}</h2>
                  <p className="story-lead">{challenge.story}</p>
                  {challenge.dialogue ? (
                    <p className="story-dialogue">
                      <strong>{character.name}</strong>
                      {challenge.dialogue}
                    </p>
                  ) : null}
                  <p className="story-objective">{challenge.objective}</p>
                  <div className="story-prompt">
                    <strong>{challenge.prompt}</strong>
                    <div>
                      {challenge.vocabulary.map((word) => (
                        <span key={word}>{word}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="story-actions">
                  <button className="icon-button warm" type="button" onClick={speakStory}>
                    <Volume2 size={18} aria-hidden="true" />
                    Leer
                  </button>
                  <button className="start-story-button" type="button" onClick={beginChallenge}>
                    <Play size={22} aria-hidden="true" />
                    Empezar reto
                  </button>
                </div>
              </article>
            ) : null}
            {isRunning && activeFrame.step >= 0 && activeFrame.commandId ? (
              <div className="step-chip" key={frameIndex} aria-live="polite">
                <span>Paso {activeFrame.step + 1}</span>
                <strong>{commandCatalog[activeFrame.commandId].label}</strong>
              </div>
            ) : null}
            <Board challenge={challenge} frame={activeFrame} character={character} result={runResult} />
            {runResult && !storyOpen ? (
              <ResultScreen
                result={runResult}
                hasNext={Boolean(nextChallenge)}
                onNext={goToNextChallenge}
                onRetry={retryChallenge}
              />
            ) : null}
            <div className="run-console" aria-live="polite">
              {runResult === "success" ? (
                <Trophy size={20} aria-hidden="true" />
              ) : runResult === "crash" ? (
                <XCircle size={20} aria-hidden="true" />
              ) : (
                <Sparkles size={20} aria-hidden="true" />
              )}
              <span>
                {isRunning || runResult ? activeFrame.message : "Coloca tus bloques y pulsa Ejecutar."}
              </span>
            </div>
          </article>
        </section>

        <article className={`code-panel clean-code-panel ${storyOpen ? "locked-until-story" : ""}`} aria-label="Editor de bloques">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Codigo</p>
              <h2>Bloques</h2>
            </div>
            <button className="icon-button danger" type="button" onClick={() => updateProgram([])}>
              <Trash2 size={18} aria-hidden="true" />
              Limpiar
            </button>
          </div>

          <div className="toolbox" aria-label="Paleta de bloques">
            {challenge.toolbox.map((commandId) => (
              <CommandButton key={commandId} commandId={commandId} onClick={() => addCommand(commandId)} />
            ))}
          </div>

          <div className="program-stack" aria-label="Programa actual">
            {Array.from({ length: slotCount }).map((_, index) => {
              const commandId = program[index];
              const previousCommandId = program[index - 1];
              const loopTarget =
                previousCommandId === "again2" ? "x2" : previousCommandId === "again3" ? "x3" : "";
              const runState = !isRunning
                ? ""
                : activeFrame.step === index
                  ? "run-active"
                  : activeFrame.step > index
                    ? "run-done"
                    : "";
              return commandId ? (
                <ProgramBlock
                  commandId={commandId}
                  index={index}
                  key={`${commandId}-${index}`}
                  loopTarget={loopTarget}
                  runState={runState}
                  onMoveUp={() => moveCommand(index, index - 1)}
                  onMoveDown={() => moveCommand(index, index + 1)}
                  onRemove={() => removeCommand(index)}
                />
              ) : (
                <span className={`program-slot ${loopTarget ? "loop-target-slot" : ""}`} key={`slot-${index}`}>
                  <span>{index + 1}</span>
                  {loopTarget ? <em>{loopTarget}</em> : null}
                </span>
              );
            })}
          </div>

          <div className="code-actions">
            <button
              className="run-button"
              data-action="run-program"
              disabled={!program.length || isRunning}
              onClick={run}
              type="button"
            >
              <Play size={20} aria-hidden="true" />
              Ejecutar
            </button>
            <button
              aria-label="Anadir pista"
              className="icon-button hint"
              disabled={program.length >= challenge.solution.length}
              onClick={addHint}
              type="button"
            >
              <Lightbulb size={18} aria-hidden="true" />
              Pista
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}

function ResultScreen({ result, hasNext, onNext, onRetry }) {
  const success = result === "success";
  const crashed = result === "crash";
  return (
    <article className={`result-screen ${success ? "success" : crashed ? "crash" : "incomplete"}`} aria-live="assertive">
      <div className="result-medal" aria-hidden="true">
        {success ? <Trophy size={48} /> : crashed ? <XCircle size={48} /> : <Lightbulb size={48} />}
      </div>
      <div>
        <p className="eyebrow">{success ? "Reto superado" : crashed ? "Choque detectado" : "Casi esta"}</p>
        <h2>{success ? "Has abierto el camino" : crashed ? "El programa se ha roto" : "Falta ajustar un bloque"}</h2>
        <p>
          {success
            ? "El programa funciono entero. Ahora puedes pasar al siguiente reto."
            : crashed
              ? "Mira el ultimo bloque que se ejecuto y cambia la secuencia antes de repetir."
              : "El personaje no llego al objetivo todavia. Prueba con una pista o cambia el orden."}
        </p>
      </div>
      <div className="result-actions">
        <button className="result-button secondary" type="button" onClick={onRetry}>
          <RotateCcw size={18} aria-hidden="true" />
          Reintentar
        </button>
        {success && hasNext ? (
          <button className="result-button primary" type="button" onClick={onNext}>
            <Play size={18} aria-hidden="true" />
            Siguiente
          </button>
        ) : null}
      </div>
    </article>
  );
}

function CharacterHero({ character }) {
  if (character.asset) {
    return (
      <div className="official-character">
        <img src={character.asset} alt={`${character.name}, personaje de ${character.origin}`} />
        <span>{character.assetLabel || character.origin}</span>
      </div>
    );
  }
  return (
    <div className="official-character vector-only">
      <Mascot character={character} />
      <span>personaje original</span>
    </div>
  );
}

function StatusPill({ result, completed }) {
  if (result === "success" || completed) {
    return (
      <span className="status-pill success">
        <CheckCircle2 size={17} aria-hidden="true" />
        Superado
      </span>
    );
  }
  if (result === "crash") {
    return (
      <span className="status-pill crash">
        <XCircle size={17} aria-hidden="true" />
        Revisa
      </span>
    );
  }
  return (
    <span className="status-pill">
      <Flag size={17} aria-hidden="true" />
      En marcha
    </span>
  );
}

function CommandButton({ commandId, onClick }) {
  const command = commandCatalog[commandId];
  const visual = getCommandVisual(commandId);
  return (
    <button
      className={`command-button object-${visual.kind}`}
      data-command-id={commandId}
      onClick={onClick}
      style={{ "--command-tone": command.tone, "--object-accent": visual.accent }}
      title={command.action}
      type="button"
    >
      <FunctionalObject commandId={commandId} />
      <span className="command-copy">
        <strong>{command.label}</strong>
        <small>{visual.purpose}</small>
      </span>
    </button>
  );
}

function ProgramBlock({ commandId, index, loopTarget = "", runState = "", onRemove }) {
  const command = commandCatalog[commandId];
  const visual = getCommandVisual(commandId);
  return (
    <button
      aria-label={`Quitar ${command.label}`}
      className={`program-block object-${visual.kind} ${loopTarget ? "loop-target-block" : ""} ${runState}`}
      data-program-command={commandId}
      onClick={onRemove}
      style={{ "--command-tone": command.tone, "--object-accent": visual.accent }}
      type="button"
    >
      <span className="step-number">{index + 1}</span>
      <FunctionalObject commandId={commandId} compact />
      <strong>{command.label}</strong>
      {loopTarget ? <span className="loop-target-badge">{loopTarget}</span> : null}
    </button>
  );
}

function FunctionalObject({ commandId, compact = false }) {
  const command = commandCatalog[commandId];
  const visual = getCommandVisual(commandId);
  const Icon = commandIcons[commandId] || Sparkles;
  const drawnArt = getCommandArt(commandId);
  return (
    <span
      aria-hidden="true"
      className={`functional-object object-${visual.kind} ${compact ? "compact" : ""}`}
      style={{ "--object-accent": visual.accent, "--command-tone": command.tone }}
    >
      {visual.asset ? (
        <img alt="" src={visual.asset} />
      ) : drawnArt ? (
        drawnArt
      ) : (
        <span className="functional-glyph">
          <Icon size={compact ? 18 : 24} />
        </span>
      )}
      {visual.count ? <em>{visual.count}</em> : null}
    </span>
  );
}

function Board({ challenge, frame, character, result = null }) {
  const { board } = challenge;
  const lookups = boardLookups(board);
  const tiles = [];
  for (let y = 0; y < board.rows; y += 1) {
    for (let x = 0; x < board.cols; x += 1) {
      const point = { x, y };
      const key = keyOf(point);
      const isTarget = board.target?.x === x && board.target?.y === y;
      const collectible = (board.collectibles || []).find((item) => item.x === x && item.y === y);
      const isCollected = collectible && frame.collected.has(key);
      const soundGoal = (board.soundGoals || []).find((item) => item.x === x && item.y === y);
      const isSoundDone = soundGoal && frame.sounds.has(soundKey(soundGoal));
      const isPaintGoal = lookups.paintSet.has(key);
      const isPainted = frame.painted.has(key);
      const isWaitGoal = lookups.waitSet.has(key);
      const isWaited = frame.waited.has(key);
      const isWall = lookups.wallSet.has(key);
      const isWater = lookups.waterSet.has(key);
      const isSignal = lookups.signalSet.has(key);
      const isPlainGrass =
        !isWall && !isWater && !isSignal && !isTarget && !collectible && !soundGoal && !isPaintGoal && !isWaitGoal;
      const hasTuft = isPlainGrass && (x * 7 + y * 13) % 5 === 0;
      tiles.push(
        <div
          className={[
            "tile",
            lookups.wallSet.has(key) ? "wall" : "",
            lookups.waterSet.has(key) ? "water" : "",
            lookups.signalSet.has(key) ? "signal" : "",
            isTarget ? "target" : "",
            isPaintGoal ? "paint-goal" : "",
            isPainted ? "painted" : "",
            isWaitGoal ? "wait-goal" : "",
            isWaited ? "waited" : "",
            soundGoal ? "sound-goal" : "",
            isSoundDone ? "sound-done" : "",
          ].join(" ")}
          key={key}
        >
          {isWater ? <PuddleArt /> : null}
          {isWall ? <HedgeArt /> : null}
          {isSignal ? <SignalArt corner={Boolean(isTarget || collectible)} /> : null}
          {isTarget ? <TargetArt /> : null}
          {isPaintGoal && !isPainted ? <PaintOutlineArt /> : null}
          {isPainted ? <SplatArt /> : null}
          {isWaitGoal ? <ClockArt done={isWaited} /> : null}
          {hasTuft ? <GrassTuft /> : null}
          {collectible && !isCollected ? <CollectibleArt label={collectible.label} /> : null}
          {soundGoal ? <SoundGoalArt command={soundGoal.command} done={isSoundDone} /> : null}
        </div>,
      );
    }
  }

  return (
    <div
      className="board"
      style={{
        "--cols": board.cols,
        "--rows": board.rows,
      }}
    >
      {tiles}
      <div className="player-layer" style={{ "--px": frame.x, "--py": frame.y }}>
        <Player character={character} frame={frame} result={result} />
      </div>
    </div>
  );
}

function Player({ character, frame, result = null }) {
  const actor =
    character.name === "Start" || character.name === "Stop" || character.name === "Again" ? characters.go : character;
  // Solo Go y Hop son recortes transparentes; el resto de AVIF son escenas y quedan mal como ficha.
  const spriteAsset = actor.name === "Go" || actor.name === "Hop" ? actor.asset : null;
  const drawnActor =
    actor.name === "Moo" ? (
      <CowArt className="player-drawn" />
    ) : actor.name === "Cluck" ? (
      <ChickArt className="player-drawn" />
    ) : null;
  return (
    <div
      aria-label={`${actor.name} mirando ${directionVectors[frame.dir].label}`}
      className={`player ${frame.crashed ? "crashed" : ""} ${result === "success" ? "celebrate" : ""}`}
      data-dir={frame.dir}
      style={{ "--dir": `${directionVectors[frame.dir].angle}deg` }}
    >
      {spriteAsset ? (
        <img className="player-asset" src={spriteAsset} alt="" data-official-player="true" />
      ) : drawnActor ? (
        drawnActor
      ) : (
        <Mascot character={actor} token />
      )}
      <span aria-hidden="true" className="direction-arrow" />
    </div>
  );
}

function Mascot({ character, small = false, token = false }) {
  const gradientId = `grad-${character.name.replace(/[^a-z0-9]/gi, "")}`;
  const className = ["mascot", `shape-${character.shape}`, small ? "small" : "", token ? "token" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      aria-label={`${character.name}, ${character.role}`}
      className={className}
      role="img"
      style={{ "--c1": character.colors[0], "--c2": character.colors[1] }}
      viewBox="0 0 120 120"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={character.colors[0]} />
          <stop offset="1" stopColor={character.colors[1]} />
        </linearGradient>
      </defs>
      {shapeBody(character.shape, gradientId)}
      {character.shape === "cow" ? (
        <>
          <path className="patch" d="M30 38 C42 21 58 28 56 45 C51 57 34 55 30 38 Z" />
          <path className="patch" d="M74 72 C87 61 99 70 93 87 C80 94 70 88 74 72 Z" />
        </>
      ) : null}
      {character.shape === "beak" ? <path className="beak" d="M58 62 L99 72 L58 86 Z" /> : null}
      <path className="shine" d="M33 30 C45 20 68 18 81 26" />
      <circle className="eye" cx="45" cy="57" r="7" />
      <circle className="eye" cx="75" cy="57" r="7" />
      <circle className="spark" cx="47" cy="54" r="2" />
      <circle className="spark" cx="77" cy="54" r="2" />
      <path className="mouth" d="M43 76 C53 88 69 88 79 76" />
      <path className="foot left" d="M33 108 C39 115 49 115 53 108" />
      <path className="foot right" d="M67 108 C73 115 83 115 87 108" />
    </svg>
  );
}

function shapeBody(shape, gradientId) {
  const fill = `url(#${gradientId})`;
  if (shape === "triangle") return <path className="body" d="M60 12 L112 104 H8 Z" fill={fill} />;
  if (shape === "hex") return <path className="body" d="M36 10 H84 L113 39 V81 L84 110 H36 L7 81 V39 Z" fill={fill} />;
  if (shape === "octagon") return <path className="body" d="M40 8 H80 L112 40 V80 L80 112 H40 L8 80 V40 Z" fill={fill} />;
  if (shape === "stamp") return <path className="body" d="M20 18 H100 V78 C86 80 84 101 60 101 C36 101 34 80 20 78 Z" fill={fill} />;
  if (shape === "loop") return <path className="body" d="M27 38 C43 10 78 10 94 38 C111 67 92 105 60 105 C28 105 9 67 27 38 Z" fill={fill} />;
  if (shape === "cow") return <rect className="body" x="13" y="18" width="94" height="84" rx="22" fill={fill} />;
  if (shape === "beak") return <path className="body" d="M18 24 H78 C100 24 111 41 103 58 C113 76 100 99 75 101 H18 Z" fill={fill} />;
  if (shape === "star") return <path className="body" d="M60 8 L73 42 L110 43 L80 65 L90 104 L60 82 L30 104 L40 65 L10 43 L47 42 Z" fill={fill} />;
  if (shape === "circle") return <circle className="body" cx="60" cy="60" r="49" fill={fill} />;
  return <rect className="body" x="13" y="15" width="94" height="90" rx="27" fill={fill} />;
}

export default App;
