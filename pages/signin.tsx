import Head from "next/head";
import React, { ReactElement } from "react";
import SignLayout from "../components/Layout/SignLayout";
import Signin from "../containers/Auth/Signin";

function SigninPage() {
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <Signin />
    </>
  );
}

SigninPage.getLayout = function getLayout(page: ReactElement) {
  return <SignLayout>{page}</SignLayout>;
};
SigninPage.Sign = true;

export default SigninPage;
