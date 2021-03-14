import React, { FC, useCallback, useState, VFC } from "react";
import axios from "axios";
import userSWR from "swr";
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
import { Redirect, Route, Switch } from "react-router";
import gravatar from "gravatar";
import loadable from "@loadable/component";
import Menu from "@components/Menu/Menu";
import { Link } from "react-router-dom";
import { IUser, IWorkspace } from "@typings/db";

const Channel = loadable(() => import("@pages/Channel/Channel"));
const DirectMessage = loadable(() => import("@pages/DirectMessage/DirectMessage"));

const Workspace: VFC = () => {
  const { data: userData, error, mutate } = userSWR<IUser | false>("/api/users", fetcher);

  const [showUserMenu, setShowUserMenu] = useState(false);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onLogout = useCallback(() => {
    axios
      .post("/api/users/logout")
      .then(() => {
        mutate(false, false);
      })
      .catch((err) => console.error(err));
  }, []);

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
              console.log(
                "🚀 ~ file: Workspace.tsx ~ line 111 ~ {userData?.Workspaces.map ~ ws",
                ws
              );
              return (
                <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                  <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                </Link>
              );
            })}
            aaa
            <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
          </Workspaces>
          <Channels>
            <WorkspaceName /* onClick={toggleWorkspaceModal} */>Sleact</WorkspaceName>
            <MenuScroll>
              {/*   <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
            <WorkspaceModal>
              <h2>Sleact</h2>
              <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
              <button onClick={onClickAddChannel}>채널 만들기</button>
              <button onClick={onLogout}>로그아웃</button>
            </WorkspaceModal>
          </Menu> */}
              {/*    <ChannelList />
          <DMList /> */}
            </MenuScroll>
          </Channels>
          <Chats>
            <Switch>
              <Route path="/workspace/channel" component={Channel} />
              <Route path="/workspace/dm/:id" component={DirectMessage} />
              {/* api의 시작이 /workspace여야지 적용됨 : nested route*/}
            </Switch>
          </Chats>
        </WorkspaceWrapper>
      }
      {/* <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
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
    </Modal> */}
      {/* <CreateChannelModal
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
    /> */}
    </div>
  );
};

export default Workspace;
