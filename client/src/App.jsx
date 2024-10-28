import io from "socket.io-client";
import { useEffect, useState } from "react";
const socket = io.connect("http://localhost:5000");

const App = () => {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    if (socket) {
      // Asegurarse de que socket esté definido
      socket.on("sensorData", (data) => {
        // console.log("Datos del sensor recibidos:", data);
        setSensorData(data);
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

  return (
    <div>
      <h1>hola mundo</h1>
      <button onClick={handleEmit}>emitir al movil</button>
      <div>
        <h2>Datos del Sensor:</h2>
        {sensorData ? (
          <pre>{JSON.stringify(sensorData, null, 2)}</pre>
        ) : (
          <p>Esperando datos de los sensores...</p>
        )}
      </div>
    </div>
  );
};

export default App;
