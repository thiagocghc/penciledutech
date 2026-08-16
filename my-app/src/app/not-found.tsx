import Link from "next/link";

export default function NotFound(){
    return(
        <>
        <div className="flex flex-col justify-center items-center">
        <h1 className="font-bold text-center mt-9 text-5xl ">Página nao encontrada</h1>
        <p> Esta página que você tentou acessar, não existe! </p>
        <Link className="" href="/"> Voltar </Link>
        </div>

        </>
    )
}