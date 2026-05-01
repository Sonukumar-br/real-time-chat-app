import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../main";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      

      try {
        const result = await axios.get(
          `${serverURL}/api/user/current`,
          { withCredentials: true }
        );

        dispatch(setUserData(result.data));
        localStorage.setItem("userData", JSON.stringify(result.data));

      } catch (error) {
        console.log("ERROR:", error.response?.data || error.message);
         // ✅ fallback (IMPORTANT FIX)
  const data = localStorage.getItem("userData");
  if (data) {
    dispatch(setUserData(JSON.parse(data)));
  }
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;