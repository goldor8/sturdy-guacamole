let apiURL = "http://localhost:3000" as String

export class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ApiError";
    }
}

export function setApiURL(url: String){
    apiURL = url
}

export async function register(username: String, password: String): Promise<any>{
    const response = await post('/auth/register', {username, password})

    saveTokenToCookies(response.token)

    return response
}

export async function authenticate(username: String, password: String): Promise<any>{
    const response = await post('/auth/login', {username, password})
    
    saveTokenToCookies(response.token)

    return response
}

export async function logout(): Promise<any>{
    clearTokenFromCookies()
}

export function clearTokenFromCookies() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export function saveTokenToCookies(token: String) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString(); // 24 hour expiration
    document.cookie = `token=${token}; expires=${expires}; path=/`;
}

export function getTokenFromCookies() {
    const cookies = document.cookie.split(';');
    let token = null;
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('token=')) {
            token = cookie.substring('token='.length);
            if (token == "undefined") {
                token = null;
            }
            break;
        }
    }
    
    return token;
}

export function isAuthenticated() {
    const token = getTokenFromCookies()
    
    return token !== null
}

export async function get(route: String, params: any){
    let url = new URL(`${apiURL}${route}`)

    if(params) url.search = new URLSearchParams(params).toString()
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    if(!response.ok){
        const jsonResponse = await response.json()
        if(jsonResponse.success === false){
            throw new ApiError(jsonResponse.error)
        }

        throw new Error(response.statusText)
    }

    return (await response.json()).data
}

export async function post(route: String, params: any){
    const response = await fetch(`${apiURL}${route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: params ? JSON.stringify(params) : null
    })
    
    if(!response.ok){
        const jsonResponse = await response.json()
        if(jsonResponse.success === false){
            throw new ApiError(jsonResponse.error)
        }

        throw new Error(response.statusText)
    }

    return (await response.json()).data
}

export async function getSecure(route: String, params: any){
    const token = getTokenFromCookies()
    if(!token) throw new Error("No token found")
    
    let url = new URL(`${apiURL}${route}`)
    if(params) url.search = new URLSearchParams(params).toString()
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    })
    
    if(!response.ok){
        const jsonResponse = await response.json()
        if(jsonResponse.success === false){
            throw new ApiError(jsonResponse.error)
        }

        throw new Error(response.statusText)
    }

    return (await response.json()).data
}

export async function postSecure(route: String, params: any){
    const token = getTokenFromCookies()
    if(!token) throw new Error("No token found")

    const response = await fetch(`${apiURL}${route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: params ? JSON.stringify(params) : null
    })
    
    if(!response.ok){
        const jsonResponse = await response.json()
        if(jsonResponse.success === false){
            throw new ApiError(jsonResponse.error)
        }

        throw new Error(response.statusText)
    }

    return (await response.json()).data
}

export async function postSecureSpecialParms(route: String, params: any){
    const token = getTokenFromCookies()
    if(!token) throw new Error("No token found")
    
    const response = await fetch(`${apiURL}${route}`, {
        method: 'POST',
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: params
    })
    
    if(!response.ok){
        const jsonResponse = await response.json()
        if(jsonResponse.success === false){
            throw new ApiError(jsonResponse.error)
        }

        throw new Error(response.statusText)
    }

    return (await response.json()).data
}

export async function putSecure(route: String, params: any){
    const token = getTokenFromCookies()
    if(!token) throw new Error("No token found")
    
    const response = await fetch(`${apiURL}${route}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: params ? JSON.stringify(params) : null
    })
    
    if(!response.ok){
        const jsonResponse = await response.json()
        if(jsonResponse.success === false){
            throw new ApiError(jsonResponse.error)
        }
        throw new Error(response.statusText)
    }

    return (await response.json()).data
}

export async function deleteSecure(route: String, params: any){
    const token = getTokenFromCookies()
    if(!token) throw new Error("No token found")
    
    const response = await fetch(`${apiURL}${route}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: params ? JSON.stringify(params) : null
    })
    
    if(!response.ok){
        const jsonResponse = await response.json()
        if(jsonResponse.success === false){
            throw new ApiError(jsonResponse.error)
        }

        throw new Error(response.statusText)
    }

    return (await response.json()).data
}