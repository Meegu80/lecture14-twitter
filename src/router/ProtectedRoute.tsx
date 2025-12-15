//  로그인이 안된 사용자라면, 이걸 포함하는 라우트에서
// 사용자 정보를 확인하고, 사용자 정보가 없다면 /logon으로 보내는 컴포넌트

import { auth } from "../firebase.ts";
import { Navigate } from "react-router";
import { type ReactNode } from "react";

type Props = {
    children: ReactNode;
};

function ProtectedRoute({children}: Props): ReactNode {

    const user = auth.currentUser;

    if (user === null) {
        return <Navigate to={"/login"} />
    }
    return (children)
}

export default ProtectedRoute;