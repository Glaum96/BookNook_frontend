import { API_BASE_URL } from "$lib/config"

export const pingApi = async () => {
    try {
        console.log("Pinging API at: ", API_BASE_URL)
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'GET',
        })
        return response.text()
    } catch (error) {
        console.log("Error pinging API: ", error)
        return false
    }
}