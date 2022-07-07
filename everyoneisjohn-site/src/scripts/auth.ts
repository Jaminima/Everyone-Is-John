import customFetch, {isLocalhost} from "./customFetch";
import doFetch from "./fetch";

export function checkAuth() {
    return new Promise((resolve, reject) => {
        customFetch("authentication/check",
            (d) => {
                resolve(d);
            }, (d) => {
                reject(d);
            }
        )
    })
}


export function login(name: any) {
    return new Promise((resolve, reject) => {
        doFetch("authentication/new?name=" + name, "POST",
            (d) => {
                if (isLocalhost) {
                    localStorage.setItem("id", d["id"]);
                    localStorage.setItem("key", d["key"]);
                }
                resolve(d);
            }, (d) => {
                reject(d);
            }
        )
    })
}