// src/components/Dashboard.tsx
import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, Copy } from "lucide-react";
import Error from "@/components/error";
import useFetch from "@/hooks/useFetch";
import { getUrls } from "@/db/apiUrls";
import { UrlContext } from "@/context/UrlContext";
import { getClicksForUrls } from "@/db/clickApi";
import LinkCard from "@/components/link-card";

// Raw API response including user_id and created_at
interface RawUrl {
  id: string;
  title: string;
  short_url: string;
  user_id: string;
  created_at: string;
}

// Simplified URL type for UI
interface Url {
  id: string;
  title: string;
  short_url: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [stats, setStats] = useState({ linksCreated: 0, totalClicks: 0 });
  const { user } = useContext(UrlContext);

  // Fetch raw URLs
  const {
    data: rawUrlsData,
    loading: loadingUrls,
    error: fetchUrlsError,
    fn: fetchUrls,
    // @ts-ignore
  } = useFetch<RawUrl[], [string]>(getUrls);

  // Fetch clicks
  const {
    data: clicksData,
    loading: loadingClicks,
    error: fetchClicksError,
    fn: fetchClicks,
  } = useFetch<{ id: string; url_id: string; timestamp: string }[], [string[]]>(
    getClicksForUrls
  );

  // Trigger fetch URLs when user ID available
  useEffect(() => {
    if (user?.id) fetchUrls(user.id);
  }, [user?.id]);

  // Trigger fetch clicks when URLs loaded
  useEffect(() => {
    if (rawUrlsData?.length) fetchClicks(rawUrlsData.map((u) => u.id));
  }, [rawUrlsData]);

  // Compute stats
  useEffect(() => {
    setStats({
      linksCreated: rawUrlsData?.length ?? 0,
      totalClicks: clicksData?.length ?? 0,
    });
  }, [rawUrlsData, clicksData]);

  // Map raw data to UI URLs
  const urls: Url[] = rawUrlsData
    ? rawUrlsData.map(({ id, title, short_url, created_at }) => ({ id, title, short_url, created_at }))
    : [];

  // Apply filter
  const filteredUrls = urls.filter((u) =>
    u.title.toLowerCase().includes(filter.toLowerCase())
  );

  const isLoading = loadingUrls || loadingClicks;
  const error: Error | null =
    (fetchUrlsError as Error | null) || (fetchClicksError as Error | null);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-3xl font-extrabold mb-8 text-center">
        Dashboard Overview
      </h2>

      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <BarLoader width={200} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="border-blue-300 hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="flex items-center space-x-2">
            <LinkIcon size={20} className="text-blue-600" />
            <CardTitle className="text-lg">Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center text-blue-700">
              {stats.linksCreated}
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-300 hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="flex items-center space-x-2">
            <Copy size={20} className="text-green-600 rotate-90" />
            <CardTitle className="text-lg">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center text-green-700">
              {stats.totalClicks}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">My Links</h3>
          <Button className="px-6 py-2">Create Link</Button>
        </div>

        <Input
          type="text"
          placeholder="Search links..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-6"
        />

        {filteredUrls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUrls.map((link) => {
              const clickCount =
                clicksData?.filter((c) => c.url_id === link.id).length ?? 0;
              return (
                <LinkCard
                  key={link.id}
                  title={link.title}
                  shortUrl={link.short_url}
                  clickCount={clickCount}
                  createdAt={link.created_at}
                />
              );
            })}
          </div>
        ) : (
          <Card className="opacity-80">
            <CardContent>
              <p className="text-center text-gray-500">No links found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {error && <Error message={String(error.message)} />}
    </div>
  );
};

export default Dashboard;
