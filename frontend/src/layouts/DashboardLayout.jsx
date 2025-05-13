import {
  FaBell,
  FaCalendarAlt,
  FaUsers,
  FaClipboardList,
  FaBoxes,
  FaUserCog,
  FaPowerOff,
} from "react-icons/fa";
import { MdOutlineTaskAlt, MdSettings } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiPackage } from "react-icons/fi";
import { BiUserCheck } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png"; // use placeholder if no profile photo

const DashboardLayout = ({ children }) => {
  const today = new Date().toLocaleDateString("en-GB"); // Format: DD/MM/YYYY

  const menuItems = [
    { label: "My Team", icon: <FaUsers />, path: "/dashboard/team" },
    {
      label: "Attendance",
      icon: <BiUserCheck />,
      path: "/dashboard/attendance",
    },
    {
      label: "Projects",
      icon: <FaClipboardList />,
      path: "/dashboard/projects",
    },
    {
      label: "Work Orders",
      icon: <IoDocumentTextOutline />,
      path: "/dashboard/work-orders",
    },
    { label: "Report", icon: <FaClipboardList />, path: "/dashboard/report" },
    { label: "Inventory", icon: <FaBoxes />, path: "/dashboard/inventory" },
    { label: "Vendors", icon: <FaUserCog />, path: "/dashboard/vendors" },
    {
      label: "Purchase Order",
      icon: <FiPackage />,
      path: "/dashboard/purchase-orders",
    },
    {
      label: "Reminders",
      icon: <MdNotificationsActive />,
      path: "/dashboard/reminders",
    },
    { label: "Task", icon: <MdOutlineTaskAlt />, path: "/dashboard/tasks" },
    { label: "Settings", icon: <MdSettings />, path: "/dashboard/settings" },
    { label: "Logout", icon: <FaPowerOff />, path: "/login" },
  ];

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-[250px] flex-shrink-0 bg-orange-500 text-white flex flex-col items-center py-6">
        <img src={logo} alt="Logo" className="w-32 mb-6" />
        <img
          src={avatar}
          alt="User"
          className="w-20 h-20 rounded-full border-4 border-white mb-2"
        />
        <div className="text-center text-sm font-semibold">sachin vadhel</div>
        <div className="text-xs text-white/80 mb-4">sachinvadhel@gmail.com</div>

        {/* Menu */}
        <nav className="flex flex-col w-full">
          {menuItems.map(({ label, icon, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition-all 
     ${isActive ? "bg-white/20 font-semibold" : ""} 
     text-white hover:bg-white/10`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <div className="flex justify-end items-center px-6 py-4 bg-white shadow z-10">
          <div className="flex gap-4 items-center">
            <button className="text-orange-500 text-xl">
              <FaBell />
            </button>
            <button className="text-orange-500 text-xl">
              <FaCalendarAlt />
            </button>
            <span className="text-sm text-blue-600 font-medium">{today}</span>
          </div>
        </div>

        {/* Children (Main page content) */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
