"use client";
import Header from "@/components/shared/Header";
import { Project } from "@/types";
import { GetAllProjectData } from "@/utils/GetData";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]); // Provide the correct type for the projects state variable
  useEffect(() => {
    GetAllProjectData().then((data) => {
      setProjects([...data]);
    });
  }, []);
  //console.log(projects)
  return (
    <section className="bg-[#111315] w-full h-full flex flex-col">
      <Header />
      <div className="mt-20 flex flex-col items-center justify-center w-full gap-10">
        <div className="flex items-center justify-center gap-5 w-[75%] ">
          <span className="text-[45px] font-montserrat font-bold leading-loose ">
            Unlock your earning power by getting paid through your college
            projects!
          </span>
          <Image
            src={"/logo.svg"}
            width={462}
            height={378}
            alt="Kickstart Logo"
          />
        </div>

        <div className="flex items-center justify-between w-[65%] ">
          <Image
            src={"/whatis.png"}
            width={490}
            height={365}
            alt="What is KickStart?"
          />
          <p className="flex flex-col gap-6 w-1/2">
            <span className="font-bold text-[32px]">What is KickStart?</span>
            <span className="text-[24px] ">
              KickStart is the most secured and trusted platform for freelancing
              and college project showcasing, using secure and smart technology.{" "}
              <br />
              Helping students connecting their college projects to their first
              pay-check.
            </span>
          </p>
        </div>

        <div className="flex items-center justify-between w-[65%] ">
          <p className="flex flex-col gap-6 w-1/2 text-right">
            <span className="font-bold text-[32px]">How we do it?</span>
            <span className="text-[24px] ">
              Using our advanced two-step escrow based payment system, advanced
              AI roadmaps and anti-plagiarism algorithms we tend to achieve the
              impossible!
            </span>
          </p>
          <Image
            src={"/howwe.png"}
            width={490}
            height={365}
            alt="How we do it"
          />
        </div>

        <div className="flex items-center justify-between w-[65%] ">
          <Image
            src={"/whowe.png"}
            width={490}
            height={365}
            alt="Who We Cater?"
          />
          <p className="flex flex-col gap-6 w-1/2">
            <span className="font-bold text-[32px]">To Whom we cater?</span>
            <span className="text-[24px] ">
              College students, Beginners, small-medium scale freelancer
              clients, colleges and universities.
            </span>
          </p>
        </div>

        <div className="flex flex-col w-[75%] mt-5">
          <span className="text-5xl font-bold font-montserrat align-start">
            Features of KickStart!
          </span>
          <ul className="list-disc text-[32px] font-bold p-3 mt-10">
            <li>2-Step Escrow Based Payment System for payment security.</li>
            <li>College Project Showcasing for college students.</li>
            <li>
              Advanced AI Roadmaps to guide beginners to create their first
              project.
            </li>
            <li>
              E-Hackathons can be arranged by Colleges/Universities on our
              platform.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Home;
