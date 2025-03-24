import { Routes, Route, Link } from "react-router-dom";

const Student_Login_Page = () => {
    return (
        <div className="rounded-lg shadow-lg bg-blue-300 w-screen h-screen justify-center items-center flex flex-col flex-wrap">
            <div className="bg-white absolute w-full h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[90vh]">
                <img src="\Std_Login_Page.jpg"
                     alt="Library Image" className="w-full h-full object-cover object-center" />
              <div className="absolute bottom-0 left-8 w-full h-32 bg-gradient-to-b from-transparent to-blue-300"></div>
            </div>
            <div className="z-20 flex flex-col justify-center items-center bg-blue-300/40 hover:bg-blue-300/70 border rounded-lg border-black">
                <h1 className=" z-20 font-bold text-center text-gray-800 mb-4">Student Account</h1>
                <form>
                    <input type="text" className="container rounded-full border-2 p-2 m-2 ml-5 w-[90%] text-black text-lg font-bold" placeholder="Enter Username"></input>
                    <input placeholder="Enter Password" type="password" className="container rounded-full border-2 p-2 m-2 ml-5 w-[90%] text-black text-lg font-bold"></input>
                </form>
                <div className="flex flex-wrap text-xl text-black font-bold p-2">
                    Don't have an account?<Link to="/stdsignup" className="ml-1"style={{ color: "blue"}}>Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Student_Login_Page;