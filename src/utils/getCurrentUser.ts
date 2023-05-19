import { getCookie } from "cookies-next";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext, PreviewData } from "next";

import { UserInfoInterface } from "types";

import { sendRequest } from "./api";

export async function getCurrentUser({
  req,
  res,
}: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
  const login = getCookie("login", { req, res, path: "/" });
  const password = getCookie("password", { req, res, path: "/" });
  if (!login || !password) return null;

  const response = await sendRequest<UserInfoInterface>("/login", { login, password });
  return response.success ? response.data : null;
}
