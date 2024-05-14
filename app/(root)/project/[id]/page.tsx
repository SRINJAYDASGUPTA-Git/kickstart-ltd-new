'use client';
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillMail } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { BsFullscreen } from "react-icons/bs";
import { BsFullscreenExit } from "react-icons/bs";
import { storage } from "../../../../firebase";
import { ref } from "firebase/storage";
import { BiHomeAlt, BiLike, BiSolidLike } from "react-icons/bi";
import { FaRoad } from "react-icons/fa";
import Image from "next/image";
import FolderTreeView from '../../../../components/heirarcy';
import {
  GetProjectData,
  GetUserName,
  GetUserPhotoUrl,
  GetLikes,
  GetLikedList,
} from "../../../../utils/GetData.js";
import {
  convertEmailToDomain,
  IncrementLikes,
  IncrementLikedList,
  DecrementLikes,
  DecrementLikedList,
} from "../../../../utils/UpdateData";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import BottomBar from '../../../../components/shared/Bottombar';

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const { user } = useUser();
  const [project, setProject] = useState<any[]>([]);
  const topOfScreenRef = useRef<HTMLDivElement>(null);
  const [userDp, setUserDp] = useState<string>("");
  const [OwnerName, setOwnerName] = useState<string>("");
  const [ownerdpurl, setOwnerdpurl] = useState<string>("");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const projectID = params.id;
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

