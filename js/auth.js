import {
    auth
} from "./firebase.js";

import {
    carregar
} from "./storage.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// =====================================
// CONFIGURAÇÃO GOOGLE
// =====================================

const provider = new GoogleAuthProvider();


// =====================================
// SISTEMA DE BALÕES / TOAST
// =====================================

export function toast(
    mensagem,
    tipo = "error"
) {

    // Remove toast anterior
    const antigo = document.getElementById(
        "toastRSDEv"
    );

    if (antigo) {
        antigo.remove();
    }


    // =================================
    // CORES
    // =================================

    const cores = {
        error: "#dc2626",
        success: "#16a34a",
        warning: "#f59e0b",
        info: "#2563eb"
    };


    // =================================
    // ÍCONES
    // =================================

    const icones = {
        error: "✕",
        success: "✓",
        warning: "⚠",
        info: "ℹ"
    };


    const cor =
        cores[tipo] || cores.error;

    const icone =
        icones[tipo] || icones.error;


    // =================================
    // TÍTULO
    // =================================

    let titulo;

    switch (tipo) {

        case "success":
            titulo = "Sucesso";
            break;

        case "warning":
            titulo = "Atenção";
            break;

        case "info":
            titulo = "Informação";
            break;

        default:
            titulo = "Erro";
            break;
    }


    // =================================
    // CRIA BALÃO
    // =================================

    const balao =
        document.createElement("div");

    balao.id = "toastRSDEv";


    // =================================
    // ESTRUTURA
    // =================================

    const iconeDiv =
        document.createElement("div");

    Object.assign(
        iconeDiv.style,
        {
            width: "42px",
            height: "42px",
            minWidth: "42px",
            borderRadius: "50%",
            background: cor,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "21px",
            fontWeight: "bold"
        }
    );

    iconeDiv.textContent = icone;


    const conteudo =
        document.createElement("div");

    Object.assign(
        conteudo.style,
        {
            flex: "1",
            color: "#111827",
            fontFamily: "Arial, Helvetica, sans-serif"
        }
    );


    const tituloDiv =
        document.createElement("div");

    Object.assign(
        tituloDiv.style,
        {
            fontSize: "14px",
            fontWeight: "bold",
            color: cor,
            marginBottom: "4px"
        }
    );

    tituloDiv.textContent = titulo;


    const mensagemDiv =
        document.createElement("div");

    Object.assign(
        mensagemDiv.style,
        {
            fontSize: "14px",
            lineHeight: "1.4",
            wordBreak: "break-word"
        }
    );

    // Evita interpretar HTML dentro da mensagem
    mensagemDiv.textContent = String(
        mensagem ?? ""
    );


    conteudo.appendChild(tituloDiv);
    conteudo.appendChild(mensagemDiv);


    // =================================
    // BOTÃO FECHAR
    // =================================

    const fechar =
        document.createElement("button");

    fechar.id =
        "fecharToastRSDEv";

    fechar.type =
        "button";

    fechar.setAttribute(
        "aria-label",
        "Fechar"
    );

    fechar.textContent = "×";


    Object.assign(
        fechar.style,
        {
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#6b7280",
            fontSize: "22px",
            padding: "4px",
            lineHeight: "1"
        }
    );


    // =================================
    // MONTA TOAST
    // =================================

    balao.appendChild(iconeDiv);
    balao.appendChild(conteudo);
    balao.appendChild(fechar);


    // =================================
    // ESTILO DO BALÃO
    // =================================

    Object.assign(
        balao.style,
        {
            position: "fixed",
            top: "25px",
            right: "25px",
            zIndex: "99999",
            width: "360px",
            maxWidth: "calc(100vw - 40px)",
            padding: "15px",
            background: "white",
            borderRadius: "14px",
            boxShadow:
                "0 10px 35px rgba(0,0,0,.20)",
            borderLeft:
                `5px solid ${cor}`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxSizing: "border-box",
            animation:
                "toastEntrarRSDEv .3s ease"
        }
    );


    // =================================
    // ANIMAÇÕES
    // =================================

    if (
        !document.getElementById(
            "toastRSDEvStyle"
        )
    ) {

        const style =
            document.createElement("style");

        style.id =
            "toastRSDEvStyle";

        style.textContent = `

            @keyframes toastEntrarRSDEv {

                from {
                    opacity: 0;
                    transform: translateX(40px);
                }

                to {
                    opacity: 1;
                    transform: translateX(0);
                }

            }

            @keyframes toastSairRSDEv {

                from {
                    opacity: 1;
                    transform: translateX(0);
                }

                to {
                    opacity: 0;
                    transform: translateX(40px);
                }

            }

        `;

        document.head.appendChild(
            style
        );
    }


    // =================================
    // ADICIONA NA PÁGINA
    // =================================

    if (!document.body) {
        return;
    }

    document.body.appendChild(
        balao
    );


    // =================================
    // FUNÇÃO PARA FECHAR
    // =================================

    let fechado = false;

    function fecharToast() {

        if (fechado) {
            return;
        }

        if (
            !document.body.contains(
                balao
            )
        ) {
            return;
        }

        fechado = true;

        balao.style.animation =
            "toastSairRSDEv .3s ease";

        setTimeout(() => {

            if (
                document.body.contains(
                    balao
                )
            ) {
                balao.remove();
            }

        }, 300);
    }


    // =================================
    // BOTÃO FECHAR
    // =================================

    fechar.addEventListener(
        "click",
        fecharToast
    );


    // =================================
    // FECHAR AUTOMATICAMENTE
    // =================================

    setTimeout(
        fecharToast,
        5000
    );
}


