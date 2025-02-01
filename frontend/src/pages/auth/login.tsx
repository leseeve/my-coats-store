import React, { useState } from 'react';
import { PageLayout } from '@/layouts/PageLayout';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Ошибка авторизации');
            } else {
                // Если ответ успешный, можно вызвать await response.json(), если данные нужны, или просто пропустить
                await response.json();
                alert('Вы успешно вошли!');
            }
        } catch (err) {
            console.error('Ошибка запроса:', err);
            setError('Ошибка сервера');
        }
    };

    return (
        <PageLayout>
            <h1>Вход</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Логин:
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Пароль:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Войти</button>
            </form>
        </PageLayout>
    );
};

export default Login;
