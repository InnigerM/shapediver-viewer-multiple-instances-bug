import {
  ISessionApi,
  IViewportApi,
  createSession,
  createViewport,
} from "@shapediver/viewer";
import { useEffect, useRef, useState } from "react";

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [viewPort, setViewport] = useState<IViewportApi>();
  const [session, setSesion] = useState<ISessionApi>();

  useEffect(() => {
    createShapediverSession();
  }, []);

  const createShapediverSession = async () => {
    const viewPort = await createViewport({
      canvas: canvas.current!,
      id: "viewport",
    });
    setViewport(viewPort);

    const session = await createSession({
      ticket: import.meta.env.VITE_TICKET_ID,
      modelViewUrl: import.meta.env.VITE_SHAPEDIVER_URL,
      id: "session",
    });
    setSesion(session);
  };

  const removeShapediverSession = async () => {
    await viewPort?.close();
    setViewport(undefined);

    await session?.close();
    setSesion(undefined);
  };

  const toggleShapediverSession = async () => {
    if (session && viewPort) {
      await removeShapediverSession();
    } else {
      await createShapediverSession();
    }
  };

  const changeModelWidth = async () => {
    const modelWidth = session?.getParameterByName("floor_width")[0];
    console.log(modelWidth, session);
    if (modelWidth) {
      modelWidth.value = 2500;
      session.customize();
    }
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: "20",
        }}
      >
        <button onClick={toggleShapediverSession}>Toggle Visibility</button>
        <button onClick={changeModelWidth}>Change Width</button>
      </div>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <canvas
          style={{
            width: "100%",
            height: "100%",
          }}
          ref={canvas}
        ></canvas>
      </div>
    </>
  );
}

export default App;
