import { Routes, Route, Link } from "react-router-dom";

const Student_Login_Page = () => {
    return (
        <div className="rounded-lg shadow-lg bg-blue-300 w-screen h-screen justify-center items-center flex flex-col flex-wrap">
            <h1 className="font-bold text-center text-gray-800 mb-4">Student Account</h1>
            <div className="flex flex-col justify-center items-center bg-gray-400 border rounded-lg border-black">
                <form>
                    <input type="text" className="container rounded-full border-2 p-2 m-2 ml-5 w-[90%] text-black text-lg font-bold" placeholder="Enter Username"></input>
                    <input placeholder="Enter Password" type="password" className="container rounded-full border-2 p-2 m-2 ml-5 w-[90%] text-black text-lg font-bold"></input>
                </form>
                <div className="flex flex-wrap text-xl text-black font-bold p-2">
                    Don't have an account?<Link to="/stdsignup" className="text-blue-400 hover:text-blue-800 ml-1">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Student_Login_Page;