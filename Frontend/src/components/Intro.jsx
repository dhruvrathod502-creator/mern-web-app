import React, { useState } from "react";
import suitcase from "../assets/suitcase.png";
import educationLogo from "../assets/education.png";
import home from "../assets/home.png";
import map from "../assets/map.png";
import heart from "../assets/heart.png";
import call from "../assets/call.png";
import { Button } from "./ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Intro = () => {
  const { user, userProfile } = useSelector((store) => store.auth);
  const [loadingIntro, setLoadingIntro] = useState(false);
  const [openIntroDialog, setOpenIntroDialog] = useState(false);
  const dispatch = useDispatch();
  const [introData, setIntroData] = useState({
    bioText: userProfile?.bio?.bioText || "Add your bio here...",
    liveIn: userProfile?.bio?.liveIn,
    relationship: userProfile?.bio?.relationship,
    workplace: userProfile?.bio?.workplace,
    education: userProfile?.bio?.education,
    phone: userProfile?.bio?.phone,
    hometown: userProfile?.bio?.hometown,
  });

  // Only show fields that have values
  const array = [
    introData.workplace && {
      icon: suitcase,
      text: `Works at ${introData.workplace}`,
    },

    introData.education && {
      icon: educationLogo,
      text: `Studied at ${introData.education}`,
    },

    introData.liveIn && {
      icon: home,
      text: `Lives in ${introData.liveIn}`,
    },

    introData.hometown && {
      icon: map,
      text: `From ${introData.hometown}`,
    },

    introData.phone && {
      icon: call,
      text: `${introData.phone}`,
    },

    introData.relationship && {
      icon: heart,
      text: `${introData.relationship}`,
    },
  ].filter(Boolean);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setIntroData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const selectCategory = (value) => {
    setIntroData({ ...introData, relationship: value });
  };
  const submitHandler = async () => {
    console.log(introData);
    try {
      setLoadingIntro(true);
      const res = await axios.put(
        `http://localhost:9000/api/v1/auth/update-intro`,
        introData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        dispatch(setUserProfile({ ...userProfile, bio: res.data.bio }));
        setOpenIntroDialog(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingIntro(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#262829] flex-1 rounded-lg p-5 h-max">
      <h1 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-200">
        Intro
      </h1>

      {/* Bio */}
      <p className="mb-5 text-gray-700 dark:text-gray-300">
        {introData.bioText || "No bio added"}
      </p>

      {/* Intro Details */}
      <div className="space-y-4 mb-5">
        {array.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <img
              src={item.icon}
              alt=""
              className="invert-50 opacity-70 w-5 h-5"
            />

            <h1 className="text-gray-700 dark:text-gray-200">{item.text}</h1>
          </div>
        ))}
      </div>

      {/* Edit Button */}

      <Dialog open={openIntroDialog} onOpenChange={setOpenIntroDialog}>
        
          
            <Button onClick={()=>setOpenIntroDialog(true)} className="w-full dark:bg-[#3a3c3d] bg-[#e1e4e8] hover:bg-[#dfe4ea] text-gray-800 dark:text-gray-200 cursor-pointer">
              Edit details
            </Button>
          

          <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-center">Edit details</DialogTitle>
              <hr className="my-2" />
              <DialogDescription>
                Details that you select will be Public and appear at the top of
                your profile.
              </DialogDescription>
            </DialogHeader>
            
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="">Bio</Label>
                  <Input
                    type="text"
                    placeholder="Tell something about yourself..."
                    name="bioText"
                    value={introData.bioText}
                    onChange={changeHandler}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="">WorkPlace</Label>
                  <Input
                    name="workplace"
                    value={introData.workplace}
                    onChange={changeHandler}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="">Education</Label>
                  <Input
                    name="education"
                    value={introData.education}
                    onChange={changeHandler}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="">Lives In</Label>
                    <Input
                      name="liveIn"
                      value={introData.liveIn}
                      onChange={changeHandler}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="">Home Town</Label>
                    <Input
                      name="hometown"
                      value={introData.hometown}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="">Phone No</Label>
                    <Input
                      name="phone"
                      value={introData.phone}
                      onChange={changeHandler}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="">Status</Label>
                    <Select onValueChange={selectCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="In a relationship">
                            In a relationship
                          </SelectItem>
                          <SelectItem value="Engaged">Engaged</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Seperated">Seperated</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            
            <DialogFooter>
              <DialogClose
                render={
                  <Button className="cursor-pointer" variant="outline">
                    Cancel
                  </Button>
                }
              />
              <Button
                disabled={loadingIntro}
                onClick={submitHandler}
                type="submit"
                className={`bg-[#0866ff] hover:bg-[#0866ff] text-white cursor-pointer `}
              >
                {loadingIntro ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4" />
                    Please wait
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        
      </Dialog>
    </div>
  );
};

export default Intro;
