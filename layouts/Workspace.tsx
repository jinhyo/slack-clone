import React, { FC, useCallback } from "react";
import axios from "axios";
import userSWR from "swr";
import fetcher from "@utils/fetcher";
import { Redirect } from "react-router";

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = userSWR("/api/users", fetcher);

  const onLogout = useCallback(() => {
    axios
      .post("/api/users/logout")
      .then(() => {
        mutate(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
