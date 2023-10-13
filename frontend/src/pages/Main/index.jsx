import React from "react";
import Sidebar from "../Sidebar";
import Dashboard from "../Dashboard";
import { useLocation } from "react-router-dom";
import Product from "../Product";

export default function Main({ setProductID }) {
    const location = useLocation();
    const email = localStorage.getItem('email');
    const SidebarSection = [
        { title: "Dashboard", tab: "Dashboard", page: <Dashboard />, link: "/dashboard" },
        { title: "Product Lists", tab: "Products", page: <Product setProductID={setProductID} />, link: "/products" },
    ]

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-[130%]">
                <div className="bg-[#000] w-[100%] left-[375px] fixed h-[75px] z-[1] blur-[5px]"></div>
                <div class="email text-[#FDFFE4] text-[20px] fixed right-[100px] top-[30px] z-[2]">{email}</div>
                <div class="fixed top-[75px] border-[1px] border-[#D2D5B2] w-[100%] z-[3]"></div>
                {SidebarSection.find(item => location.pathname === item.link)
                    ? (SidebarSection.map((section, index) => (
                        <>
                            {location.pathname === section.link && (
                                <div>
                                    {section.page}
                                </div>
                            )}
                        </>
                    ))) : null}
            </div>
        </div>
    )
}