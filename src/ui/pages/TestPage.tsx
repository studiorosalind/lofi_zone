import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserSession } from "../context/UserSessionContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { Home, Database, User } from "lucide-react";

export default function TestPage() {
  const { user } = useUserSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay to show skeletons
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Database Test Page</h1>
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Main
            </Button>
          </Link>
        </div>
        <p className="text-gray-400 mt-2">
          This page verifies the SQLite database connection and user data loading
        </p>
      </header>

      <main className="flex-1">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              User Session Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full bg-gray-700" />
                <Skeleton className="h-6 w-3/4 bg-gray-700" />
                <Skeleton className="h-6 w-2/3 bg-gray-700" />
                <Skeleton className="h-6 w-1/2 bg-gray-700" />
              </div>
            ) : user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-gray-700/50 p-4 rounded-lg">
                  <User className="h-10 w-10 text-blue-400" />
                  <div>
                    <h3 className="text-xl font-medium">{user.username}</h3>
                    <p className="text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">User ID</h4>
                    <p className="font-mono">{user.id}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Last Login</h4>
                    <p className="font-mono">{new Date(user.last_login).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/20 p-4 rounded-lg">
                  <h4 className="text-green-400 font-medium mb-1">✓ Database Connection Successful</h4>
                  <p className="text-gray-400 text-sm">
                    The SQLite database is properly connected and user data was successfully retrieved.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-lg">
                <h4 className="text-red-400 font-medium mb-1">⚠ No User Data Found</h4>
                <p className="text-gray-400">
                  The database connection might be working, but no user data was returned.
                  This could indicate an issue with the database setup or the user record creation.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-gray-700 pt-4">
            <p className="text-xs text-gray-400">
              The data above should show the dummy user with username "dummy_user" 
              and email "dummy@email.com" if the database is properly set up.
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Database Connection Details</h2>
          <div className="space-y-2 text-sm">
            {/* <p><span className="text-gray-400">Database Path:</span> {app.getPath('userData')}/lofi_zone.db</p> */}
            <p><span className="text-gray-400">Table:</span> lofi_zone_user</p>
            <p><span className="text-gray-400">Connection Method:</span> Electron IPC bridge via preload.cjs</p>
            <p><span className="text-gray-400">Provider:</span> UserSessionContext</p>
          </div>
        </div>
      </main>
    </div>
  );
}