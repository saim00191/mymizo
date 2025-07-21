"use client"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import AlreadyLoggedInMessage from "@/components/Auth/AlreadyLoggedIn";
import Signup from "@/components/Auth/Signup/Signup";

const Home = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  return (
    <>
        {userInfo ? (
          <AlreadyLoggedInMessage/>
        ):(
          <Signup/>
        )}
    </>
  )
}

export default Home