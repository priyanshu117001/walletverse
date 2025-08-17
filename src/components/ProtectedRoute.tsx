import { Navigate } from "react-router-dom";
import useAuth from "../store/auth";

interface Props {
  roles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ roles, children }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!roles.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
}
