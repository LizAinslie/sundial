import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import PageLayout from "../../components/PageLayout";
import { getServerAuthSession } from "../../server/auth";

const AdminIndex: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sundial - Administration</title>
      </Head>
      <PageLayout>
        {/* todo: admin layout */}
      </PageLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerAuthSession({ req, res })

  // restrict access to admins only
  if (!(session?.user.admin)) return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };

  return {
    props: {},
  }
}

export default AdminIndex;

