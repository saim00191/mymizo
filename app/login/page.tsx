"use client"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import AlreadyLoggedInMessage from "@/components/Auth/AlreadyLoggedIn";
import LoginPage from "@/components/Auth/Login/Login";

const Home = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  return (
    <>
        {userInfo ? (
          <AlreadyLoggedInMessage/>
        ):(
          <LoginPage/>
        )}
    </>
  )
}

export default Home