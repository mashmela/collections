import React from "react";

import { GetServerSideProps } from "next";

function Home() {
  return <div>index</div>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
    redirect: {
      destination: "/users",
    },
  };
};

export default Home;
