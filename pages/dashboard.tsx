// src/components/Dashboard.tsx
import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Error from "@/components/error";
import useFetch from "@/hooks/useFetch";
import { getUrls } from "@/db/apiUrls";
import { UrlContext } from "@/context/UrlContext";
import { getClicksForUrls } from "@/db/clickApi";

interface Url {
  id: string;
  title: string;
  short_url: string;
}

interface Click {
  id: string;
  url_id: string;
  timestamp: string;
}

const Dashboard: React.FunctionComponent = () => {
  const [filter, setFilter] = useState("");
  const [stats, setStats] = useState({ linksCreated: 0, totalClicks: 0 });

  const { user } = useContext(UrlContext);

  const {
    data: urlsData,
    loading: loadingUrls,
    error: fetchUrlsError,    // now an Error | null
    fn: fetchUrls,
  } = useFetch<Url[], [string]>(getUrls);

  const {
    data: clicksData,
    loading: loadingClicks,
    error: fetchClicksError,  // now an Error | null
    fn: fetchClicks,
  } = useFetch<Click[], [string[]]>(getClicksForUrls);

  // 1) fetch URLs on mount
  useEffect(() => {
    if (user?.id) fetchUrls(user.id);
  }, [user?.id]);

  // 2) when URLs arrive, fetch clicks
  useEffect(() => {
    if (urlsData?.length) {
      fetchClicks(urlsData.map((u) => u.id));
    }
  }, [urlsData]);

  // 3) compute stats
  useEffect(() => {
    setStats({
      linksCreated: urlsData?.length ?? 0,
      totalClicks: clicksData?.length ?? 0,
    });
  }, [urlsData, clicksData]);

  const urls = urlsData ?? [];
  const filteredUrls = urls.filter((u) =>
    u.title.toLowerCase().includes(filter.toLowerCase())
  );

  const isLoading = loadingUrls || loadingClicks;
  // error is either Error or null
  const error: Error | null = (fetchUrlsError as Error | null) || (fetchClicksError as Error | null);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Dashboard Overview
      </h2>

      {/* Loader */}
      {isLoading && (
        <div className="mb-8">
          <BarLoader width="100%" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg">Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-center">
              {stats.linksCreated}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-center">
              {stats.totalClicks}
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">My Links</h3>
          <Button className="px-4 py-2">Create Link</Button>
        </div>

        <Input
          type="text"
          placeholder="Search links..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4"
        />

        {filteredUrls.length > 0 ? (
          filteredUrls.map((link) => (
            <Card
              key={link.id}
              className="hover:shadow-md transition-shadow duration-200 mb-2"
            >
              <CardContent>
                <p className="text-center font-medium">{link.title}</p>
                <p className="text-center text-sm text-blue-500">{link?.short_url}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent>
              <p className="text-center text-gray-500">No links found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Error */}
      {error && <Error message={String(error.message)} />}
    </div>
  );
};

export default Dashboard;
