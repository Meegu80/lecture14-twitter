import { Link, Outlet, useNavigate } from "react-router";
import styled from "styled-components";
import { FaHome, FaUserCog } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { auth } from "../firebase.ts";

const Wrapper = styled.div`
    width: 100%;
    max-width: 860px;
    padding: 50px 0;
    display: flex;
    gap: 20px;
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
`;

const MenuItem = styled.div`
    width: 35px;
    height: 35px;
    border: 2px solid white;
    font-size: 16px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

function Layout() {
    const navigate = useNavigate();

    const onLogOut = async () => {
        // 사용자에게 진짜 로그아웃할 것인지 물어보고
        const ok = confirm("정말로 로그아웃 하시겠습니까?");
        if (ok) {
            // 로그아웃 처리
            await auth.signOut();
            // 사용자 이동 -> /login
            navigate("/login");
        }
    };

    return (
        <Wrapper>
            <Menu>
                <Link to={"/"}>
                    <MenuItem>
                        <FaHome />
                    </MenuItem>
                </Link>
                <Link to={"/profile"}>
                    <MenuItem>
                        <FaUserCog />
                    </MenuItem>
                </Link>
                <MenuItem onClick={onLogOut}>
                    <MdLogout />
                </MenuItem>
            </Menu>
            <Outlet />
        </Wrapper>
    );
}

export default Layout;
