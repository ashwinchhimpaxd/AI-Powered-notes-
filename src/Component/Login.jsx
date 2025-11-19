
import LoginForm from "../Pages/LoginForm"
function Login() {
    return (
        <div className=" relative w-full min-h-screen">

            <div className="flex flex-col md:flex-row w-full h-full bg-black  ">

                <img src="https://images.unsplash.com/photo-1658652313714-3f9317ad8bd4?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="login-image" className="w-full md:w-1/2 h-[100vh] md:h-screen object-cover" />
                <div className="absolute top-0 left-0 w-full h-full md:static md:w-1/2 flex items-center justify-center ">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default Login