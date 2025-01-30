import type { Booking } from '../../types/Booking';

export async function fetchAllBookings() {
	try {
		const response = await fetch('http://localhost:9090/api/bookings', {
			method: 'GET',
		});
		console.log(response)
		return await response.json();
	} catch (error) {
		console.log(error);
	}
}

export async function fetchMyBookings(userId: string) {
	try {
		const response = await fetch('http://localhost:9090/api/myBookings', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'User-Id': userId
			}
		});
		return await response.json();
	} catch (error) {
		console.log(error);
	}
}


export async function deleteBooking(bookingId: string) {
	try {
		const response = await fetch(`http://localhost:9090/api/deleteBooking/${bookingId}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			console.log("Booking deleted successfully");
		} else {
			console.log('Failed to delete booking');
		}
	} catch (error) {
		console.log(error);
	}
}

export async function postBooking(newBooking: Booking) {
	try {
		const response = await fetch('http://localhost:9090/api/postBooking', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newBooking)
		})
		if (response.ok) {
			await fetchMyBookings(newBooking.userId);
			console.log("Booking created successfully");
		}
	}
	catch (error) {
		console.log(error);

	}
}