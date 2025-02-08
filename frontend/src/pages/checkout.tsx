import React, { useState } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { useCart } from '@/context/CartContext';

const Checkout = () => {
    const { items, total, clearCart } = useCart();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        paymentMethod: 'card',
    });

    // Универсальный обработчик изменения полей
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Логика отправки данных на сервер
        console.log('Order submitted:', { items, total, ...formData });
        clearCart();
        alert('Ваш заказ успешно оформлен!');
    };

    return (
        <PageLayout>
            <h1>Оформление заказа</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Имя:
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </label>

                <label>
                    Адрес доставки:
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
                </label>

                <label>
                    Способ оплаты:
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
                        <option value="card">Карта</option>
                        <option value="paypal">PayPal</option>
                        <option value="cash">Наличные</option>
                    </select>
                </label>

                <button type="submit">Подтвердить заказ</button>
            </form>
        </PageLayout>
    );
};

export default Checkout;