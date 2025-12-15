import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
    Users, 
    FolderOpen, 
    Image, 
    TrendingUp, 
    Activity,
    Calendar,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { accountService } from "../../services/accountService.js";
import { projectService } from "../../services/projectService.js";
import { photoService } from "../../services/photoService.js";

// Component Stat Card
function StatCard({ title, value, icon: Icon, trend, trendValue, color, link }) {
    const colorClasses = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        purple: "bg-purple-500",
        orange: "bg-orange-500",
        pink: "bg-pink-500",
        indigo: "bg-indigo-500"
    };

    const bgColorClasses = {
        blue: "bg-blue-50",
        green: "bg-green-50",
        purple: "bg-purple-50",
        orange: "bg-orange-50",
        pink: "bg-pink-50",
        indigo: "bg-indigo-50"
    };

    const CardContent = (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">{title}</p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">{value}</p>
                    
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs sm:text-sm ${
                            trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {trend === 'up' ? (
                                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                                <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                            <span className="font-semibold">{trendValue}</span>
                            <span className="text-gray-500">vs last month</span>
                        </div>
                    )}
                </div>
                
                <div className={`${bgColorClasses[color]} p-2 sm:p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${colorClasses[color].replace('bg-', 'text-')}`} />
                </div>
            </div>
        </div>
    );

    return link ? (
        <Link to={link}>
            {CardContent}
        </Link>
    ) : (
        CardContent
    );
}

// Component Recent Activity Item
function ActivityItem({ icon: Icon, title, description, time, color }) {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        purple: "bg-purple-100 text-purple-600",
        orange: "bg-orange-100 text-orange-600"
    };

    return (
        <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`p-2 rounded-lg ${colorClasses[color]} flex-shrink-0`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{title}</p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{description}</p>
                <p className="text-xs text-gray-400 mt-1">{time}</p>
            </div>
        </div>
    );
}

// Component Quick Action Card
function QuickActionCard({ title, description, icon: Icon, color, link }) {
    const colorClasses = {
        blue: "bg-blue-500 hover:bg-blue-600",
        green: "bg-green-500 hover:bg-green-600",
        purple: "bg-purple-500 hover:bg-purple-600",
        orange: "bg-orange-500 hover:bg-orange-600"
    };

    return (
        <Link to={link}>
            <div className={`${colorClasses[color]} text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group`}>
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 opacity-80 group-hover:scale-110 transition-transform" />
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{title}</h3>
                <p className="text-xs sm:text-sm opacity-90">{description}</p>
            </div>
        </Link>
    );
}

