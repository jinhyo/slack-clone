import useInput from "@hooks/useInput";
import {
  Success,
  Form,
  Error,
  Label,
  Input,
  LinkContainer,
  Button,
  Header,
} from "@pages/SignUp/styles";
import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import useSWR from "swr";

const LogIn = () => {
  const { data, error, revalidate, mutate } = useSWR("/api/users", fetcher, {
    dedupingInterval: 10000, // 캐시 유지시간 (10초)
    revalidateOnFocus: false, // 다른 탭에 갔다가 왔을 때 다시 요청하지 않음
  });
  console.log("🚀 ~ file: Login.tsx ~ line 20 ~ LogIn ~ data", data);
  // data가 존재하지 않으면 로딩중
  // data나 error의 값이 바뀌면 자동적으로 리랜더링됨

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          "/api/users/login",
          { email, password },
          {
            withCredentials: true,
          }
        )
        .then(({ data }) => {
          mutate(data, false); // Optimistic UI
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password]
  );

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />;
  } // return은 hooks보다 항상 아래에 있어야함

  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log('로그인됨', userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChangePassword}
            />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
