import io from "socket.io-client";
import { useEffect, useState } from "react";
const socket = io.connect("http://localhost:5000");

const App = () => {
  const [sensorData, setSensorData] = useState(null);
  const [socketMessage, setSocketMessage] = useState("");

  useEffect(() => {
    if (socket) {
      // Asegurarse de que socket esté definido
      socket.on("sensorData", (data) => {
        // console.log("Datos del sensor recibidos:", data);
        setSensorData(data);
      });
      socket.on("web-receive-message", (data) => {
        // console.log("Datos del sensor recibidos:", data);
        setSocketMessage(data.message);
      });

      socket.on("connected", (data) => {
        console.log("cuando el servidor conecta con el dispositivo", data);
        // setConnected(true);
      });

      socket.on("disconnect", (data) => {
        console.log("Desconectado del servidor", data);
      });

      // Limpiar los eventos cuando se desmonte el componente
      return () => {
        socket.off("sensorData");
        socket.off("connected");
        socket.off("disconnect");
      };
    }
  }, [socket]);

  const handleEmit = () => {
    console.log("emitiendo al movil");
    socket.emit("send-message", { message: "Hola desde Vite!" });
  };
  const handleEmitWeb = () => {
    console.log("emitiendo a otra web");
    socket.emit("send-web-message", { message: "Hola para otra web!" });
  };

  return (
    <div>
      <h1>hola mundo</h1>
      <button onClick={handleEmit}>emitir al movil</button>
      <button onClick={handleEmitWeb}>emitir a otro navegador</button>
      <div>
        <h2>Datos del Sensor:</h2>
        {sensorData ? (
          <pre>{JSON.stringify(sensorData, null, 2)}</pre>
        ) : (
          <p>Esperando datos de los sensores...</p>
        )}
      </div>
      <h1>Mensaje desde otra web: {socketMessage}</h1>
    </div>
  );
};

export default App;
