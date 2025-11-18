import GlobalServiceProvider from "./provider/GlobalServiceProvider";
import AppRoute from "./provider/AppRoute";
import { SocketProvider } from "./context/SocketContext";

export function App() {
  return (
    <SocketProvider>
      <GlobalServiceProvider>
        <AppRoute />
      </GlobalServiceProvider>
    </SocketProvider>
  );
}
