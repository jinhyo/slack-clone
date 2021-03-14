import useInput from "@hooks/useInput";
// import useSocket from '@hooks/useSocket';
import { IDM } from "@typings/db";
import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { useCallback, useEffect, useRef } from "react";
import gravatar from "gravatar";
import { useParams } from "react-router";
import useSWR, { useSWRInfinite } from "swr";
import { Container } from "@pages/Channel/styles";
import { Header } from "@pages/SignUp/styles";

const DireactMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR("/api/users", fetcher);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img
          src={gravatar.url(userData.email, { s: "34px", d: "retro" })}
          alt={userData.nickname}
        />
        <span>{userData.nickname}</span>
      </Header>
      {/* <ChatList chatSections={chatSections} scrollRef={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} /> */}
    </Container>
  );
};

export default DireactMessage;
