import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="h-dvh w-full">
      <Outlet />
    </div>
  );
}
