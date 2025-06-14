
import LoginForm from "../Pages/LoginForm"
function Login() {
    return (
        <div className=" relative w-full h-screen ">

            <div className="absolute w-full flex h-full">

                <img src="https://images.unsplash.com/photo-1658652313714-3f9317ad8bd4?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="login-image" className="w-1/2 object-cover" />
                <LoginForm />
            </div>
        </div>
    )
}

export default Login