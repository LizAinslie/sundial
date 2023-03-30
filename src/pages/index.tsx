import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import PageLayout from "../components/PageLayout";
import GpsGate from "../components/GpsGate";
import MapTile from "../components/MapTile";
import { FC, useEffect, useState } from "react";
import useLocation from "../utils/hooks/useLocation";
import SiteSearch from "../components/SiteSearch";
import { Site } from "@prisma/client";
import TimeClock from "../components/TimeClock";
import { useRouter } from "next/router";
import { getServerAuthSession } from "../server/auth";

const HomeMap: FC = () => {
  const { latitude, longitude } = useLocation();

  return <MapTile lat={latitude} lon={longitude} />;
}

const Home: NextPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [site, setSite] = useState<Site>();
  const [clockedIn, setClockedIn] = useState(false);
  const router = useRouter();
  
  function onSiteSelected(site: Site) {
    setSite(site);
  }

  return (
    <>
      <Head>
        <title>Sundial</title> 
        <meta name="theme-color" content="#bae6fd" />
      </Head>
      <PageLayout>
        {sessionStatus !== 'loading' && session?.user && <>
          {session!.user.enabled ? 
            <GpsGate>
              <div className="flex flex-grow flex-col gap-4 p-4">
                <HomeMap />

                <SiteSearch onSelect={onSiteSelected} disabled={clockedIn} />

                {site && <TimeClock
                  site={site}
                  onClockedIn={() => {
                    setClockedIn(true);
                  }}
                  onClockedOut={() => {
                    setClockedIn(false);
                  }}
                />}
              </div>
            </GpsGate>
          :
            <div className="flex flex-col flex-grow p-4 gap-4 items-center justify-center">
              <h2 className="text-2xl">Your account is disabled.</h2>
              <button className="btn-primary" onClick={() => void signOut()}>
                Sign Out
              </button>
            </div>
          }
        </>}
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerAuthSession({ req, res });
  console.log(session?.user);
  if (session?.user.expirePassword) return {
    redirect: {
      destination: '/reset-password',
      permanent: false,
    },
  };

  return {
    props: {}
  };
};

export default Home;
