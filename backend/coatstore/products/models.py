from django.db import models
from django.utils import timezone
# Для привязки заказов к пользователю
from django.contrib.auth.models import User

# Модель размера


class Size(models.Model):
    # Числовое значение размера, например: 38, 40, 42
    size_value = models.PositiveIntegerField()
    # Описание размера (опционально)
    description = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return str(self.size_value)

# Модель продукта (пальто)


class Product(models.Model):
    name = models.CharField(max_length=255)  # Название товара
    description = models.TextField()  # Описание товара
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Цена товара
    stock = models.IntegerField()  # Количество товара на складе
    # Связь с моделью Size, один товар может иметь несколько размеров
    sizes = models.ManyToManyField(Size)

    def __str__(self):
        return self.name

# Промежуточная модель для связи заказа и товаров


class OrderItem(models.Model):
    order = models.ForeignKey(
        'Order', on_delete=models.CASCADE, related_name='items')  # Связь с заказом
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE)  # Связь с продуктом
    quantity = models.PositiveIntegerField(
        default=1)  # Количество товара в заказе

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

# Модель заказа


class Order(models.Model):
    customer = models.ForeignKey(
        User, on_delete=models.CASCADE, default=1)  # Связь с пользователем
    created_at = models.DateTimeField(
        default=timezone.now)  # Дата создания заказа
    total_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True)  # Общая сумма заказа
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    ]
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='processing')  # Статус заказа

    def __str__(self):
        return f"Order #{self.id} by {self.customer.username}"

    def calculate_total_price(self):
        """Автоматически считает общую сумму заказа"""
        self.total_price = sum(item.product.price *
                               item.quantity for item in self.items.all())
        self.save()

# Модель корзины


class Cart(models.Model):
    # Связь с пользователем (опционально)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)
    # Для неавторизованных пользователей
    session_key = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Cart {self.id} for User {self.user.username if self.user else 'Anonymous'}"

# Промежуточная модель для связи корзины и товаров


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Cart {self.cart.id}"
