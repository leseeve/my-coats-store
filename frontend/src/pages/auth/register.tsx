import React, { useState } from 'react';
import { PageLayout } from '@/layouts/PageLayout';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают!');
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Ошибка регистрации');
            } else {
                // Если регистрация успешна, получаем ответ (если нужен) или просто вызываем alert
                await response.json();
                alert('Регистрация успешна!');
            }
        } catch (err) {
            console.error('Ошибка запроса:', err);
            setError('Ошибка сервера');
        }
    };

    return (
        <PageLayout>
            <h1>Регистрация</h1>
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
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
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
                <label>
                    Подтвердите пароль:
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Зарегистрироваться</button>
            </form>
        </PageLayout>
    );
};

export default Register;
