import React, { FC, useCallback, useEffect, useState, VFC } from "react";
import axios from "axios";
import useSWR from "swr";
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from "@layouts/Workspace/styles";
import fetcher from "@utils/fetcher";
import { Redirect, Route, Switch, useParams } from "react-router";
import gravatar from "gravatar";
import loadable from "@loadable/component";
import Menu from "@components/Menu/Menu";
import { Link } from "react-router-dom";
import { IChannel, IUser, IWorkspace } from "@typings/db";
import useInput from "@hooks/useInput";
import Modal from "@components/Modal/Modal";
import { toast } from "react-toastify";
import { Input, Label, Button } from "@pages/SignUp/styles";
import CreateChannelModal from "@components/CreateChannelModal/CreateChannelModal";
import InviteWorkspaceModal from "@components/InviteWorkspaceModal/InviteWorkspaceModal";
import InviteChannelModal from "@components/InviteChannelModal/InviteChannelModal";
import ChannelList from "@components/ChannelList/ChannelList";
import DMList from "@components/DMList/DMList";
import useSocket from "@hooks/useSocket";

const Channel = loadable(() => import("@pages/Channel/Channel"));
const DirectMessage = loadable(() => import("@pages/DirectMessage/DirectMessage"));

const Workspace: VFC = () => {
  const { data: userData, error, revalidate, mutate } = useSWR<IUser | false>(
    "/api/users",
    fetcher
  );
  const { workspace } = useParams<{ workspace: string }>();
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher
  );
  console.log("🚀 ~ file: Workspace.tsx ~ line 43 ~ channelData", channelData);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkpsace] = useInput("");
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput("");
  const [socket, disconnect] = useSocket(workspace);

  useEffect(() => {
    if (channelData && userData && socket) {
      console.log(socket);
      socket.emit("login", { id: userData.id, channels: channelData.map((v) => v.id) });
    }
  }, [socket, channelData, userData]);
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [workspace, disconnect]);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
    setShowInviteChannelModal(false);
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);

  const onLogout = useCallback(() => {
    axios
      .post("/api/users/logout")
      .then(() => {
        mutate(false, false);
      })
      .catch((err) => console.error(err));
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;

      axios
        .post("/api/workspaces", {
          workspace: newWorkspace,
          url: newUrl,
        })
        .then(() => {
          revalidate();
          setShowCreateWorkspaceModal(false);
          setNewWorkpsace("");
          setNewUrl("");
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: "bottom-center" });
        });
    },
    [newWorkspace, newUrl]
  );

  if (userData === undefined) {
    return <div>로딩 중...</div>;
  }

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg
              src={gravatar.url("sosilion@naver.com", { s: "28px", d: "retro" })}
              alt={userData.nickname}
            />
            {showUserMenu && (
              <Menu
                style={{ right: 0, top: 38 }}
                show={showUserMenu}
                onCloseModal={onCloseUserProfile}
              >
                <ProfileModal>
                  <img
                    src={gravatar.url(userData.nickname, { s: "36px", d: "retro" })}
                    alt={userData.nickname}
                  />

                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>

      {
        <WorkspaceWrapper>
          <Workspaces>
            {userData?.Workspaces.map((ws: IWorkspace) => {
              return (
                <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                  <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                </Link>
              );
            })}
            <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
          </Workspaces>
          <Channels>
            <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
            <MenuScroll>
              <Menu
                show={showWorkspaceModal}
                onCloseModal={toggleWorkspaceModal}
                style={{ top: 95, left: 80 }}
              >
                <WorkspaceModal>
                  <h2>Sleact</h2>
                  <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                  <button onClick={onClickAddChannel}>채널 만들기</button>
                  <button onClick={onLogout}>로그아웃</button>
                </WorkspaceModal>
              </Menu>
              <ChannelList />
              <DMList />
            </MenuScroll>
          </Channels>
          <Chats>
            <Switch>
              <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
              <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
              {/* api의 시작이 /workspace여야지 적용됨 : nested route*/}
            </Switch>
          </Chats>
        </WorkspaceWrapper>
      }
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        {/* Input이 있을 경우 onChange가 될 때마다 리랜더링 되기 때문에 따로 component로 작성하는게 좋음 */}
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </div>
  );
};

export default Workspace;
