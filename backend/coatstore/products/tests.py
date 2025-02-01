from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from products.models import Product, Size, Cart, CartItem, Order, OrderItem

class ProductTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Создаем администратора и обычного пользователя
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpassword')
        self.regular_user = User.objects.create_user(username='user', password='userpassword')
        # Создаем размеры
        self.size_38 = Size.objects.create(size_value=38)
        self.size_40 = Size.objects.create(size_value=40)
        self.size_42 = Size.objects.create(size_value=42)
        # Данные для создания товара
        self.product_data = {
            'name': 'Winter Coat',
            'description': 'A warm coat for cold weather.',
            'price': '199.99',
            'stock': 50,
            'sizes': [self.size_38.id, self.size_40.id, self.size_42.id]
        }
        # Создаем товар для дальнейших тестов (через администратора)
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/api/products/create/', self.product_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.product_id = response.data['id']
        self.client.force_authenticate(user=None)

    def test_create_product_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        new_product_data = {
            'name': 'Summer Coat',
            'description': 'A light coat for summer.',
            'price': '99.99',
            'stock': 30,
            'sizes': [self.size_38.id, self.size_40.id]
        }
        response = self.client.post('/api/products/create/', new_product_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)
        self.client.force_authenticate(user=None)

    def test_create_product_as_non_admin(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.post('/api/products/create/', self.product_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.force_authenticate(user=None)

    def test_update_product_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        update_data = {
            'name': 'Updated Coat',
            'description': 'Updated description.',
            'price': '150.00',
            'stock': 40,
            'sizes': [self.size_38.id]  # Изменяем размеры на один вариант
        }
        response = self.client.put(f'/api/products/update/{self.product_id}/', update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_product = Product.objects.get(id=self.product_id)
        self.assertEqual(updated_product.name, 'Updated Coat')
        self.assertEqual(updated_product.stock, 40)
        self.assertEqual(updated_product.sizes.count(), 1)
        self.client.force_authenticate(user=None)

    def test_update_product_as_non_admin(self):
        self.client.force_authenticate(user=self.regular_user)
        update_data = {
            'name': 'Hacker Coat',
            'description': 'Should not update.',
            'price': '10.00',
            'stock': 5,
            'sizes': [self.size_42.id]
        }
        response = self.client.put(f'/api/products/update/{self.product_id}/', update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.force_authenticate(user=None)

    def test_delete_product_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(f'/api/products/{self.product_id}/delete/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=self.product_id).exists())
        self.client.force_authenticate(user=None)

    def test_delete_product_as_non_admin(self):
        # Создаем новый товар для теста удаления обычным пользователем
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/api/products/create/', self.product_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        product_id = response.data['id']
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.delete(f'/api/products/{product_id}/delete/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Product.objects.filter(id=product_id).exists())
        self.client.force_authenticate(user=None)

class CartTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.size = Size.objects.create(size_value=40)
        self.product = Product.objects.create(
            name='Test Product',
            description='A product for testing.',
            price=50.00,
            stock=5
        )
        self.product.sizes.add(self.size)
        # Очистка корзины для пользователя
        Cart.objects.filter(user=self.user).delete()

    def test_add_to_cart_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/cart/add/', {'product_id': self.product.id, 'quantity': 2}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cart = Cart.objects.get(user=self.user)
        self.assertEqual(cart.items.count(), 1)
        self.assertEqual(cart.items.first().quantity, 2)
        self.client.force_authenticate(user=None)

    def test_add_to_cart_exceed_stock(self):
        self.client.force_authenticate(user=self.user)
        # Попытка добавить количество, превышающее запас (запас = 5)
        response = self.client.post('/api/cart/add/', {'product_id': self.product.id, 'quantity': 10}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.client.force_authenticate(user=None)

    def test_add_nonexistent_product_to_cart(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/cart/add/', {'product_id': 9999, 'quantity': 1}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.client.force_authenticate(user=None)

    def test_remove_from_cart_authenticated(self):
        self.client.force_authenticate(user=self.user)
        cart, _ = Cart.objects.get_or_create(user=self.user)
        cart_item = CartItem.objects.create(cart=cart, product=self.product, quantity=2)
        response = self.client.delete(f'/api/cart/remove/{cart_item.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(cart.items.count(), 0)
        self.client.force_authenticate(user=None)

    def test_remove_from_cart_unauthenticated(self):
        session_key = self.client.session.session_key
        if not session_key:
            self.client.session.create()
            session_key = self.client.session.session_key
        cart, _ = Cart.objects.get_or_create(session_key=session_key)
        cart_item = CartItem.objects.create(cart=cart, product=self.product, quantity=2)
        response = self.client.delete(f'/api/cart/remove/{cart_item.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(cart.items.count(), 0)

class OrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='orderuser', password='orderpassword')
        self.admin = User.objects.create_superuser(username='orderadmin', password='adminpassword')
        self.size = Size.objects.create(size_value=42)
        self.product = Product.objects.create(
            name='Order Product',
            description='For order testing.',
            price=75.00,
            stock=10
        )
        self.product.sizes.add(self.size)
        # Создаем корзину и добавляем товар для пользователя
        self.cart, _ = Cart.objects.get_or_create(user=self.user)
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)

    def test_create_order_from_cart(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/orders/create/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order_data = response.data
        self.assertEqual(order_data['customer'], self.user.username)
        self.assertEqual(len(order_data['items']), 1)
        self.assertAlmostEqual(float(order_data['total_price']), 150.00)
        # Проверяем, что корзина очищена
        self.assertEqual(self.cart.items.count(), 0)
        self.client.force_authenticate(user=None)

    def test_order_list_and_detail(self):
        # Создаем заказ
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/orders/create/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order_id = response.data['id']
        # Получаем список заказов
        response = self.client.get('/api/orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Если пагинация включена, ответ имеет ключ 'results'
        orders = response.data.get('results', response.data)
        self.assertTrue(any(order['id'] == order_id for order in orders))
        # Детали заказа
        response = self.client.get(f'/api/orders/{order_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], order_id)
        self.client.force_authenticate(user=None)

    def test_update_order_status_as_admin(self):
        # Создаем заказ от пользователя
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/orders/create/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order_id = response.data['id']
        # Обновляем статус заказа от администратора
        self.client.force_authenticate(user=self.admin)
        update_data = {'status': 'shipped'}
        response = self.client.put(f'/api/orders/{order_id}/update-status/', update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_order = Order.objects.get(id=order_id)
        self.assertEqual(updated_order.status, 'shipped')
        self.client.force_authenticate(user=None)

    def test_update_order_status_as_non_admin(self):
        # Создаем заказ от пользователя
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/orders/create/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order_id = response.data['id']
        # Пытаемся обновить статус заказа неадминистратором
        self.client.force_authenticate(user=self.user)
        update_data = {'status': 'completed'}
        response = self.client.put(f'/api/orders/{order_id}/update-status/', update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.force_authenticate(user=None)

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_user_registration(self):
        registration_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword'
        }
        response = self.client.post('/api/register/', registration_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_user_login_success(self):
        # Создаем пользователя
        user = User.objects.create_user(username='loginuser', password='loginpassword')
        login_data = {
            'username': 'loginuser',
            'password': 'loginpassword'
        }
        response = self.client.post('/api/login/', login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'loginuser')

    def test_user_login_failure(self):
        login_data = {
            'username': 'nonexistent',
            'password': 'wrongpassword'
        }
        response = self.client.post('/api/login/', login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)