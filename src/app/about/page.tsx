"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import ChatOptionToggle from '@/components/ui/chatOptionToggle';
import { hourglass } from 'ldrs';
import { bouncy } from 'ldrs'
import HowToSection from '@/components/homepage/howTo';



import { newtonsCradle } from 'ldrs'
import OptionsList from '@/components/optionsFilter';

newtonsCradle.register()

bouncy.register()
hourglass.register()


export default function aboutPage() {
  const [skipClarifications, setSkipClarifications] = useState(false);



  // Default values shown
  // <div className="grid-cols-5 p-10">


  //   <l-newtons-cradle
  //     size="78"
  //     speed="1.4"
  //     color="black"
  //   />



  //   <l-hourglass
  //     size="40"
  //     bg-opacity="0.1"
  //     speed="1.75"
  //     color="black"
  //   />
  //   <l-bouncy
  //     size="45"
  //     speed="1.75"
  //     color="black"
  //   />
  // </div>


  return (
    <div></div>
  );
};


