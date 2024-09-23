"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartModal from "./CartModal";
import { useWixClient } from "@/hooks/useWixClient";
import Cookies from "js-cookie";
import { useCartStore } from "@/hooks/useCartStore";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cartModalRef = useRef(null);
  const cartIconRef = useRef(null);

  const profileModalRef = useRef(null);
  const profileIconRef = useRef(null);

  const router = useRouter();

  //   TEMPORARY
  // const isLoggedIn = false;

  const wixClient = useWixClient();

  const isLoggedIn = wixClient.auth.loggedIn();

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    Cookies.remove("refreshToken");
    const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    setIsLoading(false);
    setIsProfileOpen(false);
    router.push(logoutUrl);
  };

  const { cart, counter, getCart } = useCartStore();

  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartModalRef.current &&
        !cartModalRef.current.contains(event.target as Node) &&
        cartIconRef.current &&
        !cartIconRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false); // Close modal if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // }, [isCartOpen]);
  }, []);

  useEffect(() => {
    const handleProfileClickOutside = (event: MouseEvent) => {
      if (
        profileModalRef.current &&
        !profileModalRef.current.contains(event.target as Node) &&
        profileIconRef.current &&
        !profileIconRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false); // Close modal if clicked outside
      }
    };

    document.addEventListener("mousedown", handleProfileClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleProfileClickOutside);
    };
    // }, [isCartOpen]);
  }, []);

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        src="/profile.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
        ref={profileIconRef}
        // onClick={login}
      />
      {isProfileOpen && (
        <div
          ref={profileModalRef}
          className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20"
        >
          <Link href="/profile">Profile</Link>
          <div className="mt-2 cursor-pointer" onClick={handleLogout}>
            {isLoading ? "Logging out..." : "Logout"}
          </div>
        </div>
      )}
      <Image
        src="/notification.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
      />
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
        ref={cartIconRef}
      >
        <Image src="/cart.png" alt="" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-redred rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>

      {/* {isCartOpen && <CartModal />} */}
      {isCartOpen ? (
        <div ref={cartModalRef}>
          <CartModal />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default NavIcons;
