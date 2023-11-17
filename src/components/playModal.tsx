import React, { useState } from "react";
import Link from "next/link";

const Modal = () => {
  const [showModal, setShowModal] = useState(true);
  return (
    <>
      <button
        className=""
        type="button"
        onClick={() => setShowModal(true)}
      >

      </button>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-center justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-4xl font=semibold">Welcome to Ask Abe!</h3>

                </div>
                <div className="relative p-6 flex-auto ">
                  <div className="bg-gray-200 shadow-md w-96 rounded px-8 pt-6 pb-8 w-full">
                    <p>It's great to have you here. Let's embark on this exciting journey together.</p>
                  </div>
                  <div className="flex justify-between">
                    <div className=" pt-8">
                      <Link

                        href="/how to"
                        className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                        <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                        <span className="relative">I need help</span>

                      </Link>
                    </div>
                    {/* <div className=" pt-3">
                      <button
                        className="text-white bg-black active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"

                      >
                        Start Chatting
                      </button>
                    </div> */}
                  </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  {/* <button
                    className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Submit
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