// Component Top Project Item
function TopProjectItem({ project, rank }) {
    const rankColors = {
        1: "bg-yellow-100 text-yellow-800 border-yellow-300",
        2: "bg-gray-100 text-gray-800 border-gray-300",
        3: "bg-orange-100 text-orange-800 border-orange-300"
    };

    return (
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base border-2 ${rankColors[rank] || 'bg-blue-100 text-blue-800 border-blue-300'} flex-shrink-0`}>
                {rank}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{project.name}</p>
                <p className="text-xs text-gray-500">{project.imageCount} images</p>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{project.imageCount}</span>
            </div>
        </div>
    );
}

// Main Dashboard Component
function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProjects: 0,
        totalImages: 0,
        activeProjects: 0,
        recentUploads: 0,
        storageUsed: 0
    });

    const [recentActivities, setRecentActivities] = useState([]);
    const [topProjects, setTopProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [accounts, projects, photos] = await Promise.all([
                accountService.getAll(),
                projectService.getAll(),
                photoService.getAll()
            ]);

            // Calculate stats
            const activeProjects = projects.filter(p => p.status === 'active').length;
            
            // Get recent uploads (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentUploads = photos.filter(p => 
                new Date(p.uploadedAt) > sevenDaysAgo
            ).length;

            // Calculate storage (in MB)
            const totalStorage = photos.reduce((sum, photo) => sum + (photo.fileSize || 0), 0);
            const storageInMB = (totalStorage / (1024 * 1024)).toFixed(2);

            setStats({
                totalUsers: accounts.length,
                totalProjects: projects.length,
                totalImages: photos.length,
                activeProjects,
                recentUploads,
                storageUsed: storageInMB
            });

            // Get top projects by image count
            const projectsWithCounts = projects.map(project => ({
                ...project,
                imageCount: photos.filter(p => parseInt(p.projectId) === parseInt(project.id)).length
            })).sort((a, b) => b.imageCount - a.imageCount).slice(0, 5);

            setTopProjects(projectsWithCounts);

            // Generate recent activities
            const activities = [
                ...photos.slice(-5).reverse().map(photo => ({
                    icon: Image,
                    title: "New Image Uploaded",
                    description: photo.title || photo.fileName,
                    time: formatTimeAgo(photo.uploadedAt),
                    color: "blue"
                }))
            ];

            setRecentActivities(activities.slice(0, 5));

        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Unknown';
        
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="ml-16 lg:ml-64 pt-20 p-4 sm:p-6 lg:p-8 pb-24 min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
                    <div className="text-center">
                        <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ml-16 lg:ml-64 pt-20 px-4 sm:px-6 lg:px-8 pb-24 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 lg:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        📊 Dashboard
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Welcome back! Here's what's happening with your projects today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={Users}
                        trend="up"
                        trendValue="+12%"
                        color="blue"
                        link="/admin/accountmanagement"
                    />
                    <StatCard
                        title="Total Projects"
                        value={stats.totalProjects}
                        icon={FolderOpen}
                        trend="up"
                        trendValue="+8%"
                        color="green"
                        link="/admin/projectmanagement"
                    />
                    <StatCard
                        title="Total Images"
                        value={stats.totalImages}
                        icon={Image}
                        trend="up"
                        trendValue="+23%"
                        color="purple"
                        link="/admin/allimages"
                    />
                    <StatCard
                        title="Active Projects"
                        value={stats.activeProjects}
                        icon={Activity}
                        color="orange"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 lg:mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div>
                                <p className="text-xs sm:text-sm opacity-90 mb-1 sm:mb-2">Recent Uploads</p>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{stats.recentUploads}</p>
                                <p className="text-xs sm:text-sm opacity-75 mt-1">Last 7 days</p>
                            </div>
                            <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 opacity-50" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div>
                                <p className="text-xs sm:text-sm opacity-90 mb-1 sm:mb-2">Storage Used</p>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{stats.storageUsed} MB</p>
                                <p className="text-xs sm:text-sm opacity-75 mt-1">Total storage</p>
                            </div>
                            <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-6 lg:mb-8">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <QuickActionCard
                            title="New Project"
                            description="Create a new project"
                            icon={FolderOpen}
                            color="blue"
                            link="/admin/projectmanagement"
                        />
                        <QuickActionCard
                            title="Upload Images"
                            description="Add images to project"
                            icon={Image}
                            color="green"
                            link="/imageupload"
                        />
                        <QuickActionCard
                            title="Manage Users"
                            description="View and edit users"
                            icon={Users}
                            color="purple"
                            link="/admin/accountmanagement"
                        />
                        <QuickActionCard
                            title="View Gallery"
                            description="Browse all images"
                            icon={PieChart}
                            color="orange"
                            link="/gallery"
                        />
                    </div>
                </div>

                {/* Bottom Section - Recent Activity & Top Projects */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Activity</h2>
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </div>

                        {recentActivities.length === 0 ? (
                            <div className="text-center py-8 sm:py-12 text-gray-500">
                                <Activity className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-xs sm:text-sm">No recent activity</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {recentActivities.map((activity, index) => (
                                    <ActivityItem key={index} {...activity} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Top Projects */}
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900">Top Projects</h2>
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </div>

                        {topProjects.length === 0 ? (
                            <div className="text-center py-8 sm:py-12 text-gray-500">
                                <FolderOpen className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-xs sm:text-sm">No projects yet</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {topProjects.map((project, index) => (
                                    <TopProjectItem 
                                        key={project.id} 
                                        project={project} 
                                        rank={index + 1} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;