import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoutes() {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    let user = null;

    if (auth?.userInfo) {
        user = auth?.userInfo;
    }
    // todo: handle when the token in invalid, logout, the user.
    return user ? <Outlet /> : <Navigate to="/Auth" />;
}
