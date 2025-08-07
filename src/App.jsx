import React, { Suspense } from "react";

// Lazy load components
const FoodList = React.lazy(() => import("./foods"));
const Footer = React.lazy(() => import("./footer"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FoodList />
      <Footer />
    </Suspense>
  );
}

export default App;