// =====================================
// TRADUZIR ERROS DO FIREBASE
// =====================================

function mensagemErroFirebase(
    error
) {

    console.error(
        "Código do erro Firebase:",
        error?.code
    );


    switch (error?.code) {

        case "auth/popup-closed-by-user":

            return (
                "A janela de login foi fechada."
            );


        case "auth/popup-blocked":

            return (
                "O navegador bloqueou a janela de login."
            );


        case "auth/cancelled-popup-request":

            return (
                "Outra tentativa de login já está em andamento."
            );


        case "auth/network-request-failed":

            return (
                "Não foi possível conectar ao servidor. Verifique sua internet."
            );


        case "auth/user-disabled":

            return (
                "Esta conta foi desativada."
            );


        case "auth/unauthorized-domain":

            return (
                "Este domínio não está autorizado no Firebase."
            );


        case "auth/operation-not-allowed":

            return (
                "O login com Google não está habilitado no Firebase."
            );


        case "auth/internal-error":

            return (
                "Ocorreu um erro interno no Firebase."
            );


        case "auth/invalid-credential":

            return (
                "As credenciais de login são inválidas."
            );


        case "auth/account-exists-with-different-credential":

            return (
                "Já existe uma conta usando este e-mail com outro método de login."
            );


        case "auth/too-many-requests":

            return (
                "Foram feitas muitas tentativas. Aguarde alguns instantes e tente novamente."
            );


        case "auth/user-not-found":

            return (
                "Usuário não encontrado."
            );


        default:

            return (
                error?.message ||
                "Não foi possível realizar a operação."
            );
    }
}


// =====================================
// TELA DE LOGIN
// =====================================

