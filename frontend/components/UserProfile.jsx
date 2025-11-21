import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const token = localStorage.getItem('authToken'); 

            if (!token) {
                setError('Et ole kirjautunut sisään. Token puuttuu.');
                setLoading(false);
                return;
            }

            try {

                const response = await axios.get('http://localhost:3000/users', {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });
                
                setUserData(response.data);
                
            } catch (err) {
                console.error('Suojatun datan haku epäonnistui:', err);
                const errorMessage = err.response?.data?.msg || 'Datan haku epäonnistui (Voi olla 401 Unauthorized).';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);
    if (loading) return <p>Ladataan käyttäjätietoja...</p>;
    if (error) return <p style={{ color: 'red' }}>Virhe: {error}</p>;

    return (
        <div>
            <h2>Suojatut Käyttäjätiedot</h2>
            <ul>
                {userData.map(user => (
                    <li key={user.id}>{user.username} ({user.email})</li>
                ))}
            </ul>
        </div>
    );
}