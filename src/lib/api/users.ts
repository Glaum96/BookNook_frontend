import type { User } from '../../types/User'
import { API_BASE_URL } from '$lib/config'

const getAuthToken = () => {
	return localStorage.getItem('authToken')
}

export async function fetchAllUsers() {
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/getUsers`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		return await response.json()
	} catch (error) {
		console.log(error)
	}
}

export async function fetchUser(userId: string) {
	try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/getUser/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        if (!text) {
            throw new Error('Empty response body');
        }
        const user = JSON.parse(text)
        return user;
	} catch (error) {
		console.log(error)
	}
}

export async function updateUser(user: User) {
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(user),
		})
		const success = await response.json()
		if (success) {
			console.log('User updated successfully')
		} else {
			console.error('Failed to update user')
		}
	} catch (error) {
		console.error('Error updating user:', error)
	}
}

export async function deleteUser(userId: string) {
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/deleteUser/${userId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.ok) {
			console.log('User deleted successfully');
		} else {
			console.error('Failed to delete user');
		}
	} catch (error) {
		console.error('Error deleting user:', error);
	}
}

export const addUserToLocalStorage = async (userId: string) => {
	const user = await fetchUser(userId)
	localStorage.setItem('user', JSON.stringify(user))
}

export const getUserFromLocalStorage = () => {
	const user = localStorage.getItem('user')
	if (user) {
		return JSON.parse(user) as User
	}
	return null
}