export function mostrarTelaLogin() {

    const pagina =
        document.getElementById(
            "page-content"
        );


    if (!pagina) {

        console.error(
            "Elemento #page-content não encontrado."
        );

        return;
    }


    pagina.innerHTML = `

        <div style="
            max-width:420px;
            margin:80px auto;
            text-align:center;
            color:black;
            background:white;
            padding:30px;
            border-radius:20px;
            box-shadow:
                0 10px 30px
                rgba(0,0,0,.1);
            box-sizing:border-box;
        ">

            <h2>
                Finanças RSDEv
            </h2>

            <p style="
                margin:15px 0;
            ">

                Entre para acessar
                seus dados financeiros.

            </p>

            <button
                id="btnGoogleLogin"
                class="botaoclick"
                type="button"
            >

                Entrar com Google

            </button>

        </div>

    `;


    const botao =
        document.getElementById(
            "btnGoogleLogin"
        );


    if (botao) {

        botao.addEventListener(
            "click",
            loginGoogle
        );
    }
}


// =====================================
// LOGIN GOOGLE
// =====================================

export async function loginGoogle() {

    try {

        await signInWithPopup(
            auth,
            provider
        );

        /*
         * Não é necessário chamar renderDashboard()
         * aqui. O onAuthStateChanged() será acionado
         * automaticamente após o login.
         */

        toast(
            "Login realizado com sucesso.",
            "success"
        );

    } catch (error) {

        console.error(
            "Erro ao realizar login:",
            error
        );


        toast(
            mensagemErroFirebase(
                error
            ),
            "error"
        );
    }
}


// =====================================
// MONITORAMENTO DE SESSÃO
// =====================================

onAuthStateChanged(
    auth,
    async (user) => {

        // =============================
        // USUÁRIO LOGADO
        // =============================

        if (user) {

            window.usuarioLogado =
                user;


            try {

                await carregar();


                /*
                 * IMPORTANTE:
                 *
                 * renderDashboard() precisa
                 * existir no escopo global ou
                 * ser importado de outro módulo.
                 */

                if (
                    typeof window.renderDashboard ===
                    "function"
                ) {

                    window.renderDashboard();

                } else {

                    console.warn(
                        "renderDashboard() não foi encontrada."
                    );
                }


            } catch (error) {

                console.error(
                    "Erro ao carregar dados:",
                    error
                );


                toast(
                    "Não foi possível carregar seus dados.",
                    "error"
                );
            }


        } else {

            // Limpa usuário global
            window.usuarioLogado =
                null;


            mostrarTelaLogin();
        }
    }
);


// =====================================
// LOGOUT GOOGLE
// =====================================

export async function logoutGoogle() {

    const confirmar =
        window.confirm(
            "Deseja realmente sair da conta?"
        );


    if (!confirmar) {
        return;
    }


    try {

        await signOut(
            auth
        );


        /*
         * O onAuthStateChanged()
         * também será executado aqui
         * e mostrará a tela de login.
         */

        toast(
            "Logout realizado com sucesso.",
            "success"
        );


    } catch (error) {

        console.error(
            "Erro ao realizar logout:",
            error
        );


        toast(
            mensagemErroFirebase(
                error
            ),
            "error"
        );
    }
}


// =====================================
// DADOS DO USUÁRIO
// =====================================

export function usuarioAtual() {

    return auth.currentUser;
}


// =====================================
// VERIFICA LOGIN
// =====================================

export function estaLogado() {

    return !!auth.currentUser;
}


// =====================================
// EXIGIR LOGIN
// =====================================

export function exigirLogin() {

    console.log(
        "exigirLogin executou"
    );


    // =============================
    // NÃO ESTÁ LOGADO
    // =============================

    if (!auth.currentUser) {

        console.log(
            "usuario nao logado"
        );


        toast(
            "Faça login para acessar essa área.",
            "warning"
        );


        mostrarTelaLogin();


        return false;
    }


    // =============================
    // ESTÁ LOGADO
    // =============================

    return true;
}


// =====================================
// DISPONIBILIZAR GLOBALMENTE
// =====================================

window.toast =
    toast;

window.exigirLogin =
    exigirLogin;

window.usuarioAtual =
    usuarioAtual;

window.logoutGoogle =
    logoutGoogle;

window.loginGoogle =
    loginGoogle;