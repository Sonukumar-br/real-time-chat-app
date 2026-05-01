import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;
    const fetchUsers = async () => {
      try {
        const result = await axios.get(
          `${serverURL}/api/user/others`,
          { withCredentials: true }
        );

        dispatch(setOtherUsers(result.data));

      } catch (error) {
        console.log("ERROR:", error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, [userData?._id]);
};

export default useGetOtherUsers;