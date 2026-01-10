import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public router  */}
          <Route path="/signup" element={<SignUpPage></SignUpPage>} />
          <Route path="/signin" element={<SignInPage></SignInPage>} />
          <Route path="*" element={<NotFound></NotFound>}></Route>

          {/* protected router  */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage></HomePage>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
