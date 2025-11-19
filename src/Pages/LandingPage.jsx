import { Link } from "react-router-dom";
import Button from '../Component/Button';
import Navbar from '../Component/Navbar'
function LandingPage() {

    const list = [

        {
            id: 1,
            title: "Ai powered Intelligence",
            subtitle: "Smart suggestions, auto-organization, and content enhancement",
            imgurl: "public/landingpagedesign/line brain idea.svg",
        },
        {

            id: 2,
            title: "Rich Text Editor",
            subtitle: "Express your ideas with a powerful editor",
            imgurl: "public/landingpagedesign/Pen.svg",
        },
    ]
    return (
        <div id='Home' className='relative w-full max-h-auto min-h-screen selection:bg-purple-200 selection:text-black pt-12 px-8 md:px-12 overflow-x-hidden'>
            {/* navbar */}
            <nav id="navigation-bar" className="flex justify-between items-center ">
                <p className="capitalize text-[1.8rem] md:text-[2.5rem] text-[var(--primary-text-color)] text-nowrap cursor-default" style={{ color: "var(--primary-text-color)" }}>Ai note</p>
                <Link to="/signup">
                    <Button text="Get start" classNameSting="bg-[#A60003] text-[#FFFFFF] text-[1.2rem] md:text-[1.5rem] text-nowrap  capitalize flex justify-center items-center px-[1.5rem] py-[0.3rem] md:px-[2.5rem] md:py-[0.4rem] hover:scale-105 transition-all duration-300 ease-in-out hover:rotate-3 " />
                </Link>
            </nav>

            {/* maine text of the landing page  */}
            <div id="main-text-box" className="min-h-full mt-[3.3vw] flex justify-center items-center relative ">
                <div id="svg-box" className=" absolute left-[15%] top-[0.5rem] ">
                    <img src="public/landingpagedesign/Star 1.svg" alt="logo"
                        className="h-[15vw] animate-spin [animation-duration:10s] hover:scale-112 ease-in-out duration-250 max-w-none object-contain" />
                </div>

                <div id="text-box" className="uppercase flex flex-col justify-center items-center text-[5.6vw] tracking-widest" style={{ color: "var(--primary-landing-page-text-color)" }}>
                    <p>THINK</p>
                    <p>Create</p>
                    <p>organize</p>
                </div>

                <div id="svg-box" className=" absolute right-2 top-[0.5rem]">
                    <img src="public/landingpagedesign/A latter grp.svg" alt="logo"
                        className="h-[20vw] rotate-45 hover:scale-120 ease-in-out duration-450 max-w-none object-contain" />
                </div>
            </div>

            {/* features line of landing page */}
            <div id="feature-box-landingpage" className="mt-[4.5vw] flex flex-col justify-center items-center  ">
                <p className=" text-[2.3vw]  text-center tracking-widest font-[100]" style={{ color: "var(--primary-text-color)" }}>The next-generation note-taking experience that adapts to your thinking patterns.</p>
                <p className="font-bold! text-[3.3vw] text-white tracking-widest">Powered by AI.</p>
            </div>

            {/* botton  list of landing page that shows the features of the app */}

            <div id="botton-list-box" className="flex flex-col  m-auto justify-center items-center gap-[4vw] mt-[10%] mb-[5%]">
                {list.map((item) => (
                    <div key={item} className="p-4 bg-[#8E86FF] m-2 flex flex-row justify-between items-center w-[80vw] h-[14vw] rounded-[164.24px] 
                    px-[3.5vw] py-[2vw] hover:scale-106  transition-all duration-600 ease-in-out ">
                        <p className="text-white w-[30%]  text-[3vw] font-bold!">{item.title}</p>
                        <img src={item.imgurl} alt="imgs" className="w-[12vw] " />
                        <p className="text-[2.2vw]  w-[38%]  h-full flex justify-center items-center text-start font-semibold! " style={{ color: "var(--primary-landing-page-text-color)" }}>{item.subtitle}</p>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default LandingPage