import { User, LogOut, X, Settings, Music, Clock } from "lucide-react";
import { useUserSession } from "../../context/UserSessionContext";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

interface UserProfilePopupProps {
  onClose: () => void;
}

export default function UserProfilePopup({ onClose }: UserProfilePopupProps) {
  const { user, logout } = useUserSession();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Placeholder data for user stats
  const userStats = {
    playlists: 3,
    listenTime: "24h 35m",
    joinDate: "April 2025",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-[400px] bg-gray-900/90 border-gray-800 text-white shadow-xl">
        <CardHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-semibold">Your Profile</CardTitle>
          <CardDescription className="text-gray-400">
            Manage your account and preferences
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* User Profile Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-blue-500">
              <AvatarImage src={user?.user_profile_pic || "/placeholder-user.jpg"} alt={user?.user_name} />
              <AvatarFallback className="bg-blue-900 text-blue-100">
                {user?.user_name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="text-xl font-medium">{user?.user_name}</h3>
              <p className="text-gray-400 text-sm">{user?.user_credential_id || "No email"}</p>
              <p className="text-gray-500 text-xs mt-1">Member since {userStats.joinDate}</p>
            </div>
          </div>
          
          <Separator className="bg-gray-800" />
          
          {/* User Stats Section */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <Music className="h-5 w-5 mx-auto mb-1 text-blue-400" />
              <div className="font-medium">{userStats.playlists}</div>
              <div className="text-xs text-gray-400">Playlists</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3">
              <Clock className="h-5 w-5 mx-auto mb-1 text-purple-400" />
              <div className="font-medium">{userStats.listenTime}</div>
              <div className="text-xs text-gray-400">Listen Time</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3">
              <User className="h-5 w-5 mx-auto mb-1 text-green-400" />
              <div className="font-medium">{user?.user_uuid?.substring(0, 8) || "N/A"}</div>
              <div className="text-xs text-gray-400">User ID</div>
            </div>
          </div>
          
          <Separator className="bg-gray-800" />
          
          {/* Subscription Plan */}
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-4 border border-blue-800/50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Free Plan</h4>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">Current</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              Enjoy the basic features of Lofi Zone with limited playlists.
            </p>
            <Button variant="outline" size="sm" className="w-full bg-blue-800/30 border-blue-700/50 hover:bg-blue-800/50">
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