//   const handleSignOut = async () => {
//     try {
//       await logOut();
//     } catch (error) {
//       console.log(error);
//     }
//   };

  useEffect(() => {
    if (user) {
      const userEmailDomain = convertEmailToDomain(user.emailAddresses);
      GetLikedList(userEmailDomain)
        .then((likedList) => {
          // Check if the projectID is in the liked list
          const likedProjects = likedList.split(",");
          setLiked(likedProjects.includes(projectID));
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [user, projectID]);

  const handleLike = async () => {
    if (user) {
      const userEmailDomain = convertEmailToDomain(user.emailAddresses);

      if (liked) {
        // User wants to remove the like
        await DecrementLikes(projectID);
        await DecrementLikedList(userEmailDomain, projectID);
        setLiked(false);
        setLikeCount((prevCount) => prevCount - 1);
      } else {
        // User wants to like the project
        await IncrementLikes(projectID);
        await IncrementLikedList(userEmailDomain, projectID);
        setLiked(true);
        setLikeCount((prevCount) => prevCount + 1);
      }
    }
  };

  useEffect(() => {
    // Load the number of likes for the project
    GetLikes(projectID)
      .then((likes) => {
        setLikeCount(likes);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [projectID]);

  useEffect(() => {
    // Fetch project data
    GetProjectData(projectID)
      .then((data) => {
        setProject([data]);
      })
      .catch((error) => {
        // Handle errors if needed
        console.error(error);
      });
  }, [projectID]);

  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    if (project[0]?.owner) {
      GetUserName(project[0]?.owner)
        .then((name) => {
          setOwnerName(name);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [project]);

  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    if (project[0]?.owner) {
      GetUserPhotoUrl(project[0]?.owner)
        .then((link) => {
          setOwnerdpurl(link);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [project[0]?.owner]);
  
  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    if (user) {
      GetUserPhotoUrl(convertEmailToDomain(user.emailAddresses))
        .then((link) => {
          setUserDp(link);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [user]);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      // Scroll to the top of the screen when entering full screen
      topOfScreenRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    setIsFullScreen(!isFullScreen);
  };

  const customStoragePath = ref(storage, projectID + "/");

  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    (windowWidth >= 768 ? (
      <div ref={topOfScreenRef} className="h-full w-full bg-[#0b1539]">
        <div
          className="flex justify-between  bg-[#0b1539] sticky top-0 w-full shadow-md shadow-black"
          style={{ zIndex: 5 }}
        >
          <div className="text-white flex gap-8 text-xl place-items-center ps-5">
            <button onClick={toggleDropdown}>
              {isDropdownOpen ? (
                <RxCross1 size={30} />
              ) : (
                <GiHamburgerMenu size={30} />
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute w-fit rounded-lg shadow-lg bg-[#D9D9D9] ring-1 ring-black ring-opacity-5 mt-[270px]">
                <div
                  className="py-2 px-4"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <Link
                    href="/profile/myprofile"
                    className="block px-4 py-2 text-black"
                    role="menuitem"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="../"
                    className="block px-4 py-2 text-black"
                    role="menuitem"
                  >
                    Home
                  </Link>
                  <Link
                    href="/upload"
                    className="block px-4 py-2 text-black"
                    role="menuitem"
                  >
                    Add New Project
                  </Link>
                  <button
                    // onClick={handleSignOut}
                    className="block px-4 py-2 text-black"
                    role="menuitem"
                  >
                    Sign Out
                  </button>
                  <Link
                    href=""
                    className="block px-4 py-2 text-black"
                    role="menuitem"
                  >
                    About Us
                  </Link>
                </div>
              </div>
            )}
            <Link
              href={
                user
                  ? convertEmailToDomain(user.emailAddresses) == project[0]?.owner
                    ? `../../profile/myprofile`
                    : `../../profile/${project[0]?.owner}`
                  : "/signin"
              }
              className="text-white flex gap-8 text-xl place-items-center"
            >
              <Image
                src={ownerdpurl}
                alt="photo"
                height={50}
                width={50}
                className="rounded-full"
              />
              {OwnerName}
            </Link>
          </div>
          <div className="flex justify-between gap-4 text-white p-4 pe-10 place-items-center">
            <Link href="/profile/myprofile">
              <Image
                src={userDp}
                alt="Current User Photo"
                height={50}
                width={40}
                className="rounded-full"
              />
            </Link>

            <Link href="../../message">
              <AiFillMail size={30} />
            </Link>
            <Link href="/">
              <BiHomeAlt size={30} />
            </Link>
          </div>
        </div>
        <div className="px-[60px]">
          <div className="w-full overflow-hidden h-[50rem] bg-gradient-to-b from-[#ea64dc] to-[#0b1539] rounded-2xl mt-5">
            <div className=" w-screen flex flex-wrap items-center gap-6 pt-3 pb-5">
              <div className="ps-5 text-3xl text-white font-space-mono font-bold p-2 pe-10">
                {project[0]?.title}
              </div>
              <div className="px-10 rounded-full bg-[#9e4495] text-center">
                {project[0]?.category}
              </div>
            </div>
            <div className="flex ">
              <div className="w-1/2">
                <div className="px-10 flex flex-wrap justify-center items-center">
                  <div className="text-white font-space-mono font-bold">
                    <div className="text-white font-space-mono font-bold">
                      <div className="overflow-y-auto max-h-[550px] mb-6">
                        <style>
                          {`
                        .overflow-y-auto::-webkit-scrollbar {
                           width: 0;
                                                      }
                      `}
                        </style>
                        <p className="text-2xl">Objectives</p>
                        <p className="py-2 font-normal pb-5">
                          {project[0]?.objective}
                        </p>
                        <p className="text-2xl">Technology Used</p>
                        <p className="py-2 font-normal pb-5">
                          {project[0]?.techlang}
                        </p>
                        <p className="text-2xl">Description</p>
                        <p className="py-2 font-normal">
                          {project[0]?.description}
                        </p>
                      </div>
                      <input
                        type="text"
                        className="w-[300px] px-4 rounded-[0.6rem] bg-[#0b1539] border-[0.1rem] border-white py-0.5 ms-10 text-white placeholder-white"
                        placeholder="Add comment ..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <iframe
                  className="h-[50.7%] w-full pe-[25px]"
                  src={`https://www.youtube.com/embed/${project[0]?.yturl.substring(
                    17
                  )}`}
                ></iframe>
                <div className="flex">
                  <div className="w-fit flex text-xs py-3 justify-between gap-1">
                    {project[0]?.hashtags &&
                      project[0].hashtags
                        .split(",") // Split the hashtags by comma
                        .slice(0, 3) // Take the first three hashtags
                        .map((hashtag : string, index :number) => (
                          <span
                            key={index}
                            className="p-1 m-auto ps-2 pe-2 rounded-full border-[0.1rem] border-white text-center text-white placeholder-white"
                          >
                            {index > 0}
                            {hashtag}
                          </span>
                        ))}
                  </div>
                  <div
                    onClick={handleLike}
                    className="flex cursor-pointer text-white gap-2 justify-between place-items-center ms-[16vh] pe-[2vh]"
                  >
                    {liked ? (
                      <BiSolidLike size={30} style={{ color: "lightblue" }} />
                    ) : (
                      <BiLike size={30} />
                    )}
                    <span className="text-md">
                      {liked ? "Liked" : "Like"} ({likeCount})
                    </span>
                  </div>
                  <div className="py-2">
                    <Link href={`/roadmap/${params.id}`}>
                      <div className="flex justify-center gap-3 place-items-center border rounded-xl text-white pe-3">
                        <span className="flex flex-wrap ps-3 text-sm">
                          Roadmap
                        </span>
                        <FaRoad size={40} />
                      </div>
                    </Link>
                  </div>
                </div>
                <div
                  className="p-4 bg-[#0b1539] rounded-2xl"
                  style={{
                    position: isFullScreen ? "absolute" : "static",
                    top: 60,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: isFullScreen ? 2 : 0,
                    height: isFullScreen ? "140vh" : "auto",
                    width: isFullScreen ? "auto" : "96%",
                  }}
                >
                  <div className="flex justify-between">
                    <p
                      className="text-2xl text-white pb-4"
                      style={{ paddingTop: isFullScreen ? 10 : 0 }}
                    >
                      Folders
                    </p>
                    <button
                      onClick={toggleFullScreen}
                      className="pe-5 text-white"
                    >
                      {isFullScreen ? (
                        <BsFullscreenExit size={30} />
                      ) : (
                        <BsFullscreen size={20} />
                      )}
                    </button>
                  </div>
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: isFullScreen ? "80vh" : "30vh" }}
                  >
                    <style>
                      {`
        .overflow-y-auto::-webkit-scrollbar {
          width: 0;
        `}
                    </style>
                    <FolderTreeView storageRef={customStoragePath} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div ref={topOfScreenRef} className="w-full overflow-hidden h-screen bg-gradient-to-b from-[#ea64dc] to-[#0b1539]">
        <div className=" w-screen flex flex-wrap items-center pb-5">
          <div className="w-full flex flex-row justify-left items-center bg-[#0b1539]">
            <Link
              href={
                user
                  ? convertEmailToDomain(user.emailAddresses) == project[0]?.owner
                    ? `../../profile/myprofile`
                    : `../../profile/${project[0]?.owner}`
                  : "/signin"
              }
              className="my-3 text-white flex gap-4 text-xl place-items-center"
            >
              <Image
                src={ownerdpurl}
                alt="photo"
                height={30}
                width={30}
                className="rounded-full ms-5"
              />
              <span className="text-sm">{OwnerName}</span>
            </Link>
          </div>
          <div className="ps-5 text-3xl text-white font-space-mono font-bold p-2 pe-10">
            {project[0]?.title}
          </div>
          <div className="px-10 rounded-full bg-[#9e4495] text-center">
            {project[0]?.category}
          </div>
        </div>
        <div className="flex ">
          <div className="w-full">
            <iframe
              className="h-[25vh] w-full px-3"
              src={`https://www.youtube.com/embed/${project[0]?.yturl.substring(
                17
              )}`}
            ></iframe>
            <div className="flex flex-row">
              <div className="w-full text-xs py-3 ms-5">
                {project[0]?.hashtags &&
                  project[0].hashtags
                    .split(",") // Split the hashtags by comma
                    .slice(0, 3) // Take the first three hashtags
                    .map((hashtag : string, index : number) => (
                      <span
                        key={index}
                        className="p-1 m-auto ms-2 ps-2 pe-2 rounded-full border-[0.1rem] border-white text-center text-white placeholder-white"
                      >
                        {index > 0}
                        {hashtag}
                      </span>
                    ))}
              </div>
              <div
                onClick={handleLike}
                className="flex w-[20vh] cursor-pointer text-white gap-2 items-center"
              >
                {liked ? (
                  <BiSolidLike size={30} style={{ color: "lightblue" }} />
                ) : (
                  <BiLike size={30} />
                )}
                <span className="text-md">
                  {liked ? "Liked" : "Like"} ({likeCount})
                </span>
              </div>
              <div className="py-2">
                <Link href={`/roadmap/${params.id}`}>
                  <div className="flex justify-center gap-3 place-items-center border rounded-xl text-white pe-3">
                    <span className="flex flex-wrap ps-3 text-sm">
                      Roadmap
                    </span>
                    <FaRoad size={40} />
                  </div>
                </Link>
              </div>
            </div>
            <div className="p-4 bg-[#0b1539] rounded-2xl">
              <div className="flex justify-between">
                <p className="text-2xl text-white pb-4">Folders</p>
                <button
                  onClick={toggleFullScreen}
                  className="pe-5 text-white"
                >
                  {isFullScreen ? (
                    <BsFullscreenExit size={30} />
                  ) : (
                    <BsFullscreen size={20} />
                  )}
                </button>
              </div>
              <div
                className="overflow-y-auto"
                style={{ maxHeight: isFullScreen ? "80vh" : "30vh" }}
              >
                <FolderTreeView storageRef={customStoragePath} />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  );
}
