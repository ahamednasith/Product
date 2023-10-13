import React, { useState,useEffect } from "react";
import {RiDashboard2Line} from "react-icons/ri";
import {MdOutlineProductionQuantityLimits} from "react-icons/md";
import {BiLogOutCircle} from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import logo from '../../images/Logo.png';

export default function Sidebar() {
    const navigate = useNavigate();
    const [activeMenuItem, setActiveMenuItem] = useState("");

    const Menu =[
        {title:"Dashboard", icon:<RiDashboard2Line/>, link:"/dashboard" },
        {title:"Products", icon:<MdOutlineProductionQuantityLimits/>, link:"/products"},
    ];
    useEffect(() => {
        const storedActiveMenuItem = localStorage.getItem("activeMenuItem");
        if (storedActiveMenuItem) {
          setActiveMenuItem(storedActiveMenuItem);
        }
      }, []);
    return (
        <div className="bg-[#D2D5B2] h-screen fixed z-[5]  w-[15%]">
            <img src={logo} alt="logo"  class="relative top-[15px] w-[120px] left-[90px]"/>
            <div className="border-[1px] border-solid border-[#161B25] relative z-[0] top-[22.5px]"></div>  
            <ul className="pt-[30px] pl-[50px]">
                {Menu.map((item,index) => (
                     <li key={index} className={`flex text-[30px] hover:text-[#DA4B4B] space-x-[10px] mt-[40px] ${activeMenuItem === item.title ? "text-[#161B25]" : "text-gray-500"}`} onClick={() => {if(item.link && item.title){setActiveMenuItem(item.title);localStorage.setItem("activeMenuItem", item.title);};navigate(item.link);}}>
                     <span className="pt-[3px]">{item.icon}</span>
                     <span>{item.title}</span>
                 </li>
                ))}
                <li className={`flex hover:text-[#DA4B4B] text-[30px] space-x-[10px] mt-[40px] text-gray-500 `}  onClick={() => {navigate('/');localStorage.removeItem('activeMenuItem')}}>
                    <span className="pt-[3px]"><BiLogOutCircle /></span>
                    <span className="hover:text-[#DA4B4B]">Logout</span>
                </li>
            </ul>
        </div>
    )
}