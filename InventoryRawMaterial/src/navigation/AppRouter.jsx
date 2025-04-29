import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {routes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
    </Router>
  );
};

export default AppRouter;
