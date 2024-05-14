'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { convertEmailToDomain } from '@/utils/UpdateData';
import {
    GetUserName,
    GetUserPhotoUrl,
    GetAllProjectsDataUnderProfile,
    GetFollower,
    GetFollowing,
  } from "@/utils/GetData.js";
import { useUser } from '@clerk/nextjs';
const Profile = () => {
    const { id } = useParams();
    const { user } = useUser();
  const [userDp, setUserDp] = useState("");
  const [UserName, setUserName] = useState("");
  const [Followers, setFollowers] = useState(0);
  const [Following, setFollowing] = useState(0);
  const [project, setProject] = useState([]);
  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    if (user) {
      GetUserPhotoUrl(convertEmailToDomain(user.emailAddresses[0].emailAddress))
        .then((link) => {
          setUserDp(link);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [user]);

  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    if (user) {
      GetUserName(convertEmailToDomain(user.emailAddresses[0].emailAddress))
        .then((name) => {
          setUserName(name);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [user]);

  useEffect(() => {
    // Fetch project data
    if (user) {
      GetAllProjectsDataUnderProfile(convertEmailToDomain(user.emailAddresses[0].emailAddress))
        .then((name) => {
          setProject(name);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [user]);
  useEffect(() => {
    // Fetch owner's name asynchronously and update state
    if (user) {
      GetFollower(convertEmailToDomain(user.emailAddresses[0].emailAddress))
        .then((count) => {
          setFollowers(count);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
      GetFollowing(convertEmailToDomain(user.emailAddresses[0].emailAddress))
        .then((count) => {
          setFollowing(count);
        })
        .catch((error) => {
          // Handle errors if needed
          console.error(error);
        });
    }
  }, [Followers, Following]);
  console.log({
    userDp,
    UserName,
    Followers,
    Following,
    project,
  })
  return (
    <div>Profile</div>
  )
}

export default Profile