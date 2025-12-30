import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="*" element={<NotFound></NotFound>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
