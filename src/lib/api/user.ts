import type { User } from '../../types/User';

export async function fetchAllUsers() {
		try {
			const response = await fetch('http://localhost:9090/api/getUsers', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return await response.json();
		} catch (error) {
			console.log(error);
		}
}

export async function fetchUser(userId: string) {
	try {
		const response = await fetch(`http://localhost:9090/api/getUser/${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return await response.json();
	} catch (error) {
		console.log(error);
	}
}

//TODO: Implement delete user
/*export async function deleteUser(userId: string) {

}*/

export async function updateUser(user: User) {
	try {
		const response = await fetch(`http://localhost:9090/api/users/${user.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		});
		const success = await response.json();
		if (success) {
			console.log('User updated successfully');
		} else {
			console.error('Failed to update user');
		}
	} catch (error) {
		console.error('Error updating user:', error);
	}
}

export async function deleteUser(userId: string) {
	try {
		const response = await fetch(`http://localhost:9090/api/deleteUser/${userId}`, {
			method: 'DELETE'
		});
		const success = await response.json();
		if (success) {
			console.log('User deleted successfully');
		} else {
			console.error('Failed to delete user');
		}
	} catch (error) {
		console.error('Error deleting user:', error);
	}
}
