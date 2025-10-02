import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginFormValues>();
  const { login } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Email ou senha incorretos");

      login(json.token);
      toast.success("Login realizado com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao logar");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
            Área restrita
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Senha"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-600 mt-2"
            >
              Acessar
            </button>
          </form>
        </div>

        <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-10">
          <img
            src={logo}
            alt="Logo do Jornal"
            className="max-w-xs md:max-w-md lg:max-w-lg h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
